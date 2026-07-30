import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { memoryService } from './memory.service.js';
import { createMemorySchema, updateMemorySchema } from './memory.dto.js';
import { eventGateway } from '../../agents/core/EventGateway.js';
import { z } from 'zod';

const uuidSchema = z.string().uuid();

export class MemoryController {
  private validateUuid(id: string, res: Response): boolean {
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      res.status(400).json({ success: false, message: 'Invalid Memory ID' });
      return false;
    }
    return true;
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createMemorySchema.parse(req.body);
      const { result } = await eventGateway.ingest({
        eventType: 'memory.create.requested',
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

  async getOne(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!this.validateUuid(id, res)) return;

      const memory = await memoryService.getMemory(req.workspaceId!, id);
      res.json(memory);
    } catch (err) {
      next(err);
    }
  }

  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.query.deleted === 'true') {
        const deletedMemories = await memoryService.listDeletedMemories(req.workspaceId!);
        res.json({ data: deletedMemories, total: deletedMemories.length });
        return;
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const type = req.query.type as string | undefined;
      const result = await memoryService.listMemories(req.workspaceId!, page, limit, type);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!this.validateUuid(id, res)) return;

      const dto = updateMemorySchema.parse(req.body);
      const updated = await memoryService.updateMemory(
        req.workspaceId!,
        id,
        dto,
        req.user?.id || 'system'
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!this.validateUuid(id, res)) return;

      const result = await memoryService.deleteMemory(req.workspaceId!, id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async restore(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!this.validateUuid(id, res)) return;

      const result = await memoryService.restoreMemory(req.workspaceId!, id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async permanentDelete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      if (!this.validateUuid(id, res)) return;

      const result = await memoryService.permanentDeleteMemory(req.workspaceId!, id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const memoryController = new MemoryController();
