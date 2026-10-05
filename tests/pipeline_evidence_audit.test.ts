import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

process.env.NODE_ENV = 'test';

import { app } from '../server';
import { runMigrations } from '../server/db/migrate';
import { isTransitionAllowed } from '../server/pipeline/stateMachine';
import { evaluateDevEvidence } from '../server/evidence';
import { db } from '../server/db';

describe('3. Pipeline Engine, Preflight, Evidence & Audit Suite', () => {
  let cookie: string;
  let csrf: string;
  let tenantId: string;
  let userId: string;
  let projectId: string;
  let runId: string;

  beforeAll(async () => {
    await runMigrations();

    const signupRes = await request(app).post('/v1/auth/signup').send({
      email: `pipe_owner_${Date.now()}@pipeline.com`,
      password: 'StrongPassword123!',
      companyName: 'Pipeline Delivery Corp',
    });

    csrf = signupRes.body.csrfToken;
    cookie = signupRes.headers['set-cookie'][0];
    tenantId = signupRes.body.tenant.id;
    userId = signupRes.body.user.id;

    // Verify User Email
    await db.query('UPDATE users SET email_verified_at = NOW() WHERE id = $1', [userId]);

    // Add Provider Connection
    const connRes = await request(app)
      .post('/v1/connections')
      .set('Cookie', cookie)
      .set('x-csrf-token', csrf)
      .send({
        type: 'gemini',
        label: 'My Production Gemini Key',
        secret: 'AIzaSyExampleGeminiApiKey1234567890',
      });

    const connId = connRes.body.connection.id;
    await db.query('UPDATE provider_connections SET status = $1, last_verified_at = NOW() WHERE id = $2', ['active', connId]);

    // Create BYOK Project
    const pRes = await request(app)
      .post('/v1/projects')
      .set('Cookie', cookie)
      .set('x-csrf-token', csrf)
      .send({ name: 'Sameer Saloon Mobile App', mode: 'byok' });

    projectId = pRes.body.project.id;

    // Assign Provider Connection to Role Slot 1
    await db.query('UPDATE role_slots SET connection_id = $1 WHERE project_id = $2 AND role = $3', [
      connId,
      projectId,
      'spec',
    ]);
  });

  describe('Pure State Machine Transition Matrix', () => {
    it('Allows legal state transitions', () => {
      expect(isTransitionAllowed('draft', 'awaiting_start', 'user')).toBe(true);
      expect(isTransitionAllowed('awaiting_start', 'verifying', 'user')).toBe(true);
      expect(isTransitionAllowed('verifying', 'dispatched', 'system')).toBe(true);
      expect(isTransitionAllowed('awaiting_review', 'approved', 'user')).toBe(true);
    });

    it('Rejects illegal state transitions', () => {
      expect(isTransitionAllowed('draft', 'approved', 'user')).toBe(false);
      expect(isTransitionAllowed('verifying', 'approved', 'agent_callback')).toBe(false);
    });
  });

  describe('Pipeline API Run & Idempotent Start', () => {
    it('POST /v1/runs creates run and 5 stage runs + gates', async () => {
      const res = await request(app)
        .post('/v1/runs')
        .set('Cookie', cookie)
        .set('x-csrf-token', csrf)
        .send({
          projectId,
          title: 'Release Run 1.0',
          intent: 'Build sameer saloon appointment booking app in gold and white',
        });

      expect(res.status).toBe(201);
      expect(res.body.run.id).toBeDefined();
      runId = res.body.run.id;
    });

    it('Double submit with same Idempotency-Key returns idempotent 200 response', async () => {
      const key = `idemp_double_${Date.now()}`;
      const res1 = await request(app)
        .post(`/v1/runs/${runId}/stages/1/start`)
        .set('Cookie', cookie)
        .set('x-csrf-token', csrf)
        .set('Idempotency-Key', key)
        .send({});

      const res2 = await request(app)
        .post(`/v1/runs/${runId}/stages/1/start`)
        .set('Cookie', cookie)
        .set('x-csrf-token', csrf)
        .set('Idempotency-Key', key)
        .send({});

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(200);
      expect(res2.body.message).toContain('already processed');
    });
  });

  describe('Evidence Collectors & Path Guard (Section 3.5)', () => {
    it('Path allow-list rejects traversal paths and secret files', () => {
      const result1 = evaluateDevEvidence('../etc/passwd', 'console.log("hi");');
      expect(result1.find((c) => c.checkName === 'dev_path_allowlisted')?.result).toBe('fail');

      const result2 = evaluateDevEvidence('.env.production', 'SECRET=123');
      expect(result2.find((c) => c.checkName === 'dev_path_allowlisted')?.result).toBe('fail');
    });

    it('Secret scan detects embedded private keys', () => {
      const result = evaluateDevEvidence('App.tsx', 'const k = "-----BEGIN PRIVATE KEY-----";');
      expect(result.find((c) => c.checkName === 'dev_secret_scan_clean')?.result).toBe('fail');
    });
  });

  describe('Separation of Duties & Audit Trail', () => {
    it('PUT /v1/tenant/settings updates separation_of_duties and logs audit event', async () => {
      const res = await request(app)
        .put('/v1/tenant/settings')
        .set('Cookie', cookie)
        .set('x-csrf-token', csrf)
        .send({ separationOfDuties: false });

      expect(res.status).toBe(200);
      expect(res.body.separationOfDuties).toBe(false);

      const { rows: events } = await db.query(
        "SELECT * FROM audit_events WHERE action = 'tenant.settings_updated' AND tenant_id = $1",
        [tenantId]
      );
      expect(events.length).toBeGreaterThan(0);
    });
  });
});
