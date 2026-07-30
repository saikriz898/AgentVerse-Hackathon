import { app } from './app.js';
import { env, getApiKey } from './config/env.js';
import { logger } from './utils/logger.js';
import { runMigrations } from './db/migrate.js';

async function performStartupCheck() {
  logger.info('Performing startup environment & credentials check...');

  // 1. Check Database Provider & Connection String
  if (env.DATABASE_PROVIDER === 'postgres') {
    if (!env.DATABASE_URL || (!env.DATABASE_URL.startsWith('postgres://') && !env.DATABASE_URL.startsWith('postgresql://'))) {
      logger.error('CRITICAL STARTUP ERROR: DATABASE_PROVIDER=postgres but DATABASE_URL is missing or invalid.');
      logger.error('Expected valid PostgreSQL / Neon connection string starting with postgresql:// or postgres://');
      process.exit(1);
    }
    logger.info('✅ PostgreSQL DATABASE_URL verified.');
  }

  // 2. Check Google Gemini API Key
  const apiKey = getApiKey();
  if (!apiKey) {
    logger.warn('⚠️ WARNING: GOOGLE_API_KEY / GEMINI_API_KEY is not configured in environment.');
    logger.warn('Embedding engine and AI summarizers will run in local deterministic fallback mode.');
  } else {
    logger.info('✅ GOOGLE_API_KEY / GEMINI_API_KEY verified.');
  }
}

async function bootstrap() {
  await performStartupCheck();

  const server = app.listen(env.PORT, () => {
    logger.info(`===================================================`);
    logger.info(`🚀 Memory Agent API (Agent 3) running on port ${env.PORT}`);
    logger.info(`📚 Swagger Documentation: http://localhost:${env.PORT}/docs`);
    logger.info(`💾 Database Provider: ${env.DATABASE_PROVIDER}`);
    logger.info(`===================================================`);
  });

  // Run database migrations/schema check asynchronously without blocking port listening
  runMigrations().catch((err) => {
    logger.warn('Non-blocking schema verification warning:', err?.message || err);
  });
}

bootstrap().catch((err) => {
  logger.error('Fatal bootstrapping error:', err);
  process.exit(1);
});
