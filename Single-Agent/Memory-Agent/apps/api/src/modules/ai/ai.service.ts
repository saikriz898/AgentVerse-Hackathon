import { AIProviderFactory } from '../../config/ai-provider.factory.js';
import { classifyMemoryContent, ClassificationResult } from '../../engines/classification.engine.js';
import { extractKnowledgeMetadata, ExtractedKnowledge } from '../../engines/extraction.engine.js';
import { generateWorkspaceInsights, MemoryInsight } from '../../engines/insight.engine.js';
import { db } from '../../config/db.js';
import { memoryEntries } from '../../db/schema/index.js';
import { eq, and, isNull } from 'drizzle-orm';

export class AIService {
  private provider = AIProviderFactory.getProvider();

  async classifyText(content: string, title = ''): Promise<ClassificationResult> {
    return classifyMemoryContent(content, title);
  }

  async extractEntities(content: string): Promise<ExtractedKnowledge> {
    return extractKnowledgeMetadata(content);
  }

  async getWorkspaceInsights(workspaceId: string): Promise<MemoryInsight> {
    const memories = await db
      .select({ type: memoryEntries.type, title: memoryEntries.title })
      .from(memoryEntries)
      .where(and(eq(memoryEntries.workspaceId, workspaceId), isNull(memoryEntries.deletedAt)));

    return generateWorkspaceInsights(memories);
  }

  async generateTextResponse(prompt: string): Promise<string> {
    const res = await this.provider.generateText(prompt);
    return res.text;
  }
}

export const aiService = new AIService();
