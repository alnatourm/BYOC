import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { requireAuth, requirePlatformRole, AuthRequest } from '../middleware/auth';
import { db } from '../db';
import { logAuditEvent } from '../audit/chain';

export const adminRouter = Router();

adminRouter.use(requireAuth);

// POST /v1/admin/claim-superadmin (Allows current authenticated user to elevate to super_admin)
adminRouter.post('/claim-superadmin', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    await db.query(`UPDATE users SET platform_role = 'super_admin' WHERE id = $1`, [userId]);
    res.json({
      success: true,
      message: 'Granted platform super_admin role successfully.',
      user: { ...req.user, platformRole: 'super_admin' },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update platform role.' });
  }
});

// GET /v1/admin/status (Checks current user & platform admin status)
adminRouter.get('/status', async (req: AuthRequest, res) => {
  try {
    res.json({
      user: req.user,
      membership: req.membership,
      isSuperAdmin: req.user?.platformRole === 'super_admin',
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch status.' });
  }
});

// All endpoints below require super_admin platformRole
adminRouter.use(requirePlatformRole('super_admin'));

// GET /v1/admin/db-diagnostics (Read-only database diagnostics for platform admins)
adminRouter.get('/db-diagnostics', async (req: AuthRequest, res) => {
  try {
    const isPostgres = !!process.env.DATABASE_URL;
    let connectivityStatus = 'NOT VERIFIED';
    let latestVersion = 0;

    try {
      await db.query('SELECT 1');
      connectivityStatus = 'CONNECTED';
      const { rows } = await db.query('SELECT MAX(version) as max_version FROM schema_migrations');
      latestVersion = rows[0]?.max_version || 0;
    } catch {
      connectivityStatus = 'DISCONNECTED';
    }

    res.json({
      backendType: isPostgres ? 'PostgreSQL' : 'PGlite',
      persistenceConfigured: isPostgres,
      connectivity: connectivityStatus,
      latestMigrationVersion: latestVersion,
      cloudSqlInstanceId: 'NOT VERIFIED',
      cloudSqlInstanceConnectionName: 'NOT VERIFIED',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({ error: 'DB_DIAGNOSTICS_FAILED' });
  }
});

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

const factorySettingsSchema = z.object({
  role: z.enum(['spec', 'design', 'dev', 'qc', 'release']),
  model: z.string().default('gemini-3.8-flash'),
  connectionId: z.string().nullable().optional(),
});

// GET /v1/admin/factory-settings
adminRouter.get('/factory-settings', async (req: AuthRequest, res) => {
  try {
    const { rows } = await db.query(`
      SELECT f.role, f.model, f.connection_id, f.updated_at,
             c.label as connection_label, c.type as connection_type, c.last4 as connection_last4
      FROM system_factory_settings f
      LEFT JOIN provider_connections c ON c.id = f.connection_id
      ORDER BY f.role ASC
    `);

    // Ensure all 5 roles exist in output
    const roles = ['spec', 'design', 'dev', 'qc', 'release'];
    const resultMap = new Map(rows.map((r) => [r.role, r]));

    const factorySettings = roles.map((r) => {
      const existing = resultMap.get(r);
      return {
        role: r,
        model: existing?.model || 'gemini-3.8-flash',
        connectionId: existing?.connection_id || null,
        connectionLabel: existing?.connection_label || null,
        connectionType: existing?.connection_type || null,
        connectionLast4: existing?.connection_last4 || null,
        updatedAt: existing?.updated_at || new Date().toISOString(),
      };
    });

    res.json({
      factorySettings,
      platformEnvKeyConfigured: !!process.env.GEMINI_API_KEY,
    });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/admin/factory-settings
adminRouter.post('/factory-settings', async (req: AuthRequest, res) => {
  try {
    const data = factorySettingsSchema.parse(req.body);
    await db.query(
      `INSERT INTO system_factory_settings (role, model, connection_id, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (role) DO UPDATE
       SET model = EXCLUDED.model,
           connection_id = EXCLUDED.connection_id,
           updated_at = NOW()`,
      [data.role, data.model, data.connectionId || null]
    );

    if (req.membership) {
      await logAuditEvent(
        req.membership.tenantId,
        req.user!.id,
        'admin.update_factory_settings',
        `factory_role:${data.role}`,
        data
      );
    }

    res.json({ success: true, message: `System factory settings for role '${data.role}' updated.` });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
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
