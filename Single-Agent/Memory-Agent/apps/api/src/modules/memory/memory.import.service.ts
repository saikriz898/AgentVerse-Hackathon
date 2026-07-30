import { db } from '../../config/db.js';
import { memoryEntries } from '../../db/schema/index.js';
import { memoryEvents, MemoryEvent } from '../../utils/events.js';

export class MemoryImportService {
  async importMemories(workspaceId: string, items: Array<{ title: string; content: string; type?: string; importance?: number; pinned?: boolean }>): Promise<{ importedCount: number }> {
    let count = 0;

    for (const item of items) {
      const id = crypto.randomUUID();
      const newEntry = {
        id,
        workspaceId,
        title: item.title,
        content: item.content,
        type: item.type || 'long_term',
        importance: item.importance ?? 0.5,
        pinned: item.pinned ?? false,
      };

      await db.insert(memoryEntries).values(newEntry);
      memoryEvents.emitMemoryEvent(MemoryEvent.CREATED, newEntry);
      count++;
    }

    return { importedCount: count };
  }
}

export const memoryImportService = new MemoryImportService();
