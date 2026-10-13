import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server.ts';

describe('Admin Database Diagnostics Suite (Task 3)', () => {
  it('Rejects unauthenticated access to /v1/admin/db-diagnostics', async () => {
    const res = await request(app).get('/v1/admin/db-diagnostics');
    expect(res.status).toBe(401);
  });
});
