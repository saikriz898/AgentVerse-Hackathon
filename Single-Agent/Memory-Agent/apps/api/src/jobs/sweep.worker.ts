import { db } from '../config/db.js';
import { memoryEntries } from '../db/schema/index.js';
import { isNotNull, lte, and } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

/**
 * Sweep worker for TTL-based eviction (short_term, working, session memory types).
 * Soft-deletes or archives memories past their expiration timestamp.
 */
export async function runMemorySweepJob() {
  try {
    const nowIso = new Date().toISOString();
    logger.info(`Running memory sweep worker for expired TTL entries at ${nowIso}...`);

    const expired = await db.update(memoryEntries)
      .set({ deletedAt: nowIso })
      .where(
        and(
          isNotNull(memoryEntries.expiresAt),
          lte(memoryEntries.expiresAt, nowIso)
        )
      );

    logger.info('Memory TTL sweep job completed successfully.');
  } catch (err: any) {
    logger.error(`Sweep worker failed: ${err.message}`);
  }
}
