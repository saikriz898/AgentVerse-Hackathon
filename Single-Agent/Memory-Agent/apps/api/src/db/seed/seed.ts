import bcrypt from 'bcryptjs';
import { runMigrations } from '../migrate.js';
import { db } from '../../config/db.js';
import { users, workspaces, memoryEntries, tags, memoryTags, embeddings } from '../schema/index.js';
import { logger } from '../../utils/logger.js';
import { generateEmbedding } from '../../engines/embedding.engine.js';

export async function seedDatabase() {
  logger.info('Starting database seed...');
  await runMigrations();

  const passwordHash = await bcrypt.hash('AdminPass123!', 10);
  const userId = crypto.randomUUID();
  const workspaceId = crypto.randomUUID();

  // Create default admin user
  await db.insert(users).values({
    id: userId,
    email: 'admin@antigravity.ai',
    passwordHash,
    fullName: 'Antigravity Admin',
    role: 'owner',
  }).onConflictDoNothing();

  // Create default workspace
  await db.insert(workspaces).values({
    id: workspaceId,
    name: 'Antigravity Core Workspace',
    slug: 'antigravity-core',
    ownerId: userId,
  }).onConflictDoNothing();

  // Create default tag
  const tagId = crypto.randomUUID();
  await db.insert(tags).values({
    id: tagId,
    workspaceId,
    name: 'core-architecture',
    color: '#6366f1',
  }).onConflictDoNothing();

  // Create sample memory entries across types
  const sampleMemories = [
    {
      id: crypto.randomUUID(),
      workspaceId,
      title: 'Agent 3 Memory Architecture Guidelines',
      content: 'Memory Agent stores long-term, short-term, semantic, project, and session memories using hybrid Reciprocal Rank Fusion search.',
      type: 'long_term',
      importance: 0.9,
      pinned: true,
    },
    {
      id: crypto.randomUUID(),
      workspaceId,
      title: 'Active Session Working Context',
      content: 'Currently indexing multi-agent capabilities, standardizing API response structures, and maintaining backward compatibility.',
      type: 'working',
      importance: 0.75,
      pinned: false,
    },
    {
      id: crypto.randomUUID(),
      workspaceId,
      title: 'Gemini text-embedding-004 Configuration',
      content: 'All memory embeddings are generated with 768 dimensions using Gemini API text-embedding-004 model.',
      type: 'semantic',
      importance: 0.85,
      pinned: false,
    },
  ];

  for (const entry of sampleMemories) {
    await db.insert(memoryEntries).values(entry).onConflictDoNothing();

    // Map tag
    await db.insert(memoryTags).values({
      id: crypto.randomUUID(),
      memoryId: entry.id,
      tagId,
    }).onConflictDoNothing();

    // Generate vector embedding
    const vector = await generateEmbedding(entry.content);
    await db.insert(embeddings).values({
      id: crypto.randomUUID(),
      memoryId: entry.id,
      vectorJson: JSON.stringify(vector),
      dimensions: vector.length,
      model: 'text-embedding-004',
    }).onConflictDoNothing();
  }

  logger.info('Database seeded successfully!');
}

const isDirectRun = process.argv[1] && (process.argv[1].endsWith('seed.ts') || process.argv[1].endsWith('seed.js'));
if (isDirectRun) {
  seedDatabase().then(() => process.exit(0));
}
