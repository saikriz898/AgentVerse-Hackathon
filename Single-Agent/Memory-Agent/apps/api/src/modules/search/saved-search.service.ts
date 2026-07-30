import { db } from '../../config/db.js';
import { cache } from '../../db/schema/index.js';
import { and, isNull } from 'drizzle-orm';

export interface SavedSearch {
  id: string;
  workspaceId: string;
  name: string;
  query: string;
  filters?: Record<string, any>;
  createdAt: string;
}

export class SavedSearchService {
  async saveSearch(workspaceId: string, name: string, query: string, filters?: Record<string, any>): Promise<SavedSearch> {
    const id = crypto.randomUUID();
    const key = `saved_search:${workspaceId}:${id}`;
    const search: SavedSearch = { id, workspaceId, name, query, filters, createdAt: new Date().toISOString() };

    await db.insert(cache).values({
      id,
      key,
      value: JSON.stringify(search),
    });

    return search;
  }

  async getSavedSearches(workspaceId: string): Promise<SavedSearch[]> {
    const prefix = `saved_search:${workspaceId}:`;
    const rows = await db
      .select()
      .from(cache)
      .where(and(isNull(cache.deletedAt)));

    return rows
      .filter((r: { key: string; }) => r.key.startsWith(prefix))
      .map((r: { value: string; }) => JSON.parse(r.value));
  }
}

export const savedSearchService = new SavedSearchService();
