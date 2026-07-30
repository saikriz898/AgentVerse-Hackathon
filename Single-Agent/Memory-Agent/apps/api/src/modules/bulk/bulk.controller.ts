import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { memoryRepository } from '../memory/memory.repository.js';
import { z } from 'zod';

const bulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'At least one ID is required'),
  type: z.enum(['memory', 'knowledge', 'project']).optional().default('memory'),
});

export class BulkController {
  async bulkDelete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = bulkSchema.parse(req.body);
      await memoryRepository.bulkSoftDelete(req.workspaceId!, dto.ids);
      res.json({ success: true, count: dto.ids.length });
    } catch (err) {
      next(err);
    }
  }

  async bulkRestore(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = bulkSchema.parse(req.body);
      await memoryRepository.bulkRestore(req.workspaceId!, dto.ids);
      res.json({ success: true, count: dto.ids.length });
    } catch (err) {
      next(err);
    }
  }

  async bulkPermanentDelete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = bulkSchema.parse(req.body);
      await memoryRepository.bulkPermanentDelete(req.workspaceId!, dto.ids);
      res.json({ success: true, count: dto.ids.length });
    } catch (err) {
      next(err);
    }
  }
}

export const bulkController = new BulkController();
