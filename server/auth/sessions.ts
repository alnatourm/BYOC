import crypto from 'node:crypto';
import { db } from '../db';
import { env } from '../config';

export function generateToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateCsrfSecret(): string {
  return crypto.randomBytes(24).toString('hex');
}

export function deriveCsrfToken(csrfSecret: string): string {
  return crypto.createHmac('sha256', env.SESSION_SECRET).update(csrfSecret).digest('hex');
}

export async function createSession(userId: string): Promise<{ sessionToken: string; csrfToken: string }> {
  const sessionToken = generateToken();
  const tokenHash = hashToken(sessionToken);
  const csrfSecret = generateCsrfSecret();
  const csrfToken = deriveCsrfToken(csrfSecret);
  const sessionId = `sess_${crypto.randomBytes(12).toString('hex')}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.query(
    `INSERT INTO sessions (id, user_id, token_hash, csrf_secret, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [sessionId, userId, tokenHash, csrfSecret, expiresAt]
  );

  return { sessionToken, csrfToken };
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  await db.query(
    `UPDATE sessions SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId]
  );
}

export const SESSION_COOKIE_NAME = env.NODE_ENV === 'production' ? '__Host-sid' : 'sid';
