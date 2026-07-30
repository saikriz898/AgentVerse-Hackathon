import { compressText } from '../engines/compression.engine.js';
import { db } from '../config/db.js';
import { memoryEntries } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

export async function processSummarizeJob(memoryId: string, content: string) {
  try {
    logger.info(`Processing compression/summarization job for memory: ${memoryId}`);
    const compressed = await compressText(content);
    await db.update(memoryEntries)
      .set({ content: compressed, updatedAt: new Date().toISOString() })
      .where(eq(memoryEntries.id, memoryId));
    logger.info(`Successfully compressed memory: ${memoryId}`);
  } catch (err: any) {
    logger.error(`Summarize worker failed for memory ${memoryId}: ${err.message}`);
  }
}
