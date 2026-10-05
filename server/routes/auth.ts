import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { db } from '../db';
import { hashPassword, verifyPassword } from '../auth/scrypt';
import { createSession, revokeAllUserSessions, deriveCsrfToken, SESSION_COOKIE_NAME } from '../auth/sessions';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { signupRateLimiter, loginRateLimiter, forgotRateLimiter } from '../middleware/rateLimit';
import { logAuditEvent } from '../audit/chain';
import { getOrCreateTenantDek } from '../vault/crypto';
import { env } from '../config';

export const authRouter = Router();

// Signup Schema
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12, 'Password must be at least 12 characters'),
  companyName: z.string().min(2, 'Company name is required'),
});

// Login Schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Signup Route
authRouter.post('/signup', signupRateLimiter, async (req, res) => {
  try {
    const { email, password, companyName } = signupSchema.parse(req.body);
    const lowercaseEmail = email.toLowerCase().trim();

    // Check existing email
    const { rows: existing } = await db.query('SELECT id FROM users WHERE email = $1', [lowercaseEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'EMAIL_EXISTS: An account with this email address already exists.' });
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr_${crypto.randomBytes(12).toString('hex')}`;
    const tenantId = `tnt_${crypto.randomBytes(12).toString('hex')}`;

    // Create Tenant (Free Plan by default)
    await db.query('INSERT INTO tenants (id, name, plan_id) VALUES ($1, $2, $3)', [
      tenantId,
      companyName,
      'free',
    ]);

    // Create User
    await db.query(
      'INSERT INTO users (id, email, password_hash, email_verified_at) VALUES ($1, $2, $3, NOW())',
      [userId, lowercaseEmail, passwordHash]
    );

    // Create Membership (Owner)
    await db.query(
      'INSERT INTO memberships (tenant_id, user_id, role) VALUES ($1, $2, $3)',
      [tenantId, userId, 'owner']
    );

    // Initialize Tenant Wrapped DEK in Vault
    await getOrCreateTenantDek(tenantId, 1);

    // Log Audit Event
    await logAuditEvent(tenantId, userId, 'signup', 'tenant', { email: lowercaseEmail, companyName });

    // Create Session
    const { sessionToken, csrfToken } = await createSession(userId);

    res.cookie(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      user: { id: userId, email: lowercaseEmail, platformRole: null },
      tenant: { id: tenantId, name: companyName, role: 'owner' },
      csrfToken,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues[0].message });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to process signup.' });
  }
});

// Login Route
authRouter.post('/login', loginRateLimiter, async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const lowercaseEmail = email.toLowerCase().trim();

    const { rows } = await db.query(
      `SELECT u.id, u.email, u.password_hash, u.platform_role, m.tenant_id, m.role as tenant_role, t.name as tenant_name
       FROM users u
       LEFT JOIN memberships m ON m.user_id = u.id
       LEFT JOIN tenants t ON t.id = m.tenant_id
       WHERE u.email = $1`,
      [lowercaseEmail]
    );

    const user = rows[0];
    const passwordValid = await verifyPassword(password, user ? user.password_hash : '');

    if (!user || !passwordValid) {
      if (user && user.tenant_id) {
        await logAuditEvent(user.tenant_id, user.id, 'login_failure', 'user', { email: lowercaseEmail });
      }
      return res.status(401).json({ error: 'INVALID_CREDENTIALS: Incorrect email or password.' });
    }

    // Log Login Audit
    if (user.tenant_id) {
      await logAuditEvent(user.tenant_id, user.id, 'login_success', 'user', { email: lowercaseEmail });
    }

    const { sessionToken, csrfToken } = await createSession(user.id);

    res.cookie(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: { id: user.id, email: user.email, platformRole: user.platform_role },
      tenant: user.tenant_id ? { id: user.tenant_id, name: user.tenant_name, role: user.tenant_role } : null,
      csrfToken,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.issues[0].message });
    }
    res.status(500).json({ error: 'Failed to process login.' });
  }
});

// Logout Route
authRouter.post('/logout', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (req.user && req.membership) {
      await logAuditEvent(req.membership.tenantId, req.user.id, 'logout', 'user', {});
      await revokeAllUserSessions(req.user.id);
    }

    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    res.json({ success: true, message: 'Logged out successfully.' });
  } catch {
    res.status(500).json({ error: 'Failed to logout.' });
  }
});

// GET /v1/me Profile & CSRF Token Fetch
authRouter.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const csrfToken = req.session ? deriveCsrfToken(req.session.csrfSecret) : '';

  let tenantDetails = null;
  if (req.membership) {
    const { rows } = await db.query('SELECT name, plan_id FROM tenants WHERE id = $1', [req.membership.tenantId]);
    if (rows.length > 0) {
      tenantDetails = {
        id: req.membership.tenantId,
        name: rows[0].name,
        planId: rows[0].plan_id,
        role: req.membership.role,
        reviewerScope: req.membership.reviewerScope,
      };
    }
  }

  res.json({
    user: req.user,
    tenant: tenantDetails,
    csrfToken,
  });
});

// POST /v1/auth/forgot
authRouter.post('/forgot', forgotRateLimiter, async (req, res) => {
  const { email } = req.body;
  if (email && typeof email === 'string') {
    const lowercase = email.toLowerCase().trim();
    const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [lowercase]);
    if (rows.length > 0) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const tokenId = `tok_${crypto.randomBytes(12).toString('hex')}`;
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.query(
        'INSERT INTO email_tokens (id, user_id, kind, token_hash, expires_at) VALUES ($1, $2, $3, $4, $5)',
        [tokenId, rows[0].id, 'reset', tokenHash, expiresAt]
      );

      if (env.NODE_ENV !== 'production') {
        console.log(`🔑 PASSWORD RESET LINK for ${lowercase}: http://localhost:3000/reset?token=${resetToken}`);
      }
    }
  }

  // Uniform 202 Response
  res.status(202).json({
    message: 'If an account exists with that email address, password reset instructions have been dispatched.',
  });
});

// POST /v1/auth/reset
authRouter.post('/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 12) {
      return res.status(400).json({ error: 'Token and a new password (min 12 chars) are required.' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const { rows } = await db.query(
      'SELECT id, user_id, expires_at, used_at FROM email_tokens WHERE token_hash = $1 AND kind = $2',
      [tokenHash, 'reset']
    );

    if (rows.length === 0 || rows[0].used_at || new Date(rows[0].expires_at) < new Date()) {
      return res.status(400).json({ error: 'INVALID_TOKEN: Reset token is invalid, used, or expired.' });
    }

    const userId = rows[0].user_id;
    const newPasswordHash = await hashPassword(newPassword);

    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, userId]);
    await db.query('UPDATE email_tokens SET used_at = NOW() WHERE id = $1', [rows[0].id]);
    await revokeAllUserSessions(userId);

    res.json({ success: true, message: 'Password reset successfully. All active sessions revoked.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});
