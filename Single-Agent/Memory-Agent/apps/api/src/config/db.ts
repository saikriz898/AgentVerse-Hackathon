import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { createClient } from '@libsql/client';
import { env } from './env.js';
import * as sqliteSchema from '../db/schema/sqlite/schema.js';
import * as postgresSchema from '../db/schema/postgres/schema.js';

let dbInstance: any;

export function getDb() {
  if (dbInstance) return dbInstance;

  if (env.DATABASE_PROVIDER === 'postgres') {
    const sql = neon(env.DATABASE_URL);
    dbInstance = drizzleNeon(sql, { schema: postgresSchema });
  } else {
    const client = createClient({
      url: env.DATABASE_URL.startsWith('file:') ? env.DATABASE_URL : `file:${env.DATABASE_URL}`,
    });
    dbInstance = drizzleLibsql(client, { schema: sqliteSchema });
  }

  return dbInstance;
}

export const db = getDb();
