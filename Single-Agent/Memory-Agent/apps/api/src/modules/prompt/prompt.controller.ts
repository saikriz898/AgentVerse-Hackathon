import { Request, Response, NextFunction } from 'express';
import { promptService } from './prompt.service.js';

export class PromptController {
  async listTemplates(_req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await promptService.listTemplates();
      res.json(templates);
    } catch (err) {
      next(err);
    }
  }

  async getTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const template = await promptService.getTemplate(id);
      if (!template) {
        res.status(404).json({ message: 'Prompt template not found' });
        return;
      }
      res.json(template);
    } catch (err) {
      next(err);
    }
  }

  async evaluate(req: Request, res: Response, next: NextFunction) {
    try {
      const { promptText } = req.body;
      const evalResult = await promptService.evaluatePrompt(promptText || '');
      res.json(evalResult);
    } catch (err) {
      next(err);
    }
  }

  async testExecution(req: Request, res: Response, next: NextFunction) {
    try {
      const { promptText, variables, model } = req.body;
      const testResult = await promptService.testExecution(
        promptText || '',
        variables || {},
        model || 'Gemini 2.5 Pro'
      );
      res.json(testResult);
    } catch (err) {
      next(err);
    }
  }
}

export const promptController = new PromptController();
