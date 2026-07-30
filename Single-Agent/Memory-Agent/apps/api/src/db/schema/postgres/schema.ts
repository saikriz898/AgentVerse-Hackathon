import { pgTable, uuid, text, timestamp, integer, doublePrecision, boolean, jsonb, vector } from 'drizzle-orm/pg-core';

const timestamps = {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
};

export const users = pgTable('users', {
  ...timestamps,
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  role: text('role').notNull().default('member'),
});

export const workspaces = pgTable('workspaces', {
  ...timestamps,
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: uuid('owner_id').notNull().references(() => users.id),
});

export const workspaceMembers = pgTable('workspace_members', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  role: text('role').notNull().default('member'),
});

export const sessions = pgTable('sessions', {
  ...timestamps,
  userId: uuid('user_id').notNull().references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const preferences = pgTable('preferences', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  key: text('key').notNull(),
  value: text('value').notNull(),
});

export const conversations = pgTable('conversations', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  title: text('title').notNull(),
  summary: text('summary'),
});

export const conversationMessages = pgTable('conversation_messages', {
  ...timestamps,
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id),
  role: text('role').notNull(),
  content: text('content').notNull(),
  tokens: integer('tokens').default(0),
});

export const projects = pgTable('projects', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  name: text('name').notNull(),
  description: text('description'),
});

export const projectMemory = pgTable('project_memory', {
  ...timestamps,
  projectId: uuid('project_id').notNull().references(() => projects.id),
  memoryId: uuid('memory_id').notNull(),
});

export const knowledge = pgTable('knowledge', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').default('general'),
});

export const documents = pgTable('documents', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  mimeType: text('mime_type').default('text/plain'),
});

export const uploadedFiles = pgTable('uploaded_files', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  filename: text('filename').notNull(),
  path: text('path').notNull(),
  size: integer('size').notNull(),
  mimeType: text('mime_type').notNull(),
});

export const memoryEntries = pgTable('memory_entries', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: text('type').notNull(),
  importance: doublePrecision('importance').notNull().default(0.5),
  pinned: boolean('pinned').notNull().default(false),
  ttlSeconds: integer('ttl_seconds'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  metadataJson: jsonb('metadata_json').default({}),
});

export const memoryVersions = pgTable('memory_versions', {
  ...timestamps,
  memoryId: uuid('memory_id').notNull().references(() => memoryEntries.id),
  version: integer('version').notNull(),
  content: text('content').notNull(),
  title: text('title').notNull(),
  modifiedBy: text('modified_by').notNull(),
});

export const embeddings = pgTable('embeddings', {
  ...timestamps,
  memoryId: uuid('memory_id').notNull().references(() => memoryEntries.id),
  embedding: vector('embedding', { dimensions: 768 }),
  vectorJson: text('vector_json').notNull(),
  dimensions: integer('dimensions').notNull().default(768),
  model: text('model').notNull().default('text-embedding-004'),
});

export const tags = pgTable('tags', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  name: text('name').notNull(),
  color: text('color').default('#6366f1'),
});

export const memoryTags = pgTable('memory_tags', {
  ...timestamps,
  memoryId: uuid('memory_id').notNull().references(() => memoryEntries.id),
  tagId: uuid('tag_id').notNull().references(() => tags.id),
});

export const relationships = pgTable('relationships', {
  ...timestamps,
  sourceId: uuid('source_id').notNull().references(() => memoryEntries.id),
  targetId: uuid('target_id').notNull().references(() => memoryEntries.id),
  relationType: text('relation_type').notNull(),
  weight: doublePrecision('weight').default(1.0),
});

export const agentLogs = pgTable('agent_logs', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  agentId: text('agent_id').notNull(),
  action: text('action').notNull(),
  details: text('details'),
});

export const auditLogs = pgTable('audit_logs', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  changesJson: jsonb('changes_json').default({}),
});

export const notifications = pgTable('notifications', {
  ...timestamps,
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
});

export const searchIndex = pgTable('search_index', {
  ...timestamps,
  memoryId: uuid('memory_id').notNull().references(() => memoryEntries.id),
  tokens: text('tokens').notNull(),
});

export const cache = pgTable('cache', {
  ...timestamps,
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
});
