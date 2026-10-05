import { Router } from 'express';
import { requireAuth, requirePlatformRole, AuthRequest } from '../middleware/auth';
import { db } from '../db';
import { logAuditEvent } from '../audit/chain';

export const adminRouter = Router();

// Require Super Admin Platform Role
adminRouter.use(requireAuth);
adminRouter.use(requirePlatformRole('super_admin'));

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
    res.status(500).json({ error: 'Failed to list platform tenants.' });
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
    res.status(500).json({ error: 'Failed to list platform users.' });
  }
});

// GET /v1/admin/plans
adminRouter.get('/plans', async (req: AuthRequest, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM plans ORDER BY id ASC');
    res.json({ plans: rows });
  } catch {
    res.status(500).json({ error: 'Failed to list plans.' });
  }
});

// PUT /v1/admin/plans/:id
adminRouter.put('/plans/:id', async (req: AuthRequest, res) => {
  try {
    const { priceMonthlyUsd, runsPerMonth, activeRuns, projects } = req.body;
    await db.query(
      `UPDATE plans 
       SET price_monthly_usd = $1, runs_per_month = $2, active_runs = $3, projects = $4
       WHERE id = $5`,
      [priceMonthlyUsd, runsPerMonth, activeRuns, projects, req.params.id]
    );

    if (req.membership) {
      await logAuditEvent(req.membership.tenantId, req.user!.id, 'admin_plan_update', 'plan', {
        planId: req.params.id,
        priceMonthlyUsd,
      });
    }

    res.json({ success: true, message: 'Plan configuration updated.' });
  } catch {
    res.status(500).json({ error: 'Failed to update plan.' });
  }
});
