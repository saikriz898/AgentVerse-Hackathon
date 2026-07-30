import { db } from '../../config/db.js';
import { memoryEntries, memoryVersions, embeddings, memoryTags, relationships, searchIndex, workspaces } from '../../db/schema/index.js';
import { eq, and, isNull, isNotNull, desc, count, inArray, or, notLike, ne } from 'drizzle-orm';
import { getPaginationOffset } from '../../utils/pagination.js';

export class MemoryRepository {
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

  async create(workspaceId: string, data: any) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    const id = crypto.randomUUID();
    const expiresAt = data.ttlSeconds
      ? new Date(Date.now() + data.ttlSeconds * 1000).toISOString()
      : null;

    const record = {
      id,
      workspaceId: wsId,
      title: data.title,
      content: data.content,
      type: data.type,
      importance: data.importance ?? 0.5,
      pinned: data.pinned ?? false,
      ttlSeconds: data.ttlSeconds || null,
      expiresAt,
      metadataJson: data.metadataJson || '{}',
    };

    await db.insert(memoryEntries).values(record);
    return record;
  }

  async findById(workspaceId: string, id: string) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    const rows = await db
      .select()
      .from(memoryEntries)
      .where(
        and(
          eq(memoryEntries.id, id),
          isNull(memoryEntries.deletedAt)
        )
      );
    return rows[0] || null;
  }

  async findAll(workspaceId: string, page = 1, limit = 20, type?: string) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    const { limit: l, offset } = getPaginationOffset(page, limit);

    const conditions: any[] = [
      isNull(memoryEntries.deletedAt),
      or(eq(memoryEntries.workspaceId, wsId), isNull(memoryEntries.workspaceId)),
    ];

    if (type) {
      conditions.push(eq(memoryEntries.type, type));
    }

    const rows = await db
      .select()
      .from(memoryEntries)
      .where(and(...conditions))
      .orderBy(desc(memoryEntries.createdAt))
      .limit(l)
      .offset(offset);

    const totalRes = await db
      .select({ count: count() })
      .from(memoryEntries)
      .where(and(...conditions));

    return {
      data: rows,
      total: Number(totalRes[0]?.count || 0),
    };
  }

  async findDeleted(workspaceId: string) {
    return db
      .select()
      .from(memoryEntries)
      .where(and(eq(memoryEntries.workspaceId, workspaceId), isNotNull(memoryEntries.deletedAt)))
      .orderBy(desc(memoryEntries.deletedAt));
  }

  async updateWithVersion(
    workspaceId: string,
    id: string,
    existing: any,
    data: any,
    modifiedBy: string
  ) {
    const nextVersion = (existing.version || 1) + 1;
    const nowIso = new Date().toISOString();

    // 1. Create version audit record
    await db.insert(memoryVersions).values({
      id: crypto.randomUUID(),
      memoryId: id,
      version: nextVersion,
      content: existing.content,
      title: existing.title,
      modifiedBy,
    });

    // 2. Update memory entry
    await db
      .update(memoryEntries)
      .set({
        ...data,
        updatedAt: nowIso,
      })
      .where(
        and(
          eq(memoryEntries.id, id),
          eq(memoryEntries.workspaceId, workspaceId)
        )
      );

    return this.findById(workspaceId, id);
  }

  async softDelete(workspaceId: string, id: string) {
    await db
      .update(memoryEntries)
      .set({ deletedAt: new Date().toISOString() })
      .where(
        and(
          eq(memoryEntries.id, id),
          eq(memoryEntries.workspaceId, workspaceId)
        )
      );
  }

  async restore(workspaceId: string, id: string) {
    await db
      .update(memoryEntries)
      .set({ deletedAt: null })
      .where(
        and(
          eq(memoryEntries.id, id),
          eq(memoryEntries.workspaceId, workspaceId)
        )
      );
  }

  async permanentDelete(workspaceId: string, id: string) {
    // Delete foreign key dependent rows first
    try { await db.delete(embeddings).where(eq(embeddings.memoryId, id)); } catch (_) {}
    try { await db.delete(memoryVersions).where(eq(memoryVersions.memoryId, id)); } catch (_) {}
    try { await db.delete(memoryTags).where(eq(memoryTags.memoryId, id)); } catch (_) {}
    try { await db.delete(relationships).where(or(eq(relationships.sourceId, id), eq(relationships.targetId, id))); } catch (_) {}
    try { await db.delete(searchIndex).where(eq(searchIndex.memoryId, id)); } catch (_) {}

    await db
      .delete(memoryEntries)
      .where(
        and(
          eq(memoryEntries.id, id),
          eq(memoryEntries.workspaceId, workspaceId)
        )
      );
  }

  async bulkSoftDelete(workspaceId: string, ids: string[]) {
    if (!ids.length) return;
    await db
      .update(memoryEntries)
      .set({ deletedAt: new Date().toISOString() })
      .where(
        and(
          eq(memoryEntries.workspaceId, workspaceId),
          inArray(memoryEntries.id, ids)
        )
      );
  }

  async bulkRestore(workspaceId: string, ids: string[]) {
    if (!ids.length) return;
    await db
      .update(memoryEntries)
      .set({ deletedAt: null })
      .where(
        and(
          eq(memoryEntries.workspaceId, workspaceId),
          inArray(memoryEntries.id, ids)
        )
      );
  }

  async bulkPermanentDelete(workspaceId: string, ids: string[]) {
    if (!ids.length) return;
    // Delete foreign key dependent rows first
    try { await db.delete(embeddings).where(inArray(embeddings.memoryId, ids)); } catch (_) {}
    try { await db.delete(memoryVersions).where(inArray(memoryVersions.memoryId, ids)); } catch (_) {}
    try { await db.delete(memoryTags).where(inArray(memoryTags.memoryId, ids)); } catch (_) {}
    try { await db.delete(relationships).where(or(inArray(relationships.sourceId, ids), inArray(relationships.targetId, ids))); } catch (_) {}
    try { await db.delete(searchIndex).where(inArray(searchIndex.memoryId, ids)); } catch (_) {}

    await db
      .delete(memoryEntries)
      .where(
        and(
          eq(memoryEntries.workspaceId, workspaceId),
          inArray(memoryEntries.id, ids)
        )
      );
  }
}

export const memoryRepository = new MemoryRepository();
