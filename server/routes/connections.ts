import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { requireAuth, requireTenantRole, AuthRequest } from '../middleware/auth';
import { TenantRepository } from '../db/repository';
import { encryptTenantSecret, decryptTenantSecret, computeFingerprint } from '../vault/crypto';
import { verifyProviderApiKey } from '../vault/verify';
import { logAuditEvent } from '../audit/chain';

export const connectionsRouter = Router();

const createConnectionSchema = z.object({
  type: z.enum(['gemini', 'anthropic', 'openai', 'webhook']),
  label: z.string().min(2),
  secret: z.string().min(1, 'Secret key or webhook URL is required'),
  spendCapUsd: z.number().optional(),
});

// GET /v1/connections - List Connections (Write-Only Representation)
connectionsRouter.get(
  '/',
  requireAuth,
  requireTenantRole('owner', 'admin', 'requester', 'reviewer', 'viewer'),
  async (req: AuthRequest, res) => {
    try {
      const repo = new TenantRepository(req.membership!.tenantId);
      const connections = await repo.findMany('provider_connections', {}, 'created_at DESC');

      // Sanitize: CIPHERTEXT IS NEVER RETURNED
      const sanitized = connections.map((c) => ({
        id: c.id,
        type: c.type,
        label: c.label,
        fingerprint: c.fingerprint,
        last4: c.last4,
        status: c.status,
        spendCapUsd: c.spend_cap_usd,
        lastVerifiedAt: c.last_verified_at,
        createdAt: c.created_at,
      }));

      res.json({ connections: sanitized });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to list connections.' });
    }
  }
);

// POST /v1/connections - Create New Connection
connectionsRouter.post(
  '/',
  requireAuth,
  requireTenantRole('owner', 'admin'),
  async (req: AuthRequest, res) => {
    try {
      const { type, label, secret, spendCapUsd } = createConnectionSchema.parse(req.body);
      const tenantId = req.membership!.tenantId;
      const connectionId = `conn_${crypto.randomBytes(12).toString('hex')}`;
      const fingerprint = computeFingerprint(secret);
      const last4 = secret.slice(-4) || '••••';

      const encrypted = await encryptTenantSecret(tenantId, connectionId, secret, 1);

      const repo = new TenantRepository(tenantId);
      const created = await repo.insert('provider_connections', {
        id: connectionId,
        type,
        label,
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        tag: encrypted.tag,
        key_version: 1,
        fingerprint,
        last4,
        status: 'unverified',
        spend_cap_usd: spendCapUsd || null,
      });

      await logAuditEvent(tenantId, req.user!.id, 'connection_add', 'provider_connection', {
        connectionId,
        type,
        label,
        fingerprint,
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
          spendCapUsd: created.spend_cap_usd,
          createdAt: created.created_at,
        },
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.issues[0].message });
      }
      res.status(500).json({ error: 'Failed to create provider connection.' });
    }
  }
);

// POST /v1/connections/:id/verify - Real Verification
connectionsRouter.post(
  '/:id/verify',
  requireAuth,
  requireTenantRole('owner', 'admin'),
  async (req: AuthRequest, res) => {
    try {
      const tenantId = req.membership!.tenantId;
      const repo = new TenantRepository(tenantId);
      const conn = await repo.findOne('provider_connections', { id: req.params.id });

      if (!conn) {
        return res.status(404).json({ error: 'NOT_FOUND: Provider connection not found.' });
      }

      // Decrypt secret in memory ONLY
      const rawSecret = await decryptTenantSecret(
        tenantId,
        conn.id,
        conn.ciphertext,
        conn.iv,
        conn.tag,
        conn.key_version
      );

      // Perform Real Low-Cost Verification Call
      const result = await verifyProviderApiKey(conn.type, rawSecret);
      const newStatus = result.verified ? 'verified' : 'failed';

      await repo.insert('provider_connections', {
        id: conn.id,
        status: newStatus,
        last_verified_at: new Date().toISOString(),
      });

      await logAuditEvent(tenantId, req.user!.id, 'connection_verify', 'provider_connection', {
        connectionId: conn.id,
        status: newStatus,
        message: result.message,
      });

      res.json({
        success: result.verified,
        status: newStatus,
        message: result.message,
        lastVerifiedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to verify connection.' });
    }
  }
);

// DELETE /v1/connections/:id
connectionsRouter.delete(
  '/:id',
  requireAuth,
  requireTenantRole('owner', 'admin'),
  async (req: AuthRequest, res) => {
    try {
      const tenantId = req.membership!.tenantId;
      const repo = new TenantRepository(tenantId);
      const deleted = await repo.deleteOne('provider_connections', { id: req.params.id });

      if (!deleted) {
        return res.status(404).json({ error: 'NOT_FOUND: Provider connection not found.' });
      }

      await logAuditEvent(tenantId, req.user!.id, 'connection_delete', 'provider_connection', {
        connectionId: req.params.id,
      });

      res.json({ success: true, message: 'Connection deleted successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete connection.' });
    }
  }
);
