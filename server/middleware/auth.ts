import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { hashToken, deriveCsrfToken, SESSION_COOKIE_NAME } from '../auth/sessions';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    platformRole: string | null;
  };
  membership?: {
    tenantId: string;
    role: string;
    reviewerScope: string | null;
  };
  session?: {
    id: string;
    csrfSecret: string;
  };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const rawToken = req.cookies?.[SESSION_COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');
    if (!rawToken) {
      return res.status(401).json({ error: 'UNAUTHENTICATED: Session cookie or Bearer token required.' });
    }

    const tokenHash = hashToken(rawToken);
    const { rows } = await db.query(
      `SELECT s.id as session_id, s.csrf_secret, s.expires_at, s.revoked_at,
              u.id as user_id, u.email, u.platform_role,
              m.tenant_id, m.role as tenant_role, m.reviewer_scope
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN memberships m ON m.user_id = u.id
       WHERE s.token_hash = $1`,
      [tokenHash]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'UNAUTHENTICATED: Invalid session token.' });
    }

    const row = rows[0];
    if (row.revoked_at || new Date(row.expires_at) < new Date()) {
      return res.status(401).json({ error: 'UNAUTHENTICATED: Session expired or revoked.' });
    }

    // CSRF Check on non-GET / non-HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const csrfHeader = req.headers['x-csrf-token'];
      const expectedCsrf = deriveCsrfToken(row.csrf_secret);
      if (!csrfHeader || csrfHeader !== expectedCsrf) {
        return res.status(403).json({ error: 'CSRF_REJECTED: Invalid or missing x-csrf-token header.' });
      }
    }

    req.user = {
      id: row.user_id,
      email: row.email,
      platformRole: row.platform_role,
    };

    req.session = {
      id: row.session_id,
      csrfSecret: row.csrf_secret,
    };

    if (row.tenant_id) {
      req.membership = {
        tenantId: row.tenant_id,
        role: row.tenant_role,
        reviewerScope: row.reviewer_scope,
      };
    }

    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'UNAUTHENTICATED: Session verification failed.' });
  }
}

export function requireTenantRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.membership) {
      return res.status(403).json({ error: 'FORBIDDEN: User does not belong to any tenant workspace.' });
    }

    if (!allowedRoles.includes(req.membership.role) && req.membership.role !== 'owner') {
      return res.status(403).json({ error: `FORBIDDEN: Requires role ${allowedRoles.join(' or ')}.` });
    }

    next();
  };
}

export function requirePlatformRole(requiredPlatformRole: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.platformRole !== requiredPlatformRole) {
      return res.status(403).json({ error: `FORBIDDEN: Platform role ${requiredPlatformRole} required.` });
    }
    next();
  };
}
