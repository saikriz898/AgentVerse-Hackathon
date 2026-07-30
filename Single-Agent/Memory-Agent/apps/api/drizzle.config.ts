import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const isSqlite = (process.env.DATABASE_PROVIDER || 'sqlite') === 'sqlite';

export default defineConfig({
  schema: isSqlite ? './src/db/schema/sqlite/schema.ts' : './src/db/schema/postgres/schema.ts',
  out: './src/db/migrations',
  dialect: isSqlite ? 'sqlite' : 'postgresql',
  dbCredentials: isSqlite
    ? { url: process.env.DATABASE_URL || 'sqlite.db' }
    : { url: process.env.DATABASE_URL || '' },
});
