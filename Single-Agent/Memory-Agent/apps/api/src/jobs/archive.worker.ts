import { db } from '../config/db.js';
import { memoryEntries } from '../db/schema/index.js';
import { eq, and, isNull } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

/**
 * Background worker to automatically move low-importance or aged memories to 'archived' state.
 */
export async function processArchiveJob(memoryId: string) {
  try {
    logger.info(`Processing background memory archiving for memory: ${memoryId}`);
    const existing = await db
      .select()
      .from(memoryEntries)
      .where(and(eq(memoryEntries.id, memoryId), isNull(memoryEntries.deletedAt)));

    if (existing.length > 0) {
      await db
        .update(memoryEntries)
        .set({ type: 'archived', updatedAt: new Date().toISOString() })
        .where(eq(memoryEntries.id, memoryId));
      logger.info(`Successfully archived memory entry: ${memoryId}`);
    }
  } catch (err: any) {
    logger.error(`Archive worker failed for memory ${memoryId}: ${err.message}`);
  }
}
