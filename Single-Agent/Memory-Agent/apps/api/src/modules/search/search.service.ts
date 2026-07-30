import { db } from '../../config/db.js';
import { memoryEntries, embeddings, knowledge, projects } from '../../db/schema/index.js';
import { eq, and, isNull, like, or } from 'drizzle-orm';
import { generateEmbedding } from '../../engines/embedding.engine.js';
import { reciprocalRankFusion, ScoredMemory } from '../../engines/ranking.engine.js';
import { cosineSimilarity } from '../../utils/cosine.js';

export class SearchService {
  /**
   * Universal Global Search across Memory, Knowledge, and Projects
   */
  async globalSearch(workspaceId: string, query: string, moduleFilter = 'all', limit = 20) {
    const qLower = query.toLowerCase().trim();

    // 1. Search Memory Entries
    let memoryResults: any[] = [];
    if (moduleFilter === 'all' || moduleFilter === 'memory') {
      const mems = await db
        .select()
        .from(memoryEntries)
        .where(
          and(
            eq(memoryEntries.workspaceId, workspaceId),
            isNull(memoryEntries.deletedAt),
            qLower ? or(like(memoryEntries.title, `%${qLower}%`), like(memoryEntries.content, `%${qLower}%`)) : undefined
          )
        )
        .limit(limit);

      memoryResults = mems.map((m: any) => ({
        id: m.id,
        module: 'memory',
        title: m.title,
        content: m.content,
        type: m.type,
        score: 0.95,
        updatedAt: m.updatedAt || m.createdAt,
        workspace: 'Development Workspace',
      }));
    }

    // 2. Search Knowledge Base
    let knowledgeResults: any[] = [];
    if (moduleFilter === 'all' || moduleFilter === 'knowledge') {
      const kList = await db
        .select()
        .from(knowledge)
        .where(
          and(
            eq(knowledge.workspaceId, workspaceId),
            isNull(knowledge.deletedAt),
            qLower ? or(like(knowledge.title, `%${qLower}%`), like(knowledge.content, `%${qLower}%`)) : undefined
          )
        )
        .limit(limit);

      knowledgeResults = kList.map((k: any) => ({
        id: k.id,
        module: 'knowledge',
        title: k.title,
        content: k.content,
        category: k.category,
        score: 0.92,
        updatedAt: k.updatedAt || k.createdAt,
        workspace: 'Development Workspace',
      }));
    }

    // 3. Search Projects
    let projectResults: any[] = [];
    if (moduleFilter === 'all' || moduleFilter === 'project') {
      const pList = await db
        .select()
        .from(projects)
        .where(
          and(
            eq(projects.workspaceId, workspaceId),
            isNull(projects.deletedAt),
            qLower ? or(like(projects.name, `%${qLower}%`), like(projects.description, `%${qLower}%`)) : undefined
          )
        )
        .limit(limit);

      projectResults = pList.map((p: any, idx: number) => ({
        id: p.id,
        module: 'project',
        title: p.name,
        content: p.description || 'Enterprise project workspace for memory context partitions.',
        code: `PRJ-0${idx + 1}`,
        status: 'active',
        score: 0.88,
        updatedAt: p.updatedAt || p.createdAt,
        workspace: 'Development Workspace',
      }));
    }

    return {
      query,
      total: memoryResults.length + knowledgeResults.length + projectResults.length,
      results: [...memoryResults, ...knowledgeResults, ...projectResults],
      grouped: {
        memories: memoryResults,
        knowledge: knowledgeResults,
        projects: projectResults,
      },
    };
  }

  /**
   * Vector Similarity Search
   */
  async vectorSearch(workspaceId: string, query: string, limit = 10): Promise<ScoredMemory[]> {
    const queryVector = await generateEmbedding(query);

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

    const scored: ScoredMemory[] = rows.map((r: any) => {
      let sim = 0;
      if (r.vectorJson) {
        try {
          const vector = JSON.parse(r.vectorJson);
          sim = cosineSimilarity(queryVector, vector);
        } catch (e) {
          sim = 0;
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
        relevanceScore: sim,
      };
    });

    return scored.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)).slice(0, limit);
  }

  /**
   * Text Match Search
   */
  async textSearch(workspaceId: string, query: string, limit = 10): Promise<ScoredMemory[]> {
    const rows = await db
      .select()
      .from(memoryEntries)
      .where(
        and(
          eq(memoryEntries.workspaceId, workspaceId),
          isNull(memoryEntries.deletedAt),
          like(memoryEntries.content, `%${query}%`)
        )
      )
      .limit(limit);

    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      content: r.content,
      type: r.type,
      importance: r.importance,
      pinned: Boolean(r.pinned),
      createdAt: String(r.createdAt),
      relevanceScore: 1.0,
    }));
  }

  /**
   * Hybrid Search via Reciprocal Rank Fusion (RRF)
   */
  async hybridSearch(workspaceId: string, query: string, limit = 10, k = 60): Promise<ScoredMemory[]> {
    const [textRanked, vectorRanked] = await Promise.all([
      this.textSearch(workspaceId, query, limit * 2),
      this.vectorSearch(workspaceId, query, limit * 2),
    ]);

    const merged = reciprocalRankFusion(textRanked, vectorRanked, k);
    return merged.slice(0, limit);
  }
}

export const searchService = new SearchService();
