import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { conversationService } from './conversation.service.js';
import { z } from 'zod';

const createConvSchema = z.object({ title: z.string().min(1) });
const addMsgSchema = z.object({ role: z.enum(['user', 'assistant', 'system']), content: z.string().min(1) });

export class ConversationController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createConvSchema.parse(req.body);
      const conv = await conversationService.createConversation(req.workspaceId!, dto.title);
      res.status(201).json(conv);
    } catch (err) {
      next(err);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const list = await conversationService.listConversations(req.workspaceId!);
      res.json({ data: list });
    } catch (err) {
      next(err);
    }
  }

  async addMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = addMsgSchema.parse(req.body);
      const msg = await conversationService.addMessage(req.params.id as string, dto.role, dto.content);
      res.status(201).json(msg);
    } catch (err) {
      next(err);
    }
  }

  async archive(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const mem = await conversationService.archiveToMemory(req.workspaceId!, req.params.id as string);
      res.json(mem);
    } catch (err) {
      next(err);
    }
  }
}

export const conversationController = new ConversationController();
