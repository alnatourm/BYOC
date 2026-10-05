import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

process.env.NODE_ENV = 'test';

import { app } from '../server';
import { runMigrations } from '../server/db/migrate';
import { db } from '../server/db';
import { isTransitionAllowed } from '../server/pipeline/stateMachine';
import { evaluateDevEvidence } from '../server/evidence';

describe('Phase 1B Governed Pipeline & Hosting Integration Suite', () => {
  let sessionCookie: string;
  let csrfToken: string;
  let projectId: string;
  let runId: string;

  beforeAll(async () => {
    await runMigrations();

    // Signup Test Owner
    const signupRes = await request(app).post('/v1/auth/signup').send({
      email: `pipeline_owner_${Date.now()}@example.com`,
      password: 'StrongPassword123!',
      companyName: 'Pipeline Factory Corp',
    });

    csrfToken = signupRes.body.csrfToken;
    sessionCookie = signupRes.headers['set-cookie'][0];

    // Verify User Email for Preflight & Hosting Permission
    await db.query('UPDATE users SET email_verified_at = NOW() WHERE id = $1', [signupRes.body.user.id]);
  });

  describe('State Machine Pure Transition Matrix', () => {
    it('Allows valid transitions', () => {
      expect(isTransitionAllowed('draft', 'awaiting_start', 'user')).toBe(true);
      expect(isTransitionAllowed('awaiting_start', 'verifying', 'user')).toBe(true);
      expect(isTransitionAllowed('verifying', 'dispatched', 'system')).toBe(true);
      expect(isTransitionAllowed('awaiting_review', 'approved', 'user')).toBe(true);
    });

    it('Rejects illegal transitions', () => {
      expect(isTransitionAllowed('draft', 'approved', 'user')).toBe(false);
      expect(isTransitionAllowed('verifying', 'approved', 'agent_callback')).toBe(false);
    });
  });

  describe('Pipeline API Run & Preflight', () => {
    it('POST /v1/projects creates project and initializes 5 role slots', async () => {
      const res = await request(app)
        .post('/v1/projects')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({ name: 'Sameer Saloon Platform', mode: 'byok' });

      expect(res.status).toBe(201);
      expect(res.body.project.id).toBeDefined();
      projectId = res.body.project.id;

      // Add & assign provider connection so preflight passes
      const connRes = await request(app)
        .post('/v1/connections')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          type: 'gemini',
          label: 'Gemini Key for Hosting Test',
          secret: 'AIzaSyExampleGeminiApiKey1234567890',
        });

      const connId = connRes.body.connection.id;
      await db.query('UPDATE provider_connections SET status = $1, last_verified_at = NOW() WHERE id = $2', ['active', connId]);
      await db.query('UPDATE role_slots SET connection_id = $1 WHERE project_id = $2 AND role = $3', [connId, projectId, 'spec']);
    });

    it('POST /v1/runs creates run and 5 stage runs + gates', async () => {
      const res = await request(app)
        .post('/v1/runs')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          projectId,
          title: 'Sameer Saloon Release Run',
          intent: 'Build Sameer Saloon Gold & White App',
        });

      expect(res.status).toBe(201);
      expect(res.body.run.id).toBeDefined();
      runId = res.body.run.id;
    });

    it('Double-click submit with same Idempotency-Key returns idempotent dispatch', async () => {
      const key = `idemp_double_${Date.now()}`;
      const res1 = await request(app)
        .post(`/v1/runs/${runId}/stages/1/start`)
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .set('Idempotency-Key', key)
        .send({});

      const res2 = await request(app)
        .post(`/v1/runs/${runId}/stages/1/start`)
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .set('Idempotency-Key', key)
        .send({});

      expect(res1.status).toBe(202);
      expect(res2.status).toBe(200);
      expect(res2.body.message).toContain('already processed');
    });
  });

  describe('Evidence Collectors & Path Guard', () => {
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

  describe('Hosting & Deployment Plan (Phase 1B)', () => {
    let hostingId: string;

    it('POST /v1/hosting-connections adds write-only connection', async () => {
      const res = await request(app)
        .post('/v1/hosting-connections')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          type: 'hetzner_token',
          label: 'Hetzner Production CX22',
          secret: 'hetzner_sec_token_987654321',
        });

      expect(res.status).toBe(201);
      expect(res.body.connection.fingerprint).toBeDefined();
      expect(res.body.connection.secret).toBeUndefined(); // Write-only key
      hostingId = res.body.connection.id;

      // Mark hosting connection verified for deployment plan test
      await db.query('UPDATE hosting_connections SET status = $1, last_verified_at = NOW() WHERE id = $2', ['verified', hostingId]);
    });

    it('POST /v1/deployments/plan creates planned deployment with Phase 2 notice', async () => {
      const res = await request(app)
        .post('/v1/deployments/plan')
        .set('Cookie', sessionCookie)
        .set('x-csrf-token', csrfToken)
        .send({
          runId,
          hostingConnectionId: hostingId,
          topology: 'API Service + PostgreSQL + Frontend',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('planned');
      expect(res.body.notice).toBe('Plan only. Real deployment arrives in Phase 2.');
    });
  });
});
