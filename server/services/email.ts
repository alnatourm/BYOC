import nodemailer from 'nodemailer';
import crypto from 'node:crypto';
import { env } from '../config';
import { db } from '../db';

export function isEmailServiceConfigured(): boolean {
  return !!(env.SMTP_URL && env.SMTP_URL.trim().length > 0);
}

export async function createAndSendEmailToken(userId: string, email: string, kind: 'verification' | 'password_reset'): Promise<{ token: string; sent: boolean }> {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const tokenId = `em_tok_${crypto.randomBytes(12).toString('hex')}`;
  await db.query(
    'INSERT INTO email_tokens (id, user_id, kind, token_hash, expires_at) VALUES ($1, $2, $3, $4, $5)',
    [tokenId, userId, kind, tokenHash, expiresAt]
  );

  const actionPath = kind === 'verification' ? '/verify-email' : '/reset-password';
  const fullLink = `${env.APP_URL}${actionPath}?token=${rawToken}`;

  if (isEmailServiceConfigured()) {
    try {
      const transporter = nodemailer.createTransport(env.SMTP_URL!);
      const subject = kind === 'verification' ? 'Verify Your Email - BYOC Platform' : 'Reset Your Password - BYOC Platform';
      await transporter.sendMail({
        from: '"BYOC Platform" <no-reply@byoc-platform.local>',
        to: email,
        subject,
        text: `Please click the link below to complete your action:\n\n${fullLink}`,
        html: `<p>Please click the link below to complete your action:</p><p><a href="${fullLink}">${fullLink}</a></p>`,
      });
      return { token: rawToken, sent: true };
    } catch (err) {
      console.error('SMTP Mail Send Error:', err);
      return { token: rawToken, sent: false };
    }
  }

  // Development Fallback Logging (STRICTLY DISABLED IN PRODUCTION)
  if (env.NODE_ENV === 'development') {
    console.log(`[DEV_EMAIL_LINK] (${kind}) Link for ${email}: ${fullLink}`);
  }

  return { token: rawToken, sent: false };
}

export async function consumeEmailToken(rawToken: string, expectedKind: 'verification' | 'password_reset'): Promise<{ valid: boolean; userId?: string; error?: string }> {
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const { rows } = await db.query(
    'SELECT * FROM email_tokens WHERE token_hash = $1 AND kind = $2 AND used_at IS NULL',
    [tokenHash, expectedKind]
  );

  if (rows.length === 0) {
    return { valid: false, error: 'INVALID_TOKEN: Token is invalid or already used.' };
  }

  const record = rows[0];
  if (new Date(record.expires_at) < new Date()) {
    return { valid: false, error: 'TOKEN_EXPIRED: Token has expired.' };
  }

  await db.query('UPDATE email_tokens SET used_at = NOW() WHERE id = $1', [record.id]);
  return { valid: true, userId: record.user_id };
}
