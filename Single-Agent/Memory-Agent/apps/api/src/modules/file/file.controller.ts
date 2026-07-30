import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { fileService } from './file.service.js';
import { z } from 'zod';

const recordFileSchema = z.object({
  filename: z.string().min(1),
  path: z.string().min(1),
  size: z.number().positive(),
  mimeType: z.string().min(1),
});

export class FileController {
  async record(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = recordFileSchema.parse(req.body);
      const f = await fileService.recordFile(req.workspaceId!, dto.filename, dto.path, dto.size, dto.mimeType);
      res.status(201).json(f);
    } catch (err) {
      next(err);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const files = await fileService.listFiles(req.workspaceId!);
      res.json({ data: files });
    } catch (err) {
      next(err);
    }
  }
}

export const fileController = new FileController();
