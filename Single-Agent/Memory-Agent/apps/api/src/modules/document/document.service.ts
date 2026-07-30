import { db } from '../../config/db.js';
import { documents } from '../../db/schema/index.js';
import { eq, and, isNull } from 'drizzle-orm';
import { memoryService } from '../memory/memory.service.js';

export class DocumentService {
  async createDocument(workspaceId: string, title: string, content: string, mimeType = 'text/plain') {
    const id = crypto.randomUUID();
    const record = { id, workspaceId, title, content, mimeType };
    await db.insert(documents).values(record);

    await memoryService.createMemory(workspaceId, {
      title: `Document: ${title}`,
      content,
      type: 'long_term',
      importance: 0.8,
      pinned: false,
    });

    return record;
  }

  async listDocuments(workspaceId: string) {
    return db.select().from(documents).where(and(eq(documents.workspaceId, workspaceId), isNull(documents.deletedAt)));
  }
}

export const documentService = new DocumentService();
