import { db } from '../../config/db.js';
import { tags, memoryTags } from '../../db/schema/index.js';
import { eq, and, isNull } from 'drizzle-orm';

export class TagService {
  async createTag(workspaceId: string, name: string, color = '#6366f1') {
    const id = crypto.randomUUID();
    const record = { id, workspaceId, name, color };
    await db.insert(tags).values(record);
    return record;
  }

  async listTags(workspaceId: string) {
    return db.select().from(tags).where(and(eq(tags.workspaceId, workspaceId), isNull(tags.deletedAt)));
  }

  async attachTagToMemory(memoryId: string, tagId: string) {
    const id = crypto.randomUUID();
    const record = { id, memoryId, tagId };
    await db.insert(memoryTags).values(record);
    return record;
  }
}

export const tagService = new TagService();
