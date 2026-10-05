import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { requireAuth, requirePlatformRole, AuthRequest } from '../middleware/auth';
import { db } from '../db';
import { logAuditEvent } from '../audit/chain';

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(requirePlatformRole('super_admin'));

const createQuoteSchema = z.object({
  provider: z.string().min(1, 'Provider is required'),
  planLabel: z.string().min(1, 'Plan label is required'),
  amountUsd: z.number().nonnegative(),
  currency: z.string().default('USD'),
  sourceUrl: z.string().url('Source URL must be valid'),
  quotedAt: z.string().datetime().optional(),
});

const updatePlanSchema = z.object({
  priceMonthlyUsd: z.number().nullable().optional(),
  runsPerMonth: z.number().int().positive().optional(),
  activeRuns: z.number().int().positive().optional(),
  projects: z.number().int().positive().optional(),
});

// GET /v1/admin/tenants
adminRouter.get('/tenants', async (req: AuthRequest, res) => {
  try {
    const { rows } = await db.query(`
      SELECT t.id, t.name, t.plan_id, t.status, t.created_at,
             COUNT(m.user_id) as member_count
      FROM tenants t
      LEFT JOIN memberships m ON m.tenant_id = t.id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `);
    res.json({ tenants: rows });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// GET /v1/admin/users
adminRouter.get('/users', async (req: AuthRequest, res) => {
  try {
    const { rows } = await db.query(`
      SELECT u.id, u.email, u.platform_role, u.created_at,
             m.tenant_id, m.role as tenant_role
      FROM users u
      LEFT JOIN memberships m ON m.user_id = u.id
      ORDER BY u.created_at DESC
    `);
    res.json({ users: rows });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// GET /v1/admin/plans
adminRouter.get('/plans', async (req: AuthRequest, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM plans ORDER BY id ASC');
    res.json({ plans: rows });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// PUT /v1/admin/plans/:id
adminRouter.put('/plans/:id', async (req: AuthRequest, res) => {
  try {
    const data = updatePlanSchema.parse(req.body);
    await db.query(
      `UPDATE plans 
       SET price_monthly_usd = COALESCE($1, price_monthly_usd),
           runs_per_month = COALESCE($2, runs_per_month),
           active_runs = COALESCE($3, active_runs),
           projects = COALESCE($4, projects)
       WHERE id = $5`,
      [data.priceMonthlyUsd, data.runsPerMonth, data.activeRuns, data.projects, req.params.id]
    );

    if (req.membership) {
      await logAuditEvent(
        req.membership.tenantId,
        req.user!.id,
        'admin.update_plan',
        `plan:${req.params.id}`,
        data
      );
    }

    res.json({ success: true, message: 'Plan configuration updated.' });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// GET /v1/admin/quotes
adminRouter.get('/quotes', async (req: AuthRequest, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM price_quotes ORDER BY quoted_at DESC');
    res.json({ quotes: rows });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/admin/quotes
adminRouter.post('/quotes', async (req: AuthRequest, res) => {
  try {
    const data = createQuoteSchema.parse(req.body);
    const quoteId = `pq_${crypto.randomBytes(12).toString('hex')}`;
    const quotedAt = data.quotedAt ? new Date(data.quotedAt) : new Date();

    await db.query(
      `INSERT INTO price_quotes (id, provider, plan_label, amount_usd, currency, source_url, quoted_at, entered_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [quoteId, data.provider, data.planLabel, data.amountUsd, data.currency, data.sourceUrl, quotedAt, req.user!.id]
    );

    if (req.membership) {
      await logAuditEvent(
        req.membership.tenantId,
        req.user!.id,
        'admin.create_quote',
        `quote:${quoteId}`,
        { provider: data.provider, amountUsd: data.amountUsd }
      );
    }

    res.status(201).json({ success: true, quoteId });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// DELETE /v1/admin/quotes/:id
adminRouter.delete('/quotes/:id', async (req: AuthRequest, res) => {
  try {
    await db.query('DELETE FROM price_quotes WHERE id = $1', [req.params.id]);

    if (req.membership) {
      await logAuditEvent(
        req.membership.tenantId,
        req.user!.id,
        'admin.delete_quote',
        `quote:${req.params.id}`,
        { quoteId: req.params.id }
      );
    }

    res.json({ success: true, message: 'Quote deleted successfully.' });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});
