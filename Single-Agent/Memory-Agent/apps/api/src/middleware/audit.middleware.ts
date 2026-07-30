import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware.js';
import { db } from '../config/db.js';
import { auditLogs } from '../db/schema/index.js';
import { logger } from '../utils/logger.js';

export async function auditLogger(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const originalJson = res.json;

  res.json = function (body: any) {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && res.statusCode < 400 && req.workspaceId) {
      db.insert(auditLogs).values({
        id: crypto.randomUUID(),
        workspaceId: req.workspaceId,
        userId: req.user?.id || null,
        action: `${req.method} ${req.baseUrl}${req.path}`,
        entityType: req.baseUrl.replace('/api/v1/', '') || 'resource',
        entityId: req.params.id || body?.id || 'unknown',
        changesJson: JSON.stringify(req.body || {}),
      }).catch((err: any) => {
        logger.error(`Failed to record audit log: ${err.message}`);
      });
    }
    return originalJson.call(this, body);
  };

  next();
}
