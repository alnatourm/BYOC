import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { db } from '../db';
import { hashPassword, verifyPassword } from '../auth/scrypt';
import { createSession, revokeAllUserSessions, SESSION_COOKIE_NAME } from '../auth/sessions';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { signupRateLimiter, loginRateLimiter, forgotRateLimiter } from '../middleware/rateLimit';
import { logAuditEvent } from '../audit/chain';
import { getOrCreateTenantDek } from '../vault/crypto';
import { isEmailServiceConfigured, createAndSendEmailToken, consumeEmailToken } from '../services/email';
import { env } from '../config';

export const authRouter = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  companyName: z.string().min(2, 'Company name is required'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(12, 'Password must be at least 12 characters'),
});

// POST /v1/auth/signup
authRouter.post('/signup', signupRateLimiter, async (req, res) => {
  try {
    const { email, password, companyName } = signupSchema.parse(req.body);
    const lowercaseEmail = email.toLowerCase().trim();

    const { rows: existing } = await db.query('SELECT id FROM users WHERE email = $1', [lowercaseEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'EMAIL_EXISTS: An account with this email address already exists.' });
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr_${crypto.randomBytes(12).toString('hex')}`;
    const tenantId = `tnt_${crypto.randomBytes(12).toString('hex')}`;

    const { rows: planRows } = await db.query('SELECT id FROM plans WHERE id = $1', ['free']);
    const planId = planRows[0]?.id || 'free';

    await db.query(
      'INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)',
      [userId, lowercaseEmail, passwordHash]
    );

    await db.query(
      'INSERT INTO tenants (id, name, plan_id, separation_of_duties) VALUES ($1, $2, $3, $4)',
      [tenantId, companyName, planId, true]
    );

    await db.query(
      'INSERT INTO memberships (tenant_id, user_id, role, reviewer_scope) VALUES ($1, $2, $3, $4)',
      [tenantId, userId, 'owner', 'owner']
    );

    await getOrCreateTenantDek(tenantId, 1);

    if (isEmailServiceConfigured() || env.NODE_ENV === 'development') {
      await createAndSendEmailToken(userId, lowercaseEmail, 'verification');
    }

    const { sessionToken, csrfToken } = await createSession(userId);

    res.cookie(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    await logAuditEvent(tenantId, userId, 'auth.signup', `user:${userId}`, { email: lowercaseEmail, tenantName: companyName });

    res.status(201).json({
      success: true,
      user: { id: userId, email: lowercaseEmail, emailVerified: false },
      tenant: { id: tenantId, name: companyName },
      token: sessionToken,
      csrfToken,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/auth/login
authRouter.post('/login', loginRateLimiter, async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const lowercaseEmail = email.toLowerCase().trim();

    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [lowercaseEmail]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS: Email or password incorrect.' });
    }

    const user = rows[0];
    const passwordMatch = await verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS: Email or password incorrect.' });
    }

    const { rows: memRows } = await db.query(
      `SELECT t.id, t.name FROM memberships m JOIN tenants t ON t.id = m.tenant_id WHERE m.user_id = $1`,
      [user.id]
    );
    const tenant = memRows[0] || null;
    const tenantId = tenant?.id || 'unknown';

    const { sessionToken, csrfToken } = await createSession(user.id);

    res.cookie(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    await logAuditEvent(tenantId, user.id, 'auth.login', `user:${user.id}`, { email: user.email });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        emailVerified: !!user.email_verified_at,
        platformRole: user.platform_role,
      },
      tenant,
      token: sessionToken,
      csrfToken,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    console.error('Login Error:', err);
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/auth/logout
authRouter.post('/logout', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (req.user) {
      await db.query('UPDATE sessions SET revoked_at = NOW() WHERE user_id = $1', [req.user.id]);
    }
    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// GET /v1/auth/me & GET /v1/me
export const meHandler = async (req: AuthRequest, res: any) => {
  try {
    const { rows: userRows } = await db.query('SELECT * FROM users WHERE id = $1', [req.user!.id]);
    const user = userRows[0];

    const { rows: tenantRows } = await db.query(
      `SELECT t.id, t.name, t.plan_id, t.separation_of_duties, m.role, m.reviewer_scope
       FROM memberships m
       JOIN tenants t ON t.id = m.tenant_id
       WHERE m.user_id = $1`,
      [req.user!.id]
    );

    const tenant = tenantRows[0] || null;

    res.json({
      user: {
        id: user.id,
        email: user.email,
        emailVerified: !!user.email_verified_at,
        platformRole: user.platform_role,
      },
      membership: req.membership,
      tenant: tenant ? {
        id: tenant.id,
        name: tenant.name,
        planId: tenant.plan_id,
        role: tenant.role,
        reviewerScope: tenant.reviewer_scope,
        separationOfDuties: tenant.separation_of_duties ?? true,
      } : null,
      csrfToken: (req as any).csrfToken,
    });
  } catch (err) {
    console.error('Me endpoint error:', err);
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
};

authRouter.get('/me', requireAuth, meHandler);

// POST /v1/auth/verify-email
authRouter.post('/verify-email', async (req, res) => {
  try {
    const { token } = verifyEmailSchema.parse(req.body);
    const result = await consumeEmailToken(token, 'verification');

    if (!result.valid) {
      return res.status(400).json({ error: result.error || 'INVALID_TOKEN' });
    }

    await db.query('UPDATE users SET email_verified_at = NOW() WHERE id = $1', [result.userId]);

    res.json({ success: true, message: 'Email address verified successfully.' });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/auth/verify-current-user-email
authRouter.post('/verify-current-user-email', requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.query('UPDATE users SET email_verified_at = NOW() WHERE id = $1', [req.user!.id]);
    res.json({ success: true, message: 'Email verified successfully.' });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/auth/forgot
authRouter.post('/forgot', forgotRateLimiter, async (req, res) => {
  try {
    const { email } = forgotSchema.parse(req.body);
    const lowercaseEmail = email.toLowerCase().trim();

    if (env.NODE_ENV === 'production' && !isEmailServiceConfigured()) {
      return res.status(503).json({
        error: 'EMAIL_NOT_CONFIGURED: Password reset email service is currently unavailable.',
      });
    }

    const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [lowercaseEmail]);
    if (rows.length > 0) {
      await createAndSendEmailToken(rows[0].id, lowercaseEmail, 'password_reset');
    }

    res.status(202).json({
      status: 'accepted',
      message: 'If an account with that email exists, a password reset link has been dispatched.',
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/auth/reset-password
authRouter.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = resetPasswordSchema.parse(req.body);
    const result = await consumeEmailToken(token, 'password_reset');

    if (!result.valid) {
      return res.status(400).json({ error: result.error || 'INVALID_TOKEN' });
    }

    const newHash = await hashPassword(newPassword);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, result.userId]);

    await revokeAllUserSessions(result.userId!);

    res.json({ success: true, message: 'Password reset successfully. Please log in with your new password.' });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});
