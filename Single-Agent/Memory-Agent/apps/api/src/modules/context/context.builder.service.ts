import { db } from '../../config/db.js';
import { memoryEntries, embeddings } from '../../db/schema/index.js';
import { eq, and, isNull } from 'drizzle-orm';
import { generateEmbedding } from '../../engines/embedding.engine.js';
import { computeContextScores, ScoredMemory } from '../../engines/ranking.engine.js';
import { compressText } from '../../engines/compression.engine.js';

export interface ContextBuildOptions {
  query: string;
  maxTokens?: number; // default 2000 tokens (~8000 chars)
  includePinned?: boolean;
}

export class ContextBuilderService {
  async buildContextPackage(workspaceId: string, options: ContextBuildOptions) {
    const maxChars = (options.maxTokens || 2000) * 4;
    const queryVector = await generateEmbedding(options.query);

    // 1. Fetch memory items and vectors for workspace
    const rows = await db
      .select({
        id: memoryEntries.id,
        title: memoryEntries.title,
        content: memoryEntries.content,
        type: memoryEntries.type,
        importance: memoryEntries.importance,
        pinned: memoryEntries.pinned,
        createdAt: memoryEntries.createdAt,
        vectorJson: embeddings.vectorJson,
      })
      .from(memoryEntries)
      .leftJoin(embeddings, eq(embeddings.memoryId, memoryEntries.id))
      .where(
        and(
          eq(memoryEntries.workspaceId, workspaceId),
          isNull(memoryEntries.deletedAt)
        )
      );

    const itemVectorsMap = new Map<string, number[]>();
    const candidates: ScoredMemory[] = rows.map((r: any) => {
      if (r.vectorJson) {
        try {
          itemVectorsMap.set(r.id, JSON.parse(r.vectorJson));
        } catch (e) {
          // ignore parsing error
        }
      }
      return {
        id: r.id,
        title: r.title,
        content: r.content,
        type: r.type,
        importance: r.importance,
        pinned: Boolean(r.pinned),
        createdAt: String(r.createdAt),
      };
    });

    // 2. Score candidates: Recency * Importance * Relevance + Pinned Priority
    const scored = computeContextScores(candidates, queryVector, itemVectorsMap);

    // 3. Merge & Truncate pipeline
    const pinnedItems = scored.filter((item) => item.pinned);
    const nonPinnedItems = scored.filter((item) => !item.pinned);

    let currentLength = 0;
    const selectedMemories: ScoredMemory[] = [];

    // Pinned items are NEVER truncated out of the context window
    for (const pinned of pinnedItems) {
      selectedMemories.push(pinned);
      currentLength += pinned.content.length;
    }

    // Add highest scoring non-pinned memories up to maxChars
    for (const item of nonPinnedItems) {
      if (currentLength + item.content.length <= maxChars) {
        selectedMemories.push(item);
        currentLength += item.content.length;
      } else {
        // Compress last fitting memory if needed
        const remainingChars = maxChars - currentLength;
        if (remainingChars > 100) {
          const compressedContent = await compressText(item.content, Math.floor(remainingChars / 4));
          selectedMemories.push({
            ...item,
            content: compressedContent,
          });
          currentLength += compressedContent.length;
        }
        break;
      }
    }

    const contextText = selectedMemories
      .map((m) => `[MEMORY: ${m.type.toUpperCase()}] ${m.title}\n${m.content}`)
      .join('\n\n---\n\n');

    return {
      query: options.query,
      tokenCount: Math.ceil(contextText.length / 4),
      memoryCount: selectedMemories.length,
      contextText,
      items: selectedMemories,
    };
  }
}

export const contextBuilderService = new ContextBuilderService();
