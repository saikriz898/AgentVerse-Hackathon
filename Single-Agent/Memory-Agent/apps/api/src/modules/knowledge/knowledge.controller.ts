import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { eventGateway } from '../../agents/core/EventGateway.js';
import { z } from 'zod';

const createKnowledgeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().optional().default('Architecture'),
});

const updateKnowledgeSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().optional(),
});

export class KnowledgeController {
  private validateUuid(id: string, res: Response): boolean {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Invalid Knowledge ID' });
      return false;
    }
    return true;
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createKnowledgeSchema.parse(req.body);
      const { result } = await eventGateway.ingest({
        eventType: 'knowledge.create.requested',
        workspaceId: req.workspaceId!,
        userId: req.user?.id,
        priority: 'HIGH',
        payload: dto,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const { result } = await eventGateway.ingest({
        eventType: 'knowledge.list.requested',
        workspaceId: req.workspaceId!,
        userId: req.user?.id,
        priority: 'NORMAL',
        payload: { search, category },
      });
      res.json({ data: result || [] });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      if (!this.validateUuid(id, res)) return;

      const { result } = await eventGateway.ingest({
        eventType: 'knowledge.list.requested',
        workspaceId: req.workspaceId!,
        userId: req.user?.id,
        priority: 'NORMAL',
        payload: { id },
      });
      const item = Array.isArray(result) ? result.find((k: any) => k.id === id) : result;
      if (!item) {
        return res.status(404).json({ error: 'Knowledge item not found' });
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      if (!this.validateUuid(id, res)) return;

      const dto = updateKnowledgeSchema.parse(req.body);
      const { result } = await eventGateway.ingest({
        eventType: 'knowledge.update.requested',
        workspaceId: req.workspaceId!,
        userId: req.user?.id,
        priority: 'HIGH',
        payload: { id, updatedData: dto },
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      if (!this.validateUuid(id, res)) return;

      const { result } = await eventGateway.ingest({
        eventType: 'knowledge.delete.requested',
        workspaceId: req.workspaceId!,
        userId: req.user?.id,
        priority: 'HIGH',
        payload: { id },
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const knowledgeController = new KnowledgeController();
