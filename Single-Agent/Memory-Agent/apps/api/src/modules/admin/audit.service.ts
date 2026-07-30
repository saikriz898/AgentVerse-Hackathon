import { db } from '../../config/db.js';
import { auditLogs } from '../../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';

export class AuditService {
  async getAuditLogs(workspaceId: string, limit = 50) {
    return db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.workspaceId, workspaceId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }
}

export const auditService = new AuditService();
