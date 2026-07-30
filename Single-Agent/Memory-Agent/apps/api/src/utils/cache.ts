import { logger } from './logger.js';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class CacheManager {
  private memoryCache = new Map<string, CacheEntry<any>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.memoryCache.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.memoryCache.delete(key);
  }

  async invalidateWorkspace(workspaceId: string): Promise<void> {
    for (const key of this.memoryCache.keys()) {
      if (key.includes(workspaceId)) {
        this.memoryCache.delete(key);
      }
    }
    logger.info(`Invalidated cache for workspace: ${workspaceId}`);
  }
}

export const cache = new CacheManager();
