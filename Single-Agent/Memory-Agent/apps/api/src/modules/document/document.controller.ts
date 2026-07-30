import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { documentService } from './document.service.js';
import { z } from 'zod';

const createDocSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  mimeType: z.string().optional().default('text/plain'),
});

export class DocumentController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createDocSchema.parse(req.body);
      const doc = await documentService.createDocument(req.workspaceId!, dto.title, dto.content, dto.mimeType);
      res.status(201).json(doc);
    } catch (err) {
      next(err);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const docs = await documentService.listDocuments(req.workspaceId!);
      res.json({ data: docs });
    } catch (err) {
      next(err);
    }
  }
}

export const documentController = new DocumentController();
