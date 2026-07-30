import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const timestamps = {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  deletedAt: text('deleted_at'),
};

export const users = sqliteTable('users', {
  ...timestamps,
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  role: text('role').notNull().default('member'),
});

export const workspaces = sqliteTable('workspaces', {
  ...timestamps,
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: text('owner_id').notNull().references(() => users.id),
});

export const workspaceMembers = sqliteTable('workspace_members', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  userId: text('user_id').notNull().references(() => users.id),
  role: text('role').notNull().default('member'),
});

export const sessions = sqliteTable('sessions', {
  ...timestamps,
  userId: text('user_id').notNull().references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
});

export const preferences = sqliteTable('preferences', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  key: text('key').notNull(),
  value: text('value').notNull(),
});

export const conversations = sqliteTable('conversations', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  title: text('title').notNull(),
  summary: text('summary'),
});

export const conversationMessages = sqliteTable('conversation_messages', {
  ...timestamps,
  conversationId: text('conversation_id').notNull().references(() => conversations.id),
  role: text('role').notNull(),
  content: text('content').notNull(),
  tokens: integer('tokens').default(0),
});

export const projects = sqliteTable('projects', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  name: text('name').notNull(),
  description: text('description'),
});

export const projectMemory = sqliteTable('project_memory', {
  ...timestamps,
  projectId: text('project_id').notNull().references(() => projects.id),
  memoryId: text('memory_id').notNull(),
});

export const knowledge = sqliteTable('knowledge', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').default('general'),
});

export const documents = sqliteTable('documents', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  mimeType: text('mime_type').default('text/plain'),
});

export const uploadedFiles = sqliteTable('uploaded_files', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  filename: text('filename').notNull(),
  path: text('path').notNull(),
  size: integer('size').notNull(),
  mimeType: text('mime_type').notNull(),
});

export const memoryEntries = sqliteTable('memory_entries', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: text('type').notNull(),
  importance: real('importance').notNull().default(0.5),
  pinned: integer('pinned', { mode: 'boolean' }).notNull().default(false),
  ttlSeconds: integer('ttl_seconds'),
  expiresAt: text('expires_at'),
  metadataJson: text('metadata_json').default('{}'),
});

export const memoryVersions = sqliteTable('memory_versions', {
  ...timestamps,
  memoryId: text('memory_id').notNull().references(() => memoryEntries.id),
  version: integer('version').notNull(),
  content: text('content').notNull(),
  title: text('title').notNull(),
  modifiedBy: text('modified_by').notNull(),
});

export const embeddings = sqliteTable('embeddings', {
  ...timestamps,
  memoryId: text('memory_id').notNull().references(() => memoryEntries.id),
  vectorJson: text('vector_json').notNull(),
  dimensions: integer('dimensions').notNull().default(768),
  model: text('model').notNull().default('text-embedding-004'),
});

export const tags = sqliteTable('tags', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  name: text('name').notNull(),
  color: text('color').default('#6366f1'),
});

export const memoryTags = sqliteTable('memory_tags', {
  ...timestamps,
  memoryId: text('memory_id').notNull().references(() => memoryEntries.id),
  tagId: text('tag_id').notNull().references(() => tags.id),
});

export const relationships = sqliteTable('relationships', {
  ...timestamps,
  sourceId: text('source_id').notNull().references(() => memoryEntries.id),
  targetId: text('target_id').notNull().references(() => memoryEntries.id),
  relationType: text('relation_type').notNull(),
  weight: real('weight').default(1.0),
});

export const agentLogs = sqliteTable('agent_logs', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  agentId: text('agent_id').notNull(),
  action: text('action').notNull(),
  details: text('details'),
});

export const auditLogs = sqliteTable('audit_logs', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  changesJson: text('changes_json').default('{}'),
});

export const notifications = sqliteTable('notifications', {
  ...timestamps,
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
});

export const searchIndex = sqliteTable('search_index', {
  ...timestamps,
  memoryId: text('memory_id').notNull().references(() => memoryEntries.id),
  tokens: text('tokens').notNull(),
});

export const cache = sqliteTable('cache', {
  ...timestamps,
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  expiresAt: text('expires_at'),
});
