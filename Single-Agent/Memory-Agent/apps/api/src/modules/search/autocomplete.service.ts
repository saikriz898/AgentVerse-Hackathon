import { db } from '../../config/db.js';
import { memoryEntries, tags } from '../../db/schema/index.js';
import { eq, and, isNull, like } from 'drizzle-orm';

export interface AutocompleteSuggestion {
  text: string;
  type: 'memory' | 'tag' | 'query';
}

export class AutocompleteService {
  async getSuggestions(workspaceId: string, query: string, limit = 5): Promise<AutocompleteSuggestion[]> {
    if (!query || query.trim().length === 0) return [];

    const searchTerm = `%${query.trim()}%`;

    // 1. Fetch matching memory titles
    const memoryMatches = await db
      .select({ title: memoryEntries.title })
      .from(memoryEntries)
      .where(and(eq(memoryEntries.workspaceId, workspaceId), isNull(memoryEntries.deletedAt), like(memoryEntries.title, searchTerm)))
      .limit(limit);

    // 2. Fetch matching tags
    const tagMatches = await db
      .select({ name: tags.name })
      .from(tags)
      .where(and(eq(tags.workspaceId, workspaceId), isNull(tags.deletedAt), like(tags.name, searchTerm)))
      .limit(limit);

    const suggestions: AutocompleteSuggestion[] = [
      ...memoryMatches.map((m: { title: any; }) => ({ text: m.title, type: 'memory' as const })),
      ...tagMatches.map((t: { name: any; }) => ({ text: t.name, type: 'tag' as const })),
    ];

    return suggestions.slice(0, limit);
  }
}

export const autocompleteService = new AutocompleteService();
