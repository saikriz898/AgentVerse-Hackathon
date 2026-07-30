import { db } from '../../config/db.js';
import { memoryEntries } from '../../db/schema/index.js';
import { eq, and, isNull } from 'drizzle-orm';

export class MemoryExportService {
  async exportWorkspaceMemories(workspaceId: string, format: 'json' | 'markdown' | 'csv' = 'json'): Promise<{ data: string; contentType: string }> {
    const memories = await db
      .select()
      .from(memoryEntries)
      .where(and(eq(memoryEntries.workspaceId, workspaceId), isNull(memoryEntries.deletedAt)));

    if (format === 'json') {
      return {
        data: JSON.stringify(memories, null, 2),
        contentType: 'application/json',
      };
    }

    if (format === 'markdown') {
      const md = memories
        .map(
          (m: { title: any; type: any; importance: any; pinned: any; createdAt: any; content: any; }) =>
            `# ${m.title}\n**Type**: ${m.type} | **Importance**: ${m.importance} | **Pinned**: ${m.pinned}\n**Created**: ${m.createdAt}\n\n${m.content}\n\n---`
        )
        .join('\n\n');
      return {
        data: md,
        contentType: 'text/markdown',
      };
    }

    // CSV format
    const headers = 'ID,Title,Type,Importance,Pinned,CreatedAt\n';
    const rows = memories
      .map((m: { id: any; title: string; type: any; importance: any; pinned: any; createdAt: any; }) => `"${m.id}","${m.title.replace(/"/g, '""')}","${m.type}",${m.importance},${m.pinned},"${m.createdAt}"`)
      .join('\n');

    return {
      data: headers + rows,
      contentType: 'text/csv',
    };
  }
}

export const memoryExportService = new MemoryExportService();
