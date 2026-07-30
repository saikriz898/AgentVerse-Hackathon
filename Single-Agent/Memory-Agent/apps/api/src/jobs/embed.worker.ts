import { generateEmbedding } from '../engines/embedding.engine.js';
import { db } from '../config/db.js';
import { embeddings } from '../db/schema/index.js';
import { logger } from '../utils/logger.js';

export async function processEmbedJob(memoryId: string, content: string) {
  try {
    logger.info(`Processing vector embedding job for memory: ${memoryId}`);
    const vector = await generateEmbedding(content);
    await db.insert(embeddings).values({
      id: crypto.randomUUID(),
      memoryId,
      vectorJson: JSON.stringify(vector),
      dimensions: vector.length,
      model: 'text-embedding-004',
    });
    logger.info(`Successfully processed embedding for memory: ${memoryId}`);
  } catch (err: any) {
    logger.error(`Embed worker failed for memory ${memoryId}: ${err.message}`);
  }
}
