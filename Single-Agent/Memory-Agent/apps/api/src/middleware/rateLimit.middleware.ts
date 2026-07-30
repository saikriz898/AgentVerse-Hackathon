import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
import { redis } from '../config/redis.js';
import { env } from '../config/env.js';

const memoryRateMap = new Map<string, { count: number; resetAt: number }>();

export async function rateLimiter(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const identifier = req.user?.id || req.ip || 'anonymous';
  const key = `ratelimit:${identifier}`;
  const now = Date.now();

  if (redis) {
    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000));
      }
      if (current > env.RATE_LIMIT_MAX) {
        return res.status(429).json({ error: 'Too Many Requests: Rate limit exceeded' });
      }
      return next();
    } catch (err) {
      // Fallback to in-memory rate limiter if Redis call fails
    }
  }

  // In-memory rate limiting fallback
  const record = memoryRateMap.get(key) || { count: 0, resetAt: now + env.RATE_LIMIT_WINDOW_MS };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + env.RATE_LIMIT_WINDOW_MS;
  } else {
    record.count += 1;
  }
  memoryRateMap.set(key, record);

  if (record.count > env.RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too Many Requests: Rate limit exceeded' });
  }

  next();
}
