import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { requireAuth, requireTenantRole, AuthRequest } from '../middleware/auth';
import { TenantRepository } from '../db/repository';
import { encryptTenantSecret, decryptTenantSecret, computeFingerprint } from '../vault/crypto';
import { verifyHostingToken, generateSshKeyPair, HOSTING_CAPABILITIES_MATRIX } from '../hosting/capabilities';
import { logAuditEvent } from '../audit/chain';
import { db } from '../db';

export const hostingRouter = Router();

const createHostingSchema = z.object({
  type: z.enum(['hetzner_token', 'digitalocean_token', 'railway_token', 'ssh_server']),
  label: z.string().min(2),
  secret: z.string().min(1, 'Token or SSH host is required'),
});

const planDeploymentSchema = z.object({
  runId: z.string().min(1),
  hostingConnectionId: z.string().min(1),
  topology: z.string().optional(),
});

// GET /v1/quotes (Authenticated Tenant Users)
hostingRouter.get(
  '/quotes',
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      const { rows } = await db.query('SELECT * FROM price_quotes ORDER BY quoted_at DESC');
      const now = new Date();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

      const quotesWithStale = rows.map((q) => {
        const ageMs = now.getTime() - new Date(q.quoted_at).getTime();
        return {
          id: q.id,
          provider: q.provider,
          planLabel: q.plan_label,
          amountUsd: parseFloat(q.amount_usd),
          currency: q.currency,
          sourceUrl: q.source_url,
          quotedAt: q.quoted_at,
          stale: ageMs > thirtyDaysMs,
        };
      });

      res.json({ quotes: quotesWithStale });
    } catch {
      res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
    }
  }
);

// GET /v1/hosting-connections
hostingRouter.get(
  '/hosting-connections',
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
    } catch {
      res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
    }
  }
);

// POST /v1/hosting-connections
hostingRouter.post(
  '/hosting-connections',
  requireAuth,
  requireTenantRole('owner', 'admin'),
  async (req: AuthRequest, res) => {
    try {
      const { type, label, secret } = createHostingSchema.parse(req.body);

      // Check User Email Verification
      const { rows: userRows } = await db.query('SELECT email_verified_at FROM users WHERE id = $1', [req.user!.id]);
      if (!userRows[0]?.email_verified_at) {
        return res.status(403).json({ error: 'EMAIL_UNVERIFIED: Email verification required to configure hosting connections.' });
      }

      const connectionId = `host_conn_${crypto.randomBytes(12).toString('hex')}`;
      const fingerprint = computeFingerprint(secret);
      const last4 = secret.slice(-4) || '****';

      // Perform Live Real Verification Call
      const verification = await verifyHostingToken(type, secret);

      const encrypted = await encryptTenantSecret(req.membership!.tenantId, connectionId, secret, 1);

      await db.query(
        `INSERT INTO hosting_connections (id, tenant_id, type, label, ciphertext, iv, tag, key_version, fingerprint, last4, status, last_verified_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          connectionId,
          req.membership!.tenantId,
          type,
          label,
          encrypted.ciphertext,
          encrypted.iv,
          encrypted.tag,
          1,
          fingerprint,
          last4,
          verification.verified ? 'verified' : 'unverified',
          verification.verified ? new Date() : null,
        ]
      );

      await logAuditEvent(
        req.membership!.tenantId,
        req.user!.id,
        'hosting.connection_created',
        `hosting:${connectionId}`,
        { type, label, verified: verification.verified }
      );

      res.status(201).json({
        connection: {
          id: connectionId,
          type,
          label,
          fingerprint,
          last4,
          status: verification.verified ? 'verified' : 'unverified',
          lastVerifiedAt: verification.verified ? new Date().toISOString() : null,
          capabilities: HOSTING_CAPABILITIES_MATRIX[type] || null,
        },
        sshInfo: type === 'ssh_server' ? generateSshKeyPair() : undefined,
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
      }
      res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
    }
  }
);

// POST /v1/hosting-connections/:id/verify
hostingRouter.post(
  '/hosting-connections/:id/verify',
  requireAuth,
  requireTenantRole('owner', 'admin'),
  async (req: AuthRequest, res) => {
    try {
      const repo = new TenantRepository(req.membership!.tenantId);
      const conn = await repo.findOne('hosting_connections', { id: req.params.id });

      if (!conn) {
        return res.status(404).json({ error: 'NOT_FOUND: Hosting connection not found.' });
      }

      const decryptedSecret = await decryptTenantSecret(
        req.membership!.tenantId,
        conn.id,
        conn.ciphertext,
        conn.iv,
        conn.tag,
        conn.key_version
      );

      const verification = await verifyHostingToken(conn.type, decryptedSecret);

      const newStatus = verification.verified ? 'verified' : 'unverified';
      await db.query(
        'UPDATE hosting_connections SET status = $1, last_verified_at = $2 WHERE id = $3',
        [newStatus, verification.verified ? new Date() : null, conn.id]
      );

      await logAuditEvent(
        req.membership!.tenantId,
        req.user!.id,
        'hosting.connection_verified',
        `hosting:${conn.id}`,
        { verified: verification.verified, error: verification.error }
      );

      res.json({
        id: conn.id,
        status: newStatus,
        lastVerifiedAt: verification.verified ? new Date().toISOString() : null,
        error: verification.error,
      });
    } catch {
      res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
    }
  }
);

// POST /v1/deployments/plan
hostingRouter.post(
  '/deployments/plan',
  requireAuth,
  requireTenantRole('owner', 'admin', 'requester'),
  async (req: AuthRequest, res) => {
    try {
      const { runId, hostingConnectionId, topology } = planDeploymentSchema.parse(req.body);

      const { rows: runRows } = await db.query(
        'SELECT id FROM runs WHERE id = $1 AND tenant_id = $2',
        [runId, req.membership!.tenantId]
      );
      if (runRows.length === 0) {
        return res.status(404).json({ error: 'NOT_FOUND: Run not found or cross-tenant access denied.' });
      }

      const { rows: hostRows } = await db.query(
        'SELECT * FROM hosting_connections WHERE id = $1 AND tenant_id = $2 AND status = $3',
        [hostingConnectionId, req.membership!.tenantId, 'verified']
      );
      if (hostRows.length === 0) {
        return res.status(400).json({ error: 'HOSTING_UNVERIFIED: Selected hosting connection is not verified.' });
      }

      const deploymentId = `dep_${crypto.randomBytes(12).toString('hex')}`;
      const planJson = JSON.stringify({
        runId,
        hostingConnectionId,
        topology: topology || 'API Service + Database + Frontend',
        plannedAt: new Date().toISOString(),
      });

      await db.query(
        `INSERT INTO deployments (id, run_id, hosting_connection_id, plan_json, status, approved_by)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [deploymentId, runId, hostingConnectionId, planJson, 'planned', req.user!.id]
      );

      await logAuditEvent(
        req.membership!.tenantId,
        req.user!.id,
        'hosting.deployment_plan_created',
        `deployment:${deploymentId}`,
        { runId, hostingConnectionId }
      );

      res.status(201).json({
        id: deploymentId,
        runId,
        status: 'planned',
        notice: 'Plan only. Real deployment arrives in Phase 2.',
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
      }
      res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
    }
  }
);
