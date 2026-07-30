import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { webhookService } from './webhook.service.js';

export class WebhookController {
  register(req: AuthenticatedRequest, res: Response) {
    const { url, events } = req.body;
    if (!url || !events || !Array.isArray(events)) {
      res.status(400).json({ message: 'URL and events array are required' });
      return;
    }
    const endpoint = webhookService.registerWebhook(req.workspaceId!, url, events);
    res.status(201).json(endpoint);
  }

  list(req: AuthenticatedRequest, res: Response) {
    const webhooks = webhookService.getWorkspaceWebhooks(req.workspaceId!);
    res.json({ webhooks });
  }
}

export const webhookController = new WebhookController();
