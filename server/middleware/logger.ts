import pino from 'pino';
import helmet from 'helmet';
import cors from 'cors';
import { env } from '../config';

export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.rawSecret',
      'req.body.secretKey',
      'password',
      'secret',
      'token',
      'key',
    ],
    censor: '[REDACTED]',
  },
});

export const helmetMiddleware = helmet({
  frameguard: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:", "https:"],
      frameAncestors: ["*"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
    if (!origin || allowed.includes(origin) || env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('CORS_BLOCKED: Origin not permitted by server policy.'));
    }
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'x-csrf-token', 'Authorization'],
});
