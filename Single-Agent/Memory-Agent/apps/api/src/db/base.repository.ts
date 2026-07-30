import { db } from '../config/db.js';
import { eq, and, isNull } from 'drizzle-orm';

export abstract class BaseRepository<T extends { id: string; workspaceId?: string; deletedAt?: string | null }> {
  constructor(protected table: any) {}

  async findById(id: string): Promise<T | null> {
    const results = await db
      .select()
      .from(this.table)
      .where(and(eq(this.table.id, id), isNull(this.table.deletedAt)));
    return results[0] || null;
  }

  async findAllByWorkspace(workspaceId: string): Promise<T[]> {
    return db
      .select()
      .from(this.table)
      .where(and(eq(this.table.workspaceId, workspaceId), isNull(this.table.deletedAt)));
  }

  async create(data: Partial<T>): Promise<T> {
    const id = data.id || crypto.randomUUID();
    const payload = { ...data, id };
    const [inserted] = await db.insert(this.table).values(payload).returning();
    return inserted || payload;
  }

  async softDelete(id: string): Promise<boolean> {
    const updated = await db
      .update(this.table)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(this.table.id, id));
    return Boolean(updated);
  }
}
