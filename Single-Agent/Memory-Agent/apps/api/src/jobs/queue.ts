import { Queue } from 'bullmq';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let memoryQueue: Queue | null = null;
let embeddingQueue: Queue | null = null;
let relationshipQueue: Queue | null = null;
let graphQueue: Queue | null = null;
let searchQueue: Queue | null = null;
let cleanupQueue: Queue | null = null;

try {
  const connection = { host: 'localhost', port: 6379 };
  memoryQueue = new Queue('memory-queue', { connection });
  embeddingQueue = new Queue('embedding-queue', { connection });
  relationshipQueue = new Queue('relationship-queue', { connection });
  graphQueue = new Queue('graph-queue', { connection });
  searchQueue = new Queue('search-queue', { connection });
  cleanupQueue = new Queue('cleanup-queue', { connection });
} catch (err: any) {
  logger.warn('BullMQ Queues initialized in synchronous fallback mode (Redis non-blocking).');
}

export {
  memoryQueue,
  embeddingQueue,
  relationshipQueue,
  graphQueue,
  searchQueue,
  cleanupQueue,
  // Alias compatibility
  embeddingQueue as embedQueue,
  memoryQueue as summarizeQueue,
  cleanupQueue as sweepQueue,
};
