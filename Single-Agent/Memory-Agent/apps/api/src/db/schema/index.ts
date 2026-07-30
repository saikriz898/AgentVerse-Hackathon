import { env } from '../../config/env.js';
import * as sqliteSchema from './sqlite/schema.js';
import * as postgresSchema from './postgres/schema.js';

export const schema = env.DATABASE_PROVIDER === 'sqlite' ? sqliteSchema : postgresSchema;

export * from './sqlite/schema.js';
