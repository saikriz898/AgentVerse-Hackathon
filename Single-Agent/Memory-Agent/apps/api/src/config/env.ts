import dotenv from 'dotenv';
import { z } from 'zod';

import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  WEB_PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.string().default('info'),
  DATABASE_PROVIDER: z.enum(['sqlite', 'postgres']).default('sqlite'),
  DATABASE_URL: z.string().default('sqlite.db'),
  SQLITE_DB_PATH: z.string().default('sqlite.db'),
  JWT_SECRET: z.string().min(16).default('super-secret-antigravity-key-32-chars-long-x891'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  GOOGLE_API_KEY: z.string().optional().default(''),
  GEMINI_API_KEY: z.string().optional().default(''),
  ENCRYPTION_KEY: z.string().optional().default(''),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  IMAGEKIT_PRIVATE_KEY: z.string().optional().default(''),
  RESEND_API_KEY: z.string().optional().default(''),
  SENTRY_DSN: z.string().optional().default(''),
  VECTOR_PROVIDER: z.enum(['pgvector', 'sqlite_in_app']).default('sqlite_in_app'),
  UPLOAD_PATH: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.coerce.number().default(10485760),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export const env = envSchema.parse(process.env);

export function getApiKey(): string {
  return env.GOOGLE_API_KEY || env.GEMINI_API_KEY || '';
}
