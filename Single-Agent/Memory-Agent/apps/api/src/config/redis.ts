import { Redis } from 'ioredis';
import { env } from './env.js';

let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  try {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 3) return null; // Fail gracefully if Redis is not running
        return Math.min(times * 100, 2000);
      },
    });
    redisClient.on('error', (err) => {
      // Suppress noisy error dumps when running in dev mode without Redis
    });
  } catch (err) {
    redisClient = null;
  }

  return redisClient;
}

export const redis = getRedisClient();
