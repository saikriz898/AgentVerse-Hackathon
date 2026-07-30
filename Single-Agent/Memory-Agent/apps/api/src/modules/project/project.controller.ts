import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { eventGateway } from '../../agents/core/EventGateway.js';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  code: z.string().optional(),
  status: z.string().optional().default('active'),
  priority: z.string().optional().default('medium'),
  progress: z.number().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  progress: z.number().optional(),
});

export class ProjectController {
  private validateUuid(id: string, res: Response): boolean {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Invalid Project ID' });
      return false;
    }
    return true;
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createProjectSchema.parse(req.body);
      const { result } = await eventGateway.ingest({
        eventType: 'project.create.requested',
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
      const status = req.query.status as string | undefined;
      const { result } = await eventGateway.ingest({
        eventType: 'project.list.requested',
        workspaceId: req.workspaceId!,
        userId: req.user?.id,
        priority: 'NORMAL',
        payload: { search, status },
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
        eventType: 'project.list.requested',
        workspaceId: req.workspaceId!,
        userId: req.user?.id,
        priority: 'NORMAL',
        payload: { id },
      });
      const item = Array.isArray(result) ? result.find((p: any) => p.id === id) : result;
      if (!item) {
        return res.status(404).json({ error: 'Project not found' });
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

      const dto = updateProjectSchema.parse(req.body);
      const { result } = await eventGateway.ingest({
        eventType: 'project.update.requested',
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
        eventType: 'project.delete.requested',
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

export const projectController = new ProjectController();
