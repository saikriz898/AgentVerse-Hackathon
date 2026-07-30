import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { graphService } from './graph.service.js';
import { z } from 'zod';

const linkNodesSchema = z.object({
  sourceId: z.string().min(1),
  targetId: z.string().min(1),
  relationType: z.string().optional().default('references'),
  weight: z.number().optional().default(1.0),
});

export class GraphController {
  async getGraph(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const typeFilter = String(req.query.type || 'all');
      const search = req.query.search ? String(req.query.search) : undefined;
      const data = await graphService.getGraph(req.workspaceId!, typeFilter, search);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async linkNodes(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = linkNodesSchema.parse(req.body);
      const link = await graphService.linkNodes(dto.sourceId, dto.targetId, dto.relationType, dto.weight);
      res.status(201).json(link);
    } catch (err) {
      next(err);
    }
  }
}

export const graphController = new GraphController();
