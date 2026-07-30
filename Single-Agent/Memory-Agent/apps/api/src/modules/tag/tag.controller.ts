import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { tagService } from './tag.service.js';
import { z } from 'zod';

const createTagSchema = z.object({ name: z.string().min(1), color: z.string().optional().default('#6366f1') });
const attachTagSchema = z.object({ memoryId: z.string().min(1), tagId: z.string().min(1) });

export class TagController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createTagSchema.parse(req.body);
      const tag = await tagService.createTag(req.workspaceId!, dto.name, dto.color);
      res.status(201).json(tag);
    } catch (err) {
      next(err);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const tagList = await tagService.listTags(req.workspaceId!);
      res.json({ data: tagList });
    } catch (err) {
      next(err);
    }
  }

  async attach(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = attachTagSchema.parse(req.body);
      const rel = await tagService.attachTagToMemory(dto.memoryId, dto.tagId);
      res.status(201).json(rel);
    } catch (err) {
      next(err);
    }
  }
}

export const tagController = new TagController();
