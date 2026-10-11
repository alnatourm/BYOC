import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import process from 'node:process';
import crypto from 'node:crypto';

process.env.NODE_ENV = 'test';

import { app } from '../server';
import { runMigrations } from '../server/db/migrate';
import { db } from '../server/db';
import { hashPassword } from '../server/auth/scrypt';
import { createSession } from '../server/auth/sessions';

describe('Unverified User Blocks & decideDisableReason Tests', () => {
  let ownerUserId: string;
  let ownerCookie: string;
  let ownerCsrf: string;
  let tenantId: string;

  let unverifiedUserId: string;
  let unverifiedCookie: string;
  let unverifiedCsrf: string;

  let reviewerNoScopeCookie: string;
  let reviewerDesignScopeCookie: string;
  let requesterCookie: string;
  let viewerCookie: string;

  let projectId: string;
  let runId: string;
  let gate1Id: string;
  let gate3Id: string;
  let gate5Id: string;

  async function createTestUser(email: string, role: string, scope: string | null, verified: boolean) {
    const userId = `usr_${crypto.randomBytes(12).toString('hex')}`;
    const passwordHash = await hashPassword('Password123456!');

    await db.query(
      'INSERT INTO users (id, email, password_hash, email_verified_at) VALUES ($1, $2, $3, $4)',
      [userId, email, passwordHash, verified ? new Date() : null]
    );

    await db.query(
      'INSERT INTO memberships (tenant_id, user_id, role, reviewer_scope) VALUES ($1, $2, $3, $4)',
      [tenantId, userId, role, scope]
    );

    const { sessionToken, csrfToken } = await createSession(userId);
    const cookie = `byoc_sid=${sessionToken}`;
    return { userId, cookie, csrf: csrfToken, email };
  }

  beforeAll(async () => {
    await runMigrations();

    // Owner setup via signup
    const signupRes = await request(app).post('/v1/auth/signup').send({
      email: `owner_${Date.now()}@unverifiedtest.com`,
      password: 'Password123456!',
      companyName: 'Unverified Test Tenant',
    });

    ownerCookie = signupRes.headers['set-cookie'][0];
    ownerCsrf = signupRes.body.csrfToken;
    ownerUserId = signupRes.body.user.id;
    tenantId = signupRes.body.tenant.id;

    // Verify Owner
    await db.query('UPDATE users SET email_verified_at = NOW() WHERE id = $1', [ownerUserId]);

    // Create Unverified User
    const unvObj = await createTestUser(`unverified_${Date.now()}@test.com`, 'requester', null, false);
    unverifiedUserId = unvObj.userId;
    unverifiedCookie = unvObj.cookie;
    unverifiedCsrf = unvObj.csrf;

    // Create Reviewer with NULL scope
    const revNoScope = await createTestUser(`rev_noscope_${Date.now()}@test.com`, 'reviewer', null, true);
    reviewerNoScopeCookie = revNoScope.cookie;

    // Create Reviewer with 'design' scope (Gate 2)
    const revDesign = await createTestUser(`rev_design_${Date.now()}@test.com`, 'reviewer', 'design', true);
    reviewerDesignScopeCookie = revDesign.cookie;

    // Create Requester (verified)
    const reqObj = await createTestUser(`requester_${Date.now()}@test.com`, 'requester', null, true);
    requesterCookie = reqObj.cookie;

    // Create Viewer (verified)
    const viewObj = await createTestUser(`viewer_${Date.now()}@test.com`, 'viewer', null, true);
    viewerCookie = viewObj.cookie;

    // Create Project
    const projRes = await request(app)
      .post('/v1/projects')
      .set('Cookie', ownerCookie)
      .set('x-csrf-token', ownerCsrf)
      .send({ name: 'Test Pipeline Project', mode: 'managed' });
    projectId = projRes.body.project.id;

    // Create Run
    const runRes = await request(app)
      .post('/v1/runs')
      .set('Cookie', ownerCookie)
      .set('x-csrf-token', ownerCsrf)
      .send({ projectId, title: 'Test Run 1', intent: 'Build a secure dashboard app' });
    runId = runRes.body.run.id;

    gate1Id = `gate_${runId}_g1`;
    gate3Id = `gate_${runId}_g3`;
    gate5Id = `gate_${runId}_g5`;
  });

  it('resend-verification: unverified user succeeds, verified user gets 400', async () => {
    // Unverified user resends verification
    const resUnverified = await request(app)
      .post('/v1/auth/resend-verification')
      .set('Cookie', unverifiedCookie)
      .set('x-csrf-token', unverifiedCsrf);

    expect(resUnverified.status).toBe(200);
    expect(resUnverified.body.success).toBe(true);

    // Verified user gets 400
    const resVerified = await request(app)
      .post('/v1/auth/resend-verification')
      .set('Cookie', ownerCookie)
      .set('x-csrf-token', ownerCsrf);

    expect(resVerified.status).toBe(400);
    expect(resVerified.body.error).toContain('EMAIL_ALREADY_VERIFIED');
  });

  it('resend-verification: rate limited on the 6th request within an hour', async () => {
    // Reset rate limit buckets for IP
    const { resendVerificationRateLimiter } = await import('../server/middleware/rateLimit');

    // Create a new unverified user to test rate limit
    const unvRate = await createTestUser(`unv_rate_${Date.now()}@test.com`, 'requester', null, false);

    // Make 4 more requests (total 5 for this IP including previous test)
    for (let i = 0; i < 4; i++) {
      await request(app)
        .post('/v1/auth/resend-verification')
        .set('Cookie', unvRate.cookie)
        .set('x-csrf-token', unvRate.csrf);
    }

    // The 6th request must get 429
    const res6 = await request(app)
      .post('/v1/auth/resend-verification')
      .set('Cookie', unvRate.cookie)
      .set('x-csrf-token', unvRate.csrf);

    expect(res6.status).toBe(429);
    expect(res6.body.error).toContain('TOO_MANY_REQUESTS');
  });

  it('email verification token verifies exactly once', async () => {
    // Generate new token for unverified user directly in DB
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.query(
      'INSERT INTO email_tokens (id, user_id, kind, token_hash, expires_at) VALUES ($1, $2, $3, $4, $5)',
      [`tok_${Date.now()}`, unverifiedUserId, 'verification', tokenHash, expiresAt]
    );

    // First verification attempt succeeds
    const verifyRes1 = await request(app)
      .post('/v1/auth/verify-email')
      .send({ token: rawToken });

    expect(verifyRes1.status).toBe(200);
    expect(verifyRes1.body.success).toBe(true);

    // Second attempt fails
    const verifyRes2 = await request(app)
      .post('/v1/auth/verify-email')
      .send({ token: rawToken });

    expect(verifyRes2.status).toBe(400);
    expect(verifyRes2.body.error).toContain('INVALID_TOKEN');
  });

  it('unverified user is blocked from Start, refine, and adding a hosting connection', async () => {
    // Create new unverified user with owner role so it passes role authorization and checks email verification
    const freshUnv = await createTestUser(`fresh_unv_${Date.now()}@test.com`, 'owner', null, false);

    // 1. Blocked from Start
    const startRes = await request(app)
      .post(`/v1/runs/${runId}/stages/1/start`)
      .set('Cookie', freshUnv.cookie)
      .set('x-csrf-token', freshUnv.csrf)
      .set('Idempotency-Key', `idemp_${Date.now()}`)
      .send({});

    expect(startRes.status).toBe(409);
    expect(startRes.body.error).toContain('PREFLIGHT_BLOCKED');
    expect(JSON.stringify(startRes.body.checks)).toContain('EMAIL_UNVERIFIED');

    // 2. Blocked from refine
    const refineRes = await request(app)
      .post(`/v1/runs/${runId}/stages/1/refine`)
      .set('Cookie', freshUnv.cookie)
      .set('x-csrf-token', freshUnv.csrf)
      .set('Idempotency-Key', `idemp_refine_${Date.now()}`)
      .send({ modificationPrompt: 'Please add dark mode UI' });

    expect(refineRes.status).toBe(403);
    expect(refineRes.body.error).toContain('EMAIL_UNVERIFIED');

    // 3. Blocked from adding hosting connection
    const hostRes = await request(app)
      .post('/v1/hosting-connections')
      .set('Cookie', freshUnv.cookie)
      .set('x-csrf-token', freshUnv.csrf)
      .send({
        type: 'railway_token',
        label: 'Test Railway',
        secret: 'rw_token_12345',
      });

    expect(hostRes.status).toBe(403);
    expect(hostRes.body.error).toContain('EMAIL_UNVERIFIED');
  });

  it('decideDisableReason is returned for each blocked case and empty when user may decide', async () => {
    // Case 1: Viewer role -> Viewer role cannot decide gates
    const viewRes = await request(app)
      .get(`/v1/gates/${gate1Id}`)
      .set('Cookie', viewerCookie);

    expect(viewRes.status).toBe(200);
    expect(viewRes.body.userCanDecide).toBe(false);
    expect(viewRes.body.decideDisableReason).toContain('Viewer role cannot decide gates');

    // Case 2: Reviewer with NULL scope -> cannot decide any gate
    const revNullRes = await request(app)
      .get(`/v1/gates/${gate1Id}`)
      .set('Cookie', reviewerNoScopeCookie);

    expect(revNullRes.status).toBe(200);
    expect(revNullRes.body.userCanDecide).toBe(false);
    expect(revNullRes.body.decideDisableReason).toContain('no scope assigned (NULL)');

    // Case 3: Reviewer with scope 'design' at Gate 3 ('code') -> Scope mismatch
    const revDesignRes = await request(app)
      .get(`/v1/gates/${gate3Id}`)
      .set('Cookie', reviewerDesignScopeCookie);

    expect(revDesignRes.status).toBe(200);
    expect(revDesignRes.body.userCanDecide).toBe(false);
    expect(revDesignRes.body.decideDisableReason).toContain("Reviewer scope 'design' does not match Gate 3 scope 'code'");

    // Case 4: Requester when requesters_can_decide is false -> Requester not allowed
    const reqRes = await request(app)
      .get(`/v1/gates/${gate1Id}`)
      .set('Cookie', requesterCookie);

    expect(reqRes.status).toBe(200);
    expect(reqRes.body.userCanDecide).toBe(false);
    expect(reqRes.body.decideDisableReason).toContain('Requester role cannot decide gates');

    // Case 5: Separation of duties on Gate 5 where run creator is owner
    const ownerGate5Res = await request(app)
      .get(`/v1/gates/${gate5Id}`)
      .set('Cookie', ownerCookie);

    expect(ownerGate5Res.status).toBe(200);
    expect(ownerGate5Res.body.userCanDecide).toBe(false);
    expect(ownerGate5Res.body.decideDisableReason).toContain('Separation of duties: Run creator cannot approve Gate 5');

    // Case 6: Gate not pending -> Decide disabled
    // Mark Gate 1 approved directly
    await db.query("UPDATE gates SET status = 'approved' WHERE id = $1", [gate1Id]);

    const approvedGateRes = await request(app)
      .get(`/v1/gates/${gate1Id}`)
      .set('Cookie', ownerCookie);

    expect(approvedGateRes.status).toBe(200);
    expect(approvedGateRes.body.userCanDecide).toBe(false);
    expect(approvedGateRes.body.decideDisableReason).toBe('Gate is not pending decision.');

    // Case 7: Owner at pending Gate 3 -> Allowed (userCanDecide is true, decideDisableReason is null)
    await db.query("UPDATE gates SET status = 'pending' WHERE id = $1", [gate3Id]);

    const allowedOwnerRes = await request(app)
      .get(`/v1/gates/${gate3Id}`)
      .set('Cookie', ownerCookie);

    expect(allowedOwnerRes.status).toBe(200);
    expect(allowedOwnerRes.body.userCanDecide).toBe(true);
    expect(allowedOwnerRes.body.decideDisableReason).toBeNull();
  });
});
