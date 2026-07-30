import { db } from '../../config/db.js';
import { uploadedFiles } from '../../db/schema/index.js';
import { eq, and, isNull } from 'drizzle-orm';

export class FileService {
  async recordFile(workspaceId: string, filename: string, path: string, size: number, mimeType: string) {
    const id = crypto.randomUUID();
    const record = { id, workspaceId, filename, path, size, mimeType };
    await db.insert(uploadedFiles).values(record);
    return record;
  }

  async listFiles(workspaceId: string) {
    return db.select().from(uploadedFiles).where(and(eq(uploadedFiles.workspaceId, workspaceId), isNull(uploadedFiles.deletedAt)));
  }
}

export const fileService = new FileService();
