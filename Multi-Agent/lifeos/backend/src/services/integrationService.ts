/**
 * LifeOS Core - Integrations & Webhooks Service
 * Manages external workspace connectivity for GitHub, Linear, Notion, Slack, Google Drive, Figma, and Custom Webhooks.
 */

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'Connected' | 'Available' | 'Connecting' | 'Error';
  account: string;
  lastSync: string;
  badge: 'success' | 'outline' | 'warning' | 'accent';
  isInstalled: boolean;
  webhookUrl?: string;
  syncFrequency?: string;
  apiKey?: string;
}

class IntegrationService {
  private integrations: Integration[] = [
    {
      id: 'github',
      name: 'GitHub Enterprise',
      category: 'Development',
      status: 'Connected',
      account: 'saikriz898',
      lastSync: '5 mins ago',
      badge: 'success',
      isInstalled: true,
      webhookUrl: 'https://api.github.com/webhooks/lifeos-events',
      syncFrequency: 'Every 15 mins',
    },
    {
      id: 'linear',
      name: 'Linear App',
      category: 'Issue Tracking',
      status: 'Connected',
      account: 'LifeOS Workspace',
      lastSync: '12 mins ago',
      badge: 'success',
      isInstalled: true,
      webhookUrl: 'https://api.linear.app/v1/webhooks/lifeos',
      syncFrequency: 'Real-time (Webhooks)',
    },
    {
      id: 'notion',
      name: 'Notion Workspace',
      category: 'Documentation',
      status: 'Connected',
      account: 'saikriz@lifeos.ai',
      lastSync: '1 hour ago',
      badge: 'success',
      isInstalled: true,
      webhookUrl: 'https://api.notion.com/v1/webhooks/lifeos-docs',
      syncFrequency: 'Hourly',
    },
    {
      id: 'slack',
      name: 'Slack Technologies',
      category: 'Communication',
      status: 'Available',
      account: 'Not Connected',
      lastSync: 'Never',
      badge: 'outline',
      isInstalled: false,
    },
    {
      id: 'gdrive',
      name: 'Google Drive & Workspace',
      category: 'Storage',
      status: 'Available',
      account: 'Not Connected',
      lastSync: 'Never',
      badge: 'outline',
      isInstalled: false,
    },
    {
      id: 'figma',
      name: 'Figma Cloud',
      category: 'Design Systems',
      status: 'Available',
      account: 'Not Connected',
      lastSync: 'Never',
      badge: 'outline',
      isInstalled: false,
    },
  ];

  public getIntegrations(): Integration[] {
    return this.integrations;
  }

  public getIntegration(id: string): Integration | undefined {
    return this.integrations.find((i) => i.id === id);
  }

  public connectIntegration(id: string, payload: { account?: string; apiKey?: string; webhookUrl?: string; syncFrequency?: string }): Integration {
    const item = this.getIntegration(id);
    if (!item) {
      throw new Error(`Integration '${id}' not found`);
    }

    item.status = 'Connected';
    item.badge = 'success';
    item.isInstalled = true;
    item.account = payload.account || `${id}_user`;
    item.lastSync = 'Just now';
    if (payload.apiKey) item.apiKey = payload.apiKey;
    if (payload.webhookUrl) item.webhookUrl = payload.webhookUrl;
    if (payload.syncFrequency) item.syncFrequency = payload.syncFrequency;

    return item;
  }

  public configureIntegration(id: string, payload: Partial<Integration>): Integration {
    const item = this.getIntegration(id);
    if (!item) {
      throw new Error(`Integration '${id}' not found`);
    }

    if (payload.account !== undefined) item.account = payload.account;
    if (payload.webhookUrl !== undefined) item.webhookUrl = payload.webhookUrl;
    if (payload.syncFrequency !== undefined) item.syncFrequency = payload.syncFrequency;
    if (payload.apiKey !== undefined) item.apiKey = payload.apiKey;

    item.lastSync = 'Just now';
    return item;
  }

  public disconnectIntegration(id: string): Integration {
    const item = this.getIntegration(id);
    if (!item) {
      throw new Error(`Integration '${id}' not found`);
    }

    item.status = 'Available';
    item.badge = 'outline';
    item.isInstalled = false;
    item.account = 'Not Connected';
    item.lastSync = 'Never';
    delete item.webhookUrl;
    delete item.apiKey;

    return item;
  }

  public syncAll(): Integration[] {
    this.integrations.forEach((item) => {
      if (item.isInstalled) {
        item.lastSync = 'Just now';
      }
    });
    return this.integrations;
  }

  public addCustomWebhook(name: string, category: string, webhookUrl: string): Integration {
    const id = `custom_${Date.now()}`;
    const newIntegration: Integration = {
      id,
      name,
      category,
      status: 'Connected',
      account: 'Custom Webhook Endpoint',
      lastSync: 'Just now',
      badge: 'accent',
      isInstalled: true,
      webhookUrl,
      syncFrequency: 'Real-time Event Stream',
    };
    this.integrations.push(newIntegration);
    return newIntegration;
  }
}

export const integrationService = new IntegrationService();
