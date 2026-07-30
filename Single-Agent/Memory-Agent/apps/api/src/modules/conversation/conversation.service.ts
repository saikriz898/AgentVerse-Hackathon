import { db } from '../../config/db.js';
import { conversations, conversationMessages } from '../../db/schema/index.js';
import { eq, and, isNull } from 'drizzle-orm';
import { summarizeConversation } from '../../engines/summarization.engine.js';
import { memoryService } from '../memory/memory.service.js';

export class ConversationService {
  async createConversation(workspaceId: string, title: string) {
    const id = crypto.randomUUID();
    const record = { id, workspaceId, title, summary: null };
    await db.insert(conversations).values(record);
    return record;
  }

  async listConversations(workspaceId: string) {
    return db.select().from(conversations).where(and(eq(conversations.workspaceId, workspaceId), isNull(conversations.deletedAt)));
  }

  async addMessage(conversationId: string, role: string, content: string) {
    const id = crypto.randomUUID();
    const tokens = Math.ceil(content.length / 4);
    const msg = { id, conversationId, role, content, tokens };
    await db.insert(conversationMessages).values(msg);
    return msg;
  }

  async archiveToMemory(workspaceId: string, conversationId: string) {
    const msgs = await db.select().from(conversationMessages).where(eq(conversationMessages.conversationId, conversationId));
    const { title, summary } = await summarizeConversation(msgs);

    const memory = await memoryService.createMemory(workspaceId, {
      title: `Conversation: ${title}`,
      content: summary,
      type: 'conversation',
      importance: 0.7,
      pinned: false,
    });

    await db.update(conversations).set({ summary }).where(eq(conversations.id, conversationId));
    return memory;
  }
}

export const conversationService = new ConversationService();
