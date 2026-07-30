import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { contextBuilderService } from './context.builder.service.js';
import { contextAnalytics } from './context.analytics.js';
import { assembleMultiLLMPrompt } from './prompt.assembler.js';
import { z } from 'zod';

const buildContextSchema = z.object({
  query: z.string().min(1),
  maxTokens: z.number().optional().default(2000),
  includePinned: z.boolean().optional().default(true),
});

const assemblePromptSchema = z.object({
  query: z.string().min(1),
  maxTokens: z.number().optional().default(2000),
  provider: z.enum(['gemini', 'openai', 'claude', 'ollama']).optional().default('gemini'),
  systemRole: z.string().optional(),
});

export class ContextController {
  async build(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const startTime = Date.now();
      const options = buildContextSchema.parse(req.body);
      const packageResult = await contextBuilderService.buildContextPackage(req.workspaceId!, options);
      contextAnalytics.logContextBuild(req.workspaceId!, options.query, packageResult.tokenCount, packageResult.memoryCount, Date.now() - startTime);
      res.json(packageResult);
    } catch (err) {
      next(err);
    }
  }

  async assemblePrompt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const options = assemblePromptSchema.parse(req.body);
      const packageResult = await contextBuilderService.buildContextPackage(req.workspaceId!, {
        query: options.query,
        maxTokens: options.maxTokens,
      });

      const prompts = assembleMultiLLMPrompt({
        provider: options.provider,
        systemRole: options.systemRole,
        query: options.query,
        contextText: packageResult.contextText,
      });

      res.json({
        ...prompts,
        tokenCount: packageResult.tokenCount,
        memoryCount: packageResult.memoryCount,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const metrics = contextAnalytics.getWorkspaceMetrics(req.workspaceId!);
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  }
}

export const contextController = new ContextController();
