import { Request, Response, NextFunction } from 'express';

interface RateBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateBucket>();

// Periodic bucket eviction every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}, 10 * 60 * 1000);

export function createRateLimiter(limit: number, windowMs: number, keyPrefix: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 1, resetAt: now + windowMs };
      buckets.set(key, bucket);
      return next();
    }

    if (bucket.count >= limit) {
      const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfterSec);
      return res.status(429).json({
        error: `TOO_MANY_REQUESTS: Rate limit exceeded for ${keyPrefix}. Try again in ${retryAfterSec} seconds.`,
      });
    }

    bucket.count += 1;
    next();
  };
}

export const loginRateLimiter = createRateLimiter(10, 15 * 60 * 1000, 'login'); // 10/15min
export const signupRateLimiter = createRateLimiter(5, 60 * 60 * 1000, 'signup'); // 5/hour
export const forgotRateLimiter = createRateLimiter(5, 60 * 60 * 1000, 'forgot'); // 5/hour
