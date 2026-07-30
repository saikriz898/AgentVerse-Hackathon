import { db } from '../../config/db.js';
import { preferences } from '../../db/schema/index.js';
import { eq, and } from 'drizzle-orm';

export class PreferenceService {
  async getPreferences(workspaceId: string) {
    return db.select().from(preferences).where(eq(preferences.workspaceId, workspaceId));
  }

  async setPreference(workspaceId: string, key: string, value: string) {
    const existing = await db
      .select()
      .from(preferences)
      .where(and(eq(preferences.workspaceId, workspaceId), eq(preferences.key, key)));

    if (existing.length > 0) {
      await db
        .update(preferences)
        .set({ value, updatedAt: new Date().toISOString() })
        .where(eq(preferences.id, existing[0].id));
      return { ...existing[0], value };
    }

    const id = crypto.randomUUID();
    const record = { id, workspaceId, key, value };
    await db.insert(preferences).values(record);
    return record;
  }
}

export const preferenceService = new PreferenceService();
