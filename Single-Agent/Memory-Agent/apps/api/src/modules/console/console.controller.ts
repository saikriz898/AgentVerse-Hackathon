import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { consoleService } from './console.service.js';

export class ConsoleController {
  async execute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const command = String(req.body.command || '');
      const result = await consoleService.executeCommand(req.workspaceId!, command);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const consoleController = new ConsoleController();
