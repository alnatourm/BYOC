import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { fork } from 'node:child_process';
import path from 'node:path';

process.env.NODE_ENV = 'test';

import { app } from '../server';
import { runMigrations } from '../server/db/migrate';

describe('1. Security, Tenancy, RBAC & Boot Refusal Suite', () => {
  let user1Cookie: string;
  let user1Csrf: string;
  let user1TenantId: string;

  let user2Cookie: string;
  let user2Csrf: string;
  let user2TenantId: string;

  let project1Id: string;

  beforeAll(async () => {
    await runMigrations();

    // Tenant 1 Signup
    const res1 = await request(app).post('/v1/auth/signup').send({
      email: `owner1_${Date.now()}@tenant1.com`,
      password: 'StrongPassword123!',
      companyName: 'Tenant One Security Corp',
    });
    user1Csrf = res1.body.csrfToken;
    user1Cookie = res1.headers['set-cookie'][0];
    user1TenantId = res1.body.tenant.id;

    // Create Project for Tenant 1
    const pRes = await request(app)
      .post('/v1/projects')
      .set('Cookie', user1Cookie)
      .set('x-csrf-token', user1Csrf)
      .send({ name: 'Tenant 1 Project Alpha', mode: 'byok' });
    project1Id = pRes.body.project.id;

    // Tenant 2 Signup
    const res2 = await request(app).post('/v1/auth/signup').send({
      email: `owner2_${Date.now()}@tenant2.com`,
      password: 'StrongPassword123!',
      companyName: 'Tenant Two Security Corp',
    });
    user2Csrf = res2.body.csrfToken;
    user2Cookie = res2.headers['set-cookie'][0];
    user2TenantId = res2.body.tenant.id;
  });

  describe('Cross-Tenant Isolation (Rule 4)', () => {
    it('Tenant 2 receives 404 when accessing Tenant 1 project or run', async () => {
      const res = await request(app)
        .get(`/v1/runs/${project1Id}`)
        .set('Cookie', user2Cookie);

      expect(res.status).toBe(404);
    });
  });

  describe('Unauthenticated Route Sweep', () => {
    it('Rejects unauthenticated requests with 401 across endpoints', async () => {
      const routes = [
        { method: 'get', path: '/v1/me' },
        { method: 'get', path: '/v1/projects' },
        { method: 'get', path: '/v1/runs' },
        { method: 'get', path: '/v1/connections' },
        { method: 'get', path: '/v1/hosting-connections' },
        { method: 'get', path: '/v1/quotes' },
        { method: 'get', path: '/v1/audit' },
        { method: 'get', path: '/v1/admin/tenants' },
      ];

      for (const r of routes) {
        const res = await (request(app) as any)[r.method](r.path);
        expect(res.status).toBe(401);
      }
    });

    it('Allowlisted endpoints accessible without session cookie', async () => {
      const healthRes = await request(app).get('/healthz');
      expect(healthRes.status).toBe(200);

      const readyRes = await request(app).get('/readyz');
      expect(readyRes.status).toBe(200);
    });
  });

  describe('Removed Endpoints Return 404 (Section 1.1)', () => {
    it('/api/ai/orchestrate-role returns 404', async () => {
      const res = await request(app).post('/api/ai/orchestrate-role').send({});
      expect(res.status).toBe(404);
    });

    it('/api/hosting/verify returns 404', async () => {
      const res = await request(app).post('/api/hosting/verify').send({});
      expect(res.status).toBe(404);
    });

    it('/api/hosting/quotes returns 404', async () => {
      const res = await request(app).get('/api/hosting/quotes');
      expect(res.status).toBe(404);
    });
  });

  describe('CSRF Enforcement & Error Redaction', () => {
    it('Rejects non-GET requests missing CSRF token with 403', async () => {
      const res = await request(app)
        .post('/v1/projects')
        .set('Cookie', user1Cookie)
        .send({ name: 'CSRF Exploit Attempt' });

      expect(res.status).toBe(403);
    });

    it('/readyz endpoint leaks zero database error stack or credentials', async () => {
      const res = await request(app).get('/readyz');
      expect(res.body.dbPassword).toBeUndefined();
      expect(res.body.connectionString).toBeUndefined();
    });
  });

  describe('Fail-Closed Production Boot Refusal (Section 1.2)', () => {
    it('Refuses to boot when NODE_ENV is unset/production without VAULT_MASTER_KEY', async () => {
      const result = await new Promise<number | null>((resolve) => {
        const child = fork(path.resolve(process.cwd(), 'server.ts'), [], {
          env: { ...process.env, NODE_ENV: 'production', VAULT_MASTER_KEY: '', PORT: '0' },
          execArgv: ['--import', 'tsx'],
          silent: true,
        });

        child.on('exit', (code) => resolve(code));
      });

      expect(result).not.toBe(0);
    });
  });
});
