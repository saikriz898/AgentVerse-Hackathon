import { db } from '../../config/db.js';
import { knowledge, workspaces } from '../../db/schema/index.js';
import { eq, and, isNull, like, or, ilike } from 'drizzle-orm';
import { memoryService } from '../memory/memory.service.js';

export class KnowledgeService {
  private async resolveWorkspaceId(workspaceId?: string): Promise<string> {
    const isValidUuid = (id?: string) => Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
    if (isValidUuid(workspaceId)) {
      return workspaceId!;
    }
    const defaultWs = await db.select({ id: workspaces.id }).from(workspaces).limit(1);
    if (defaultWs[0]?.id && isValidUuid(defaultWs[0].id)) {
      return defaultWs[0].id;
    }
    return '00000000-0000-0000-0000-000000000000';
  }

  async createKnowledge(workspaceId: string, title: string, content: string, category = 'Architecture') {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    const id = crypto.randomUUID();
    const record = { id, workspaceId: wsId, title, content, category };
    await db.insert(knowledge).values(record);

    try {
      await memoryService.createMemory(wsId, {
        title: `Knowledge Base: ${title}`,
        content: `[Category: ${category}]\n${content}`,
        type: 'knowledge',
        importance: 0.9,
        pinned: false,
        metadataJson: JSON.stringify({ category, knowledgeId: id }),
      });
    } catch (e) {
      console.error('Failed to sync knowledge item to memory entries:', e);
    }

    return record;
  }

  async listKnowledge(workspaceId: string, search?: string, category?: string, id?: string) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    const conditions: any[] = [isNull(knowledge.deletedAt)];

    if (id) {
      conditions.push(eq(knowledge.id, id));
    } else {
      conditions.push(or(eq(knowledge.workspaceId, wsId), isNull(knowledge.workspaceId)));
    }

    if (category && category !== 'all') {
      conditions.push(ilike(knowledge.category, category));
    }

    if (search && search.trim()) {
      const pattern = `%${search.trim()}%`;
      conditions.push(or(like(knowledge.title, pattern), like(knowledge.content, pattern)));
    }

    return db.select().from(knowledge).where(and(...conditions));
  }

  async getKnowledgeById(workspaceId: string, id: string) {
    const items = await db
      .select()
      .from(knowledge)
      .where(and(eq(knowledge.id, id), isNull(knowledge.deletedAt)));
    return items[0] || null;
  }

  async updateKnowledge(workspaceId: string, id: string, data: { title?: string; content?: string; category?: string }) {
    await db
      .update(knowledge)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(knowledge.id, id));

    const updated = await this.getKnowledgeById(workspaceId, id);

    try {
      const { data: memories } = await memoryService.listMemories(workspaceId, 1, 200);
      const match: any = memories.find((m: any) => {
        try {
          const meta = JSON.parse(m.metadataJson || '{}');
          return meta.knowledgeId === id;
        } catch {
          return m.title === `Knowledge Base: ${data.title}` || m.type === 'knowledge';
        }
      });
      if (match) {
        await memoryService.updateMemory(
          workspaceId,
          match.id,
          {
            title: data.title ? `Knowledge Base: ${data.title}` : match.title,
            content: data.content ? `[Category: ${data.category || 'Architecture'}]\n${data.content}` : match.content,
          },
          'system'
        );
      } else if (updated) {
        await memoryService.createMemory(workspaceId, {
          title: `Knowledge Base: ${updated.title}`,
          content: `[Category: ${updated.category || 'Architecture'}]\n${updated.content}`,
          type: 'knowledge',
          importance: 0.9,
          pinned: false,
          metadataJson: JSON.stringify({ category: updated.category, knowledgeId: id }),
        });
      }
    } catch (e) {
      console.error('Failed to sync knowledge update to memory:', e);
    }

    return updated;
  }

  async deleteKnowledge(workspaceId: string, id: string) {
    const existing = await this.getKnowledgeById(workspaceId, id);
    await db
      .delete(knowledge)
      .where(eq(knowledge.id, id));

    try {
      if (existing) {
        const { data: memories } = await memoryService.listMemories(workspaceId, 1, 200);
        const match: any = memories.find((m: any) => {
          try {
            const meta = JSON.parse(m.metadataJson || '{}');
            return meta.knowledgeId === id;
          } catch {
            return m.title === `Knowledge Base: ${existing.title}`;
          }
        });
        if (match) {
          await memoryService.deleteMemory(workspaceId, match.id);
        }
      }
    } catch (e) {
      console.error('Failed to delete synced knowledge memory:', e);
    }

    return { success: true, id };
  }
}

export const knowledgeService = new KnowledgeService();


