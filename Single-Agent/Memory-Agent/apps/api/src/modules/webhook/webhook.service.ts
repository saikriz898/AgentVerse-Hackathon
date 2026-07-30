import crypto from 'crypto';
import { logger } from '../../utils/logger.js';

export interface WebhookEndpoint {
  id: string;
  workspaceId: string;
  url: string;
  secret: string;
  events: string[];
  createdAt: string;
}

export class WebhookService {
  private webhooks = new Map<string, WebhookEndpoint>();

  registerWebhook(workspaceId: string, url: string, events: string[]): WebhookEndpoint {
    const id = crypto.randomUUID();
    const secret = crypto.randomBytes(32).toString('hex');
    const endpoint: WebhookEndpoint = {
      id,
      workspaceId,
      url,
      secret,
      events,
      createdAt: new Date().toISOString(),
    };
    this.webhooks.set(id, endpoint);
    logger.info(`Registered webhook endpoint ${id} for workspace ${workspaceId}`);
    return endpoint;
  }

  getWorkspaceWebhooks(workspaceId: string): WebhookEndpoint[] {
    return Array.from(this.webhooks.values()).filter((w) => w.workspaceId === workspaceId);
  }

  generateSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  async dispatchEvent(workspaceId: string, event: string, payload: any) {
    const endpoints = this.getWorkspaceWebhooks(workspaceId).filter((w) => w.events.includes(event) || w.events.includes('*'));

    for (const endpoint of endpoints) {
      const body = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
      const signature = this.generateSignature(body, endpoint.secret);

      logger.info(`[Webhook Dispatch] Sending ${event} to ${endpoint.url} with signature ${signature.slice(0, 10)}...`);
    }
  }
}

export const webhookService = new WebhookService();
