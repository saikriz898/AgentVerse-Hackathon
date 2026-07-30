import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { createClient } from '@libsql/client';
import { neon } from '@neondatabase/serverless';

export async function runMigrations() {
  logger.info(`Checking database schema initialization for provider: ${env.DATABASE_PROVIDER}...`);

  if (env.DATABASE_PROVIDER === 'postgres') {
    logger.info('Connecting to Neon PostgreSQL via HTTPS serverless driver...');
    const sql = neon(env.DATABASE_URL);

    try {
      // 1. Enable pgvector extension
      await sql('CREATE EXTENSION IF NOT EXISTS vector;');
      logger.info('pgvector extension enabled / verified.');

      // 2. Create PostgreSQL 21-table schema
      await sql(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          full_name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'member'
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS workspaces (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          owner_id UUID NOT NULL REFERENCES users(id)
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          user_id UUID NOT NULL REFERENCES users(id),
          token TEXT NOT NULL UNIQUE,
          expires_at TIMESTAMPTZ NOT NULL
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS preferences (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          workspace_id UUID NOT NULL REFERENCES workspaces(id),
          key TEXT NOT NULL,
          value TEXT NOT NULL
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS conversations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          workspace_id UUID NOT NULL REFERENCES workspaces(id),
          title TEXT NOT NULL,
          summary TEXT
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS conversation_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          conversation_id UUID NOT NULL REFERENCES conversations(id),
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          tokens INTEGER DEFAULT 0
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS projects (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          workspace_id UUID NOT NULL REFERENCES workspaces(id),
          name TEXT NOT NULL,
          description TEXT
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS project_memory (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          project_id UUID NOT NULL REFERENCES projects(id),
          memory_id UUID NOT NULL
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS knowledge (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          workspace_id UUID NOT NULL REFERENCES workspaces(id),
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT DEFAULT 'general'
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS documents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          workspace_id UUID NOT NULL REFERENCES workspaces(id),
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          mime_type TEXT DEFAULT 'text/plain'
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS uploaded_files (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          workspace_id UUID NOT NULL REFERENCES workspaces(id),
          filename TEXT NOT NULL,
          path TEXT NOT NULL,
          size INTEGER NOT NULL,
          mime_type TEXT NOT NULL
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS memory_entries (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          workspace_id UUID NOT NULL REFERENCES workspaces(id),
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          type TEXT NOT NULL,
          importance DOUBLE PRECISION NOT NULL DEFAULT 0.5,
          pinned BOOLEAN NOT NULL DEFAULT FALSE,
          ttl_seconds INTEGER,
          expires_at TIMESTAMPTZ,
          metadata_json JSONB DEFAULT '{}'::jsonb
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS memory_versions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          memory_id UUID NOT NULL REFERENCES memory_entries(id),
          version INTEGER NOT NULL,
          content TEXT NOT NULL,
          title TEXT NOT NULL,
          modified_by TEXT NOT NULL
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS embeddings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          memory_id UUID NOT NULL REFERENCES memory_entries(id),
          embedding vector(768),
          vector_json TEXT NOT NULL,
          dimensions INTEGER NOT NULL DEFAULT 768,
          model TEXT NOT NULL DEFAULT 'text-embedding-004'
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS tags (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          workspace_id UUID NOT NULL REFERENCES workspaces(id),
          name TEXT NOT NULL,
          color TEXT DEFAULT '#6366f1'
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS memory_tags (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          memory_id UUID NOT NULL REFERENCES memory_entries(id),
          tag_id UUID NOT NULL REFERENCES tags(id)
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS relationships (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          source_id UUID NOT NULL REFERENCES memory_entries(id),
          target_id UUID NOT NULL REFERENCES memory_entries(id),
          relation_type TEXT NOT NULL,
          weight DOUBLE PRECISION DEFAULT 1.0
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS agent_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          workspace_id UUID NOT NULL REFERENCES workspaces(id),
          agent_id TEXT NOT NULL,
          action TEXT NOT NULL,
          details TEXT
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          workspace_id UUID NOT NULL REFERENCES workspaces(id),
          user_id UUID REFERENCES users(id),
          action TEXT NOT NULL,
          entity_type TEXT NOT NULL,
          entity_id TEXT NOT NULL,
          changes_json JSONB DEFAULT '{}'::jsonb
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS search_index (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          memory_id UUID NOT NULL REFERENCES memory_entries(id),
          tokens TEXT NOT NULL
        );
      `);

      await sql(`
        CREATE TABLE IF NOT EXISTS cache (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          deleted_at TIMESTAMPTZ,
          key TEXT NOT NULL UNIQUE,
          value TEXT NOT NULL,
          expires_at TIMESTAMPTZ
        );
      `);

      logger.info('PostgreSQL (Neon) 21-table schema initialized successfully over HTTPS.');
    } catch (err: any) {
      logger.warn(`⚠️ PostgreSQL migration notice: Could not connect to remote Neon database (${err.message || 'Connection Timeout'}). Server will continue operating with offline fallback memory engine.`);
    }
  } else if (env.DATABASE_PROVIDER === 'sqlite') {
    const client = createClient({
      url: env.DATABASE_URL.startsWith('file:') ? env.DATABASE_URL : `file:${env.DATABASE_URL}`,
    });

    await client.executeMultiple(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member'
      );

      CREATE TABLE IF NOT EXISTS workspaces (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        owner_id TEXT NOT NULL REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        user_id TEXT NOT NULL REFERENCES users(id),
        token TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS preferences (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        workspace_id TEXT NOT NULL REFERENCES workspaces(id),
        key TEXT NOT NULL,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        workspace_id TEXT NOT NULL REFERENCES workspaces(id),
        title TEXT NOT NULL,
        summary TEXT
      );

      CREATE TABLE IF NOT EXISTS conversation_messages (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        conversation_id TEXT NOT NULL REFERENCES conversations(id),
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        tokens INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        workspace_id TEXT NOT NULL REFERENCES workspaces(id),
        name TEXT NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS project_memory (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        project_id TEXT NOT NULL REFERENCES projects(id),
        memory_id TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS knowledge (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        workspace_id TEXT NOT NULL REFERENCES workspaces(id),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'general'
      );

      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        workspace_id TEXT NOT NULL REFERENCES workspaces(id),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        mime_type TEXT DEFAULT 'text/plain'
      );

      CREATE TABLE IF NOT EXISTS uploaded_files (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        workspace_id TEXT NOT NULL REFERENCES workspaces(id),
        filename TEXT NOT NULL,
        path TEXT NOT NULL,
        size INTEGER NOT NULL,
        mime_type TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS memory_entries (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        workspace_id TEXT NOT NULL REFERENCES workspaces(id),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        importance REAL NOT NULL DEFAULT 0.5,
        pinned INTEGER NOT NULL DEFAULT 0,
        ttl_seconds INTEGER,
        expires_at TEXT,
        metadata_json TEXT DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS memory_versions (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        memory_id TEXT NOT NULL REFERENCES memory_entries(id),
        version INTEGER NOT NULL,
        content TEXT NOT NULL,
        title TEXT NOT NULL,
        modified_by TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS embeddings (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        memory_id TEXT NOT NULL REFERENCES memory_entries(id),
        vector_json TEXT NOT NULL,
        dimensions INTEGER NOT NULL DEFAULT 768,
        model TEXT NOT NULL DEFAULT 'text-embedding-004'
      );

      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        workspace_id TEXT NOT NULL REFERENCES workspaces(id),
        name TEXT NOT NULL,
        color TEXT DEFAULT '#6366f1'
      );

      CREATE TABLE IF NOT EXISTS memory_tags (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        memory_id TEXT NOT NULL REFERENCES memory_entries(id),
        tag_id TEXT NOT NULL REFERENCES tags(id)
      );

      CREATE TABLE IF NOT EXISTS relationships (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        source_id TEXT NOT NULL REFERENCES memory_entries(id),
        target_id TEXT NOT NULL REFERENCES memory_entries(id),
        relation_type TEXT NOT NULL,
        weight REAL DEFAULT 1.0
      );

      CREATE TABLE IF NOT EXISTS agent_logs (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        workspace_id TEXT NOT NULL REFERENCES workspaces(id),
        agent_id TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        workspace_id TEXT NOT NULL REFERENCES workspaces(id),
        user_id TEXT REFERENCES users(id),
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        changes_json TEXT DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS search_index (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        memory_id TEXT NOT NULL REFERENCES memory_entries(id),
        tokens TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS cache (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TEXT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        expires_at TEXT
      );
    `);
    logger.info('SQLite schema initialized successfully.');
  }
}

const isDirectRun = process.argv[1] && (process.argv[1].endsWith('migrate.ts') || process.argv[1].endsWith('migrate.js'));
if (isDirectRun) {
  runMigrations().then(() => process.exit(0));
}
