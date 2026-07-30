import { db } from '../../config/db.js';
import { memoryVersions } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';

export class VersionService {
  async getVersionsForMemory(memoryId: string) {
    return db.select().from(memoryVersions).where(eq(memoryVersions.memoryId, memoryId));
  }
}

export const versionService = new VersionService();
