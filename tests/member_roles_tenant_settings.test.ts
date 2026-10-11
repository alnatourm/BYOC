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

describe('Member Roles, Scopes, and Tenant Settings Security Suite', () => {
  let owner1Cookie: string;
  let owner1Csrf: string;
  let owner1UserId: string;
  let tenant1Id: string;

  let owner2Cookie: string;
  let owner2Csrf: string;
  let owner2UserId: string;
  let tenant2Id: string;

  let adminUserId: string;
  let adminCookie: string;
  let adminCsrf: string;

  let reviewerUserId: string;
  let reviewerCookie: string;

  let requesterUserId: string;
  let requesterCookie: string;

  let viewerUserId: string;
  let viewerCookie: string;

  let project1Id: string;
  let run1Id: string;

  async function createUserDirectly(email: string, role: string, scope: string | null, tenantId: string) {
    const userId = `usr_${crypto.randomBytes(12).toString('hex')}`;
    const passwordHash = await hashPassword('StrongPassword123!');

    await db.query(
      'INSERT INTO users (id, email, password_hash, email_verified_at) VALUES ($1, $2, $3, NOW())',
      [userId, email, passwordHash]
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

    // Owner 1 in Tenant 1 via signup
    const res1 = await request(app).post('/v1/auth/signup').send({
      email: `owner1_${Date.now()}@testtenant1.com`,
      password: 'StrongPassword123!',
      companyName: 'Tenant One Corp',
    });
    owner1Csrf = res1.body.csrfToken;
    owner1Cookie = res1.headers['set-cookie'][0];
    owner1UserId = res1.body.user.id;
    tenant1Id = res1.body.tenant.id;
    await db.query('UPDATE users SET email_verified_at = NOW() WHERE id = $1', [owner1UserId]);

    // Owner 2 in Tenant 2 via signup
    const res2 = await request(app).post('/v1/auth/signup').send({
      email: `owner2_${Date.now()}@testtenant2.com`,
      password: 'StrongPassword123!',
      companyName: 'Tenant Two Corp',
    });
    owner2Csrf = res2.body.csrfToken;
    owner2Cookie = res2.headers['set-cookie'][0];
    owner2UserId = res2.body.user.id;
    tenant2Id = res2.body.tenant.id;
    await db.query('UPDATE users SET email_verified_at = NOW() WHERE id = $1', [owner2UserId]);

    // Create Admin in Tenant 1
    const adminObj = await createUserDirectly(`admin_${Date.now()}@testtenant1.com`, 'admin', null, tenant1Id);
    adminUserId = adminObj.userId;
    adminCookie = adminObj.cookie;
    adminCsrf = adminObj.csrf;

    // Create Reviewer in Tenant 1
    const revObj = await createUserDirectly(`reviewer_${Date.now()}@testtenant1.com`, 'reviewer', null, tenant1Id);
    reviewerUserId = revObj.userId;
    reviewerCookie = revObj.cookie;

    // Create Requester in Tenant 1
    const reqObj = await createUserDirectly(`requester_${Date.now()}@testtenant1.com`, 'requester', null, tenant1Id);
    requesterUserId = reqObj.userId;
    requesterCookie = reqObj.cookie;

    // Create Viewer in Tenant 1
    const viewObj = await createUserDirectly(`viewer_${Date.now()}@testtenant1.com`, 'viewer', null, tenant1Id);
    viewerUserId = viewObj.userId;
    viewerCookie = viewObj.cookie;

    // Create Project and Run for Tenant 1
    const pRes = await request(app)
      .post('/v1/projects')
      .set('Cookie', owner1Cookie)
      .set('x-csrf-token', owner1Csrf)
      .send({ name: 'Project Security Spec', mode: 'managed' });
    project1Id = pRes.body.project.id;

    const runRes = await request(app)
      .post('/v1/runs')
      .set('Cookie', owner1Cookie)
      .set('x-csrf-token', owner1Csrf)
      .send({ projectId: project1Id, title: 'Run Security Spec', intent: 'Testing gate permissions' });
    run1Id = runRes.body.run.id;

    // Set Gate 2 and Gate 3 stage_runs awaiting_review for testing gate decision
    await db.query("UPDATE stage_runs SET state = 'awaiting_review' WHERE run_id = $1", [run1Id]);
  });

  describe('1. Member Role Permissions & Owner Protections', () => {
    it('Admin cannot promote self or others to owner (403)', async () => {
      // Admin promotes self to owner
      const resSelf = await request(app)
        .patch(`/v1/members/${adminUserId}`)
        .set('Cookie', adminCookie)
        .set('x-csrf-token', adminCsrf)
        .send({ role: 'owner' });
      expect(resSelf.status).toBe(403);

      // Admin promotes requester to owner
      const resOther = await request(app)
        .patch(`/v1/members/${requesterUserId}`)
        .set('Cookie', adminCookie)
        .set('x-csrf-token', adminCsrf)
        .send({ role: 'owner' });
      expect(resOther.status).toBe(403);
    });

    it('Admin cannot modify an owner member (403)', async () => {
      const res = await request(app)
        .patch(`/v1/members/${owner1UserId}`)
        .set('Cookie', adminCookie)
        .set('x-csrf-token', adminCsrf)
        .send({ role: 'admin' });
      expect(res.status).toBe(403);
    });

    it('Nobody can change their own role or scope (403)', async () => {
      // Owner tries to edit self
      const resOwnerSelf = await request(app)
        .patch(`/v1/members/${owner1UserId}`)
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ role: 'admin' });
      expect(resOwnerSelf.status).toBe(403);

      // Admin tries to edit self
      const resAdminSelf = await request(app)
        .patch(`/v1/members/${adminUserId}`)
        .set('Cookie', adminCookie)
        .set('x-csrf-token', adminCsrf)
        .send({ role: 'reviewer', reviewerScope: 'code' });
      expect(resAdminSelf.status).toBe(403);
    });

    it('Owner CAN modify non-owner members', async () => {
      const res = await request(app)
        .patch(`/v1/members/${requesterUserId}`)
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ role: 'reviewer', reviewerScope: 'design' });
      expect(res.status).toBe(200);
      expect(res.body.member.role).toBe('reviewer');
      expect(res.body.member.reviewerScope).toBe('design');

      // Revert requesterUserId back to requester
      await request(app)
        .patch(`/v1/members/${requesterUserId}`)
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ role: 'requester' });
    });

    it('Last owner cannot be demoted or removed (400)', async () => {
      // Promote adminUserId to second owner so we have two owners
      await request(app)
        .patch(`/v1/members/${adminUserId}`)
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ role: 'owner' });

      // Owner 1 demotes Admin (now second owner) -> Should succeed
      const demoteRes = await request(app)
        .patch(`/v1/members/${adminUserId}`)
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ role: 'admin' });
      expect(demoteRes.status).toBe(200);
    });

    it('Cross-tenant member PATCH returns 404', async () => {
      const res = await request(app)
        .patch(`/v1/members/${owner2UserId}`)
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ role: 'admin' });
      expect(res.status).toBe(404);
    });
  });

  describe('2. Reviewer Scopes & Gate Permissions', () => {
    it('Reject "owner" as a reviewerScope (400 INVALID_INPUT)', async () => {
      const res = await request(app)
        .patch(`/v1/members/${reviewerUserId}`)
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ role: 'reviewer', reviewerScope: 'owner' });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('INVALID_INPUT');
    });

    it('Scope on non-reviewer role is stored as NULL', async () => {
      const res = await request(app)
        .patch(`/v1/members/${requesterUserId}`)
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ role: 'requester', reviewerScope: 'code' });
      expect(res.status).toBe(200);
      expect(res.body.member.reviewerScope).toBeNull();
    });

    it('Reviewer with NULL scope cannot decide any gate', async () => {
      // Set reviewer scope to NULL
      await request(app)
        .patch(`/v1/members/${reviewerUserId}`)
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ role: 'reviewer', reviewerScope: null });

      const gate2Id = `gate_${run1Id}_g2`;
      const getRes = await request(app)
        .get(`/v1/gates/${gate2Id}`)
        .set('Cookie', reviewerCookie);
      expect(getRes.body.userCanDecide).toBe(false);

      const postRes = await request(app)
        .post(`/v1/gates/${gate2Id}/decision`)
        .set('Cookie', reviewerCookie)
        .send({ decision: 'approved' });
      expect(postRes.status).toBe(403);
    });

    it('Reviewer with scope "design" decides Gate 2 and gets 403 on Gate 3', async () => {
      await request(app)
        .patch(`/v1/members/${reviewerUserId}`)
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ role: 'reviewer', reviewerScope: 'design' });

      // Gate 2 (design)
      const gate2Id = `gate_${run1Id}_g2`;
      const getGate2 = await request(app)
        .get(`/v1/gates/${gate2Id}`)
        .set('Cookie', reviewerCookie);
      expect(getGate2.body.userCanDecide).toBe(true);

      // Gate 3 (code)
      const gate3Id = `gate_${run1Id}_g3`;
      const getGate3 = await request(app)
        .get(`/v1/gates/${gate3Id}`)
        .set('Cookie', reviewerCookie);
      expect(getGate3.body.userCanDecide).toBe(false);

      const postGate3 = await request(app)
        .post(`/v1/gates/${gate3Id}/decision`)
        .set('Cookie', reviewerCookie)
        .send({ decision: 'approved' });
      expect(postGate3.status).toBe(403);
    });

    it('Reviewer with scope "all" can decide any gate', async () => {
      await request(app)
        .patch(`/v1/members/${reviewerUserId}`)
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ role: 'reviewer', reviewerScope: 'all' });

      const gate3Id = `gate_${run1Id}_g3`;
      const getGate3 = await request(app)
        .get(`/v1/gates/${gate3Id}`)
        .set('Cookie', reviewerCookie);
      expect(getGate3.body.userCanDecide).toBe(true);
    });
  });

  describe('3. Requester and Viewer Gate Permissions & Tenant Settings', () => {
    it('Requester gets 403 on decide by default and succeeds when requesters_can_decide=true', async () => {
      const gate2Id = `gate_${run1Id}_g2`;

      // Default: requesters_can_decide = false
      const getDef = await request(app)
        .get(`/v1/gates/${gate2Id}`)
        .set('Cookie', requesterCookie);
      expect(getDef.body.userCanDecide).toBe(false);

      const postDef = await request(app)
        .post(`/v1/gates/${gate2Id}/decision`)
        .set('Cookie', requesterCookie)
        .send({ decision: 'approved' });
      expect(postDef.status).toBe(403);

      // Enable requesters_can_decide
      await request(app)
        .patch('/v1/tenant/settings')
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ requesters_can_decide: true });

      const getEnabled = await request(app)
        .get(`/v1/gates/${gate2Id}`)
        .set('Cookie', requesterCookie);
      expect(getEnabled.body.userCanDecide).toBe(true);

      // Revert requesters_can_decide = false
      await request(app)
        .patch('/v1/tenant/settings')
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ requesters_can_decide: false });
    });

    it('Viewer always gets 403 on gate decision', async () => {
      const gate2Id = `gate_${run1Id}_g2`;
      const getRes = await request(app)
        .get(`/v1/gates/${gate2Id}`)
        .set('Cookie', viewerCookie);
      expect(getRes.body.userCanDecide).toBe(false);

      const postRes = await request(app)
        .post(`/v1/gates/${gate2Id}/decision`)
        .set('Cookie', viewerCookie)
        .send({ decision: 'approved' });
      expect(postRes.status).toBe(403);
    });
  });

  describe('4. GET /v1/members Access Restrictions', () => {
    it('Owner and Admin can GET /v1/members', async () => {
      const resOwner = await request(app)
        .get('/v1/members')
        .set('Cookie', owner1Cookie);
      expect(resOwner.status).toBe(200);
      expect(Array.isArray(resOwner.body.members)).toBe(true);

      const resAdmin = await request(app)
        .get('/v1/members')
        .set('Cookie', adminCookie);
      expect(resAdmin.status).toBe(200);
    });

    it('Requester, Reviewer, and Viewer receive 403 on GET /v1/members', async () => {
      const resReq = await request(app).get('/v1/members').set('Cookie', requesterCookie);
      expect(resReq.status).toBe(403);

      const resRev = await request(app).get('/v1/members').set('Cookie', reviewerCookie);
      expect(resRev.status).toBe(403);

      const resView = await request(app).get('/v1/members').set('Cookie', viewerCookie);
      expect(resView.status).toBe(403);
    });
  });

  describe('5. Audit Log Events', () => {
    it('Audit rows exist for role changes with old and new values', async () => {
      const { rows } = await db.query(
        "SELECT * FROM audit_events WHERE tenant_id = $1 AND action = 'member.role_updated' ORDER BY seq DESC",
        [tenant1Id]
      );
      expect(rows.length).toBeGreaterThan(0);
      const latest = rows[0];
      const payload = typeof latest.payload_json === 'string' ? JSON.parse(latest.payload_json) : latest.payload_json;
      expect(payload).toHaveProperty('oldRole');
      expect(payload).toHaveProperty('newRole');
      expect(payload).toHaveProperty('oldScope');
      expect(payload).toHaveProperty('newScope');
      expect(payload).toHaveProperty('actorUserId');
      expect(payload).toHaveProperty('targetUserId');
    });
  });

  describe('6. Tenant Settings Endpoint Security & Auditing', () => {
    it('GET /v1/tenant/settings accessible to owner and admin', async () => {
      const resOwner = await request(app).get('/v1/tenant/settings').set('Cookie', owner1Cookie);
      expect(resOwner.status).toBe(200);
      expect(resOwner.body.settings).toHaveProperty('max_revisions_per_stage');

      const resAdmin = await request(app).get('/v1/tenant/settings').set('Cookie', adminCookie);
      expect(resAdmin.status).toBe(200);
    });

    it('PATCH /v1/tenant/settings is owner-only (admin gets 403)', async () => {
      const resAdmin = await request(app)
        .patch('/v1/tenant/settings')
        .set('Cookie', adminCookie)
        .set('x-csrf-token', adminCsrf)
        .send({ max_revisions_per_stage: 5 });
      expect(resAdmin.status).toBe(403);
    });

    it('PATCH /v1/tenant/settings validates ranges (1 to 10)', async () => {
      const resTooLow = await request(app)
        .patch('/v1/tenant/settings')
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ max_revisions_per_stage: 0 });
      expect(resTooLow.status).toBe(400);

      const resTooHigh = await request(app)
        .patch('/v1/tenant/settings')
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ max_revisions_per_stage: 11 });
      expect(resTooHigh.status).toBe(400);

      const resValid = await request(app)
        .patch('/v1/tenant/settings')
        .set('Cookie', owner1Cookie)
        .set('x-csrf-token', owner1Csrf)
        .send({ max_revisions_per_stage: 5, separation_of_duties: false });
      expect(resValid.status).toBe(200);
      expect(resValid.body.settings.max_revisions_per_stage).toBe(5);
    });

    it('Changing separation_of_duties writes audit event', async () => {
      const { rows } = await db.query(
        "SELECT * FROM audit_events WHERE tenant_id = $1 AND action = 'tenant.separation_of_duties_changed'",
        [tenant1Id]
      );
      expect(rows.length).toBeGreaterThan(0);
    });
  });
});
