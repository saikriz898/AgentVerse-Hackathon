import { Request, Response } from 'express';
import { aiService } from './ai.service.js';

export class AIController {
  async classify(req: Request, res: Response): Promise<void> {
    const { content, title } = req.body;
    if (!content) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }
    const result = await aiService.classifyText(content, title);
    res.json(result);
  }

  async extract(req: Request, res: Response): Promise<void> {
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ message: 'Content is required' });
      return;
    }
    const result = await aiService.extractEntities(content);
    res.json(result);
  }

  async getInsights(req: Request, res: Response): Promise<void> {
    const workspaceId = (req as any).user?.workspaceId || req.query.workspaceId;
    if (!workspaceId) {
      res.status(400).json({ message: 'Workspace ID is required' });
      return;
    }
    const result = await aiService.getWorkspaceInsights(String(workspaceId));
    res.json(result);
  }
}

export const aiController = new AIController();
