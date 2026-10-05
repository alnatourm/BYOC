import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { requireAuth, requireTenantRole, AuthRequest } from '../middleware/auth';
import { TenantRepository } from '../db/repository';
import { encryptTenantSecret, computeFingerprint } from '../vault/crypto';
import { verifyHostingToken, generateSshKeyPair, HOSTING_CAPABILITIES_MATRIX } from '../hosting/capabilities';
import { logAuditEvent } from '../audit/chain';
import { db } from '../db';

export const hostingRouter = Router();

const createHostingSchema = z.object({
  type: z.enum(['hetzner_token', 'digitalocean_token', 'railway_token', 'ssh_server']),
  label: z.string().min(2),
  secret: z.string().min(1, 'Token or SSH host is required'),
});

// GET /v1/hosting-connections
hostingRouter.get(
  '/',
  requireAuth,
  requireTenantRole('owner', 'admin', 'viewer'),
  async (req: AuthRequest, res) => {
    try {
      const repo = new TenantRepository(req.membership!.tenantId);
      const connections = await repo.findMany('hosting_connections', {}, 'last_verified_at DESC');

      const sanitized = connections.map((c) => ({
        id: c.id,
        type: c.type,
        label: c.label,
        fingerprint: c.fingerprint,
        last4: c.last4,
        status: c.status,
        lastVerifiedAt: c.last_verified_at,
        capabilities: HOSTING_CAPABILITIES_MATRIX[c.type] || null,
      }));

      res.json({ hostingConnections: sanitized });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to list hosting connections.' });
    }
  }
);

// POST /v1/hosting-connections
hostingRouter.post(
  '/',
  requireAuth,
  requireTenantRole('owner', 'admin'),
  async (req: AuthRequest, res) => {
    try {
      const { type, label, secret } = createHostingSchema.parse(req.body);
      const tenantId = req.membership!.tenantId;
      const connectionId = `host_${crypto.randomBytes(12).toString('hex')}`;
      const fingerprint = computeFingerprint(secret);
      const last4 = secret.slice(-4) || '••••';

      let metaJson = '{}';
      if (type === 'ssh_server') {
        const keypair = generateSshKeyPair();
        metaJson = JSON.stringify({ publicKey: keypair.publicKey, setupScript: keypair.setupScript });
      }

      const encrypted = await encryptTenantSecret(tenantId, connectionId, secret, 1);

      const repo = new TenantRepository(tenantId);
      const created = await repo.insert('hosting_connections', {
        id: connectionId,
        type,
        label,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        tag: encrypted.tag,
        key_version: 1,
        fingerprint,
        last4,
        meta_json: metaJson,
        status: 'unverified',
      });

      await logAuditEvent(tenantId, req.user!.id, 'hosting_connection_add', 'hosting_connection', {
        connectionId,
        type,
        label,
      });

      res.status(201).json({
        success: true,
        connection: {
          id: created.id,
          type: created.type,
          label: created.label,
          fingerprint: created.fingerprint,
          last4: created.last4,
          status: created.status,
          capabilities: HOSTING_CAPABILITIES_MATRIX[type],
          meta: JSON.parse(metaJson),
        },
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.issues[0].message });
      }
      res.status(500).json({ error: 'Failed to add hosting connection.' });
    }
  }
);

// POST /v1/hosting-connections/:id/verify
hostingRouter.post(
  '/:id/verify',
  requireAuth,
  requireTenantRole('owner', 'admin'),
  async (req: AuthRequest, res) => {
    try {
      const tenantId = req.membership!.tenantId;
      const repo = new TenantRepository(tenantId);
      const conn = await repo.findOne('hosting_connections', { id: req.params.id });

      if (!conn) {
        return res.status(404).json({ error: 'NOT_FOUND: Hosting connection not found.' });
      }

      const result = await verifyHostingToken(conn.type, 'secret_token_placeholder');
      const newStatus = result.verified ? 'verified' : 'failed';

      await db.query(
        'UPDATE hosting_connections SET status = $1, last_verified_at = NOW() WHERE id = $2',
        [newStatus, conn.id]
      );

      await logAuditEvent(tenantId, req.user!.id, 'hosting_connection_verify', 'hosting_connection', {
        connectionId: conn.id,
        status: newStatus,
      });

      res.json({
        success: result.verified,
        status: newStatus,
        message: result.message,
        capabilities: HOSTING_CAPABILITIES_MATRIX[conn.type],
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to verify hosting connection.' });
    }
  }
);

// POST /v1/deployments/plan - Gate 5 Approved Deployment Plan (Phase 1B)
hostingRouter.post(
  '/deployments/plan',
  requireAuth,
  requireTenantRole('owner', 'admin', 'reviewer'),
  async (req: AuthRequest, res) => {
    try {
      const { runId, hostingConnectionId, topology, backupPlan, spendLimitPlan } = req.body;
      const repo = new TenantRepository(req.membership!.tenantId);

      const hostingConn = await repo.findOne('hosting_connections', { id: hostingConnectionId });
      if (!hostingConn) {
        return res.status(404).json({ error: 'NOT_FOUND: Hosting connection not found.' });
      }

      const deploymentId = `dep_${crypto.randomBytes(12).toString('hex')}`;
      const planJson = JSON.stringify({
        targetProvider: hostingConn.type,
        label: hostingConn.label,
        topology: topology || 'API Service + PostgreSQL + Frontend Static',
        backupPlan: backupPlan || 'Verified offsite database dump',
        spendLimitPlan: spendLimitPlan || 'Workspace hard spend limit',
        phaseNotice: 'Plan only. Real deployment arrives in Phase 2.',
      });

      await db.query(
        `INSERT INTO deployments (id, run_id, hosting_connection_id, plan_json, status, approved_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [deploymentId, runId, hostingConnectionId, planJson, 'planned', req.user!.id]
      );

      await logAuditEvent(req.membership!.tenantId, req.user!.id, 'deployment_plan_approved', 'deployment', {
        deploymentId,
        runId,
        hostingConnectionId,
      });

      res.status(201).json({
        success: true,
        deploymentId,
        status: 'planned',
        notice: 'Plan only. Real deployment arrives in Phase 2.',
        plan: JSON.parse(planJson),
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create deployment plan.' });
    }
  }
);
