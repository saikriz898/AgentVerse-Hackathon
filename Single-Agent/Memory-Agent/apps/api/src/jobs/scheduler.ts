import { sweepQueue } from './queue.js';
import { logger } from '../utils/logger.js';

export class JobScheduler {
  initScheduler() {
    logger.info('Initializing background cron job scheduler...');

    // Schedule hourly TTL memory cleanup sweep job
    try {
      sweepQueue?.add('hourly-sweep', {}, { repeat: { every: 60 * 60 * 1000 } });
      logger.info('Successfully scheduled hourly memory cleanup sweep job.');
    } catch (err: any) {
      logger.warn(`JobScheduler setup warning: ${err.message}`);
    }
  }
}

export const jobScheduler = new JobScheduler();
