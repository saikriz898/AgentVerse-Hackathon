import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { versionService } from './version.service.js';

export class VersionController {
  async getVersions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const versions = await versionService.getVersionsForMemory(req.params.memoryId as string);
      res.json({ data: versions });
    } catch (err) {
      next(err);
    }
  }
}

export const versionController = new VersionController();
