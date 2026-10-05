import { Router } from 'express';
import { requireAuth, requireTenantRole, AuthRequest } from '../middleware/auth';
import { TenantRepository } from '../db/repository';
import { verifyAuditChain } from '../audit/chain';

export const auditRouter = Router();

// GET /v1/audit - List Audit Log
auditRouter.get(
  '/',
  requireAuth,
  requireTenantRole('owner', 'admin', 'reviewer', 'viewer'),
  async (req: AuthRequest, res) => {
    try {
      const repo = new TenantRepository(req.membership!.tenantId);
      const events = await repo.findMany('audit_events', {}, 'seq DESC');

      res.json({
        total: events.length,
        events: events.map((e) => ({
          id: e.id,
          seq: e.seq,
          actorUserId: e.actor_user_id,
          action: e.action,
          subject: e.subject,
          payload: JSON.parse(e.payload_json || '{}'),
          prevHash: e.prev_hash,
          hash: e.hash,
          timestamp: e.at,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve audit log.' });
    }
  }
);

// GET /v1/audit/verify - Recompute Hash Chain
auditRouter.get(
  '/verify',
  requireAuth,
  requireTenantRole('owner', 'admin', 'viewer'),
  async (req: AuthRequest, res) => {
    try {
      const result = await verifyAuditChain(req.membership!.tenantId);
      res.json({
        valid: result.valid,
        brokenSeq: result.brokenSeq || null,
        totalEvents: result.totalEvents,
        message: result.valid
          ? '✅ Audit chain integrity verified. SHA-256 hash sequence intact.'
          : `⚠️ Audit chain broken at event sequence #${result.brokenSeq}.`,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to verify audit chain.' });
    }
  }
);

// GET /v1/audit/export - Export CSV or JSON
auditRouter.get(
  '/export',
  requireAuth,
  requireTenantRole('owner', 'admin'),
  async (req: AuthRequest, res) => {
    try {
      const format = (req.query.format as string) || 'json';
      const repo = new TenantRepository(req.membership!.tenantId);
      const events = await repo.findMany('audit_events', {}, 'seq ASC');

      if (format === 'csv') {
        const header = 'seq,id,actor_user_id,action,subject,hash,at\n';
        const rows = events
          .map((e) => `${e.seq},"${e.id}","${e.actor_user_id || 'system'}","${e.action}","${e.subject}","${e.hash}","${e.at}"`)
          .join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="audit_log.csv"');
        return res.send(header + rows);
      }

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="audit_log.json"');
      res.json({ events });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to export audit log.' });
    }
  }
);
