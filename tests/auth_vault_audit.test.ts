import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

process.env.NODE_ENV = 'test';

import { app } from '../server';
import { runMigrations } from '../server/db/migrate';
import { isPrivateOrReservedIp } from '../server/vault/verify';

describe('Phase 1A Foundations Security & Functionality Suite', () => {
  beforeAll(async () => {
    await runMigrations();
  });

  describe('Health Checks', () => {
    it('GET /healthz returns 200 OK', async () => {
      const res = await request(app).get('/healthz');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('GET /readyz returns 200 OK with database connection', async () => {
      const res = await request(app).get('/readyz');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ready');
    });
  });

  describe('Auth & Session Security', () => {
    const testUser = {
      email: `test_${Date.now()}@example.com`,
      password: 'StrongPassword123!',
      companyName: 'Test Corporation',
    };

    let sessionCookie: string;
    let csrfToken: string;

    it('POST /v1/auth/signup creates tenant owner and sets session cookie', async () => {
      const res = await request(app).post('/v1/auth/signup').send(testUser);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.csrfToken).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email.toLowerCase());

      csrfToken = res.body.csrfToken;
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      sessionCookie = cookies[0];
    });

    it('GET /v1/me returns authenticated user & tenant profile', async () => {
      const res = await request(app)
        .get('/v1/me')
        .set('Cookie', sessionCookie);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.tenant.name).toBe(testUser.companyName);
    });

    it('Rejects non-GET requests without CSRF token', async () => {
      const res = await request(app)
        .post('/v1/connections')
        .set('Cookie', sessionCookie)
        .send({ type: 'gemini', label: 'Test Key', secret: 'sk-1234567890123' });

      expect(res.status).toBe(403);
      expect(res.body.error).toContain('CSRF_REJECTED');
    });

    it('POST /v1/auth/forgot returns uniform 202 status for unknown emails', async () => {
      const res = await request(app)
        .post('/v1/auth/forgot')
        .send({ email: 'nonexistent_user_xyz@example.com' });

      expect(res.status).toBe(202);
      expect(res.body.message).toContain('dispatched');
    });
  });

  describe('SSRF Guard Unit Tests', () => {
    it('Blocks private, loopback, and metadata IP addresses', () => {
      expect(isPrivateOrReservedIp('127.0.0.1')).toBe(true);
      expect(isPrivateOrReservedIp('::1')).toBe(true);
      expect(isPrivateOrReservedIp('10.0.0.1')).toBe(true);
      expect(isPrivateOrReservedIp('192.168.1.1')).toBe(true);
      expect(isPrivateOrReservedIp('169.254.169.254')).toBe(true);
      expect(isPrivateOrReservedIp('100.64.0.1')).toBe(true);
    });

    it('Allows public IP addresses', () => {
      expect(isPrivateOrReservedIp('8.8.8.8')).toBe(false);
      expect(isPrivateOrReservedIp('1.1.1.1')).toBe(false);
    });
  });
});
