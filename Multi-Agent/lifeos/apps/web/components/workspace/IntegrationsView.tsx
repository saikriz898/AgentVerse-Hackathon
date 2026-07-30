'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Share2,
  CheckCircle2,
  Plus,
  RefreshCw,
  ExternalLink,
  Sliders,
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const INTEGRATIONS = [
    {
      name: 'GitHub Enterprise',
      category: 'Development',
      status: 'Connected',
      account: 'saikriz898',
      lastSync: '5 mins ago',
      badge: 'success' as const,
      isInstalled: true,
    },
    {
      name: 'Linear App',
      category: 'Issue Tracking',
      status: 'Connected',
      account: 'LifeOS Workspace',
      lastSync: '12 mins ago',
      badge: 'success' as const,
      isInstalled: true,
    },
    {
      name: 'Notion Workspace',
      category: 'Documentation',
      status: 'Connected',
      account: 'saikriz@lifeos.ai',
      lastSync: '1 hour ago',
      badge: 'success' as const,
      isInstalled: true,
    },
    {
      name: 'Slack Technologies',
      category: 'Communication',
      status: 'Available',
      account: 'Not Connected',
      lastSync: 'Never',
      badge: 'outline' as const,
      isInstalled: false,
    },
    {
      name: 'Google Drive & Workspace',
      category: 'Storage',
      status: 'Available',
      account: 'Not Connected',
      lastSync: 'Never',
      badge: 'outline' as const,
      isInstalled: false,
    },
    {
      name: 'Figma Cloud',
      category: 'Design Systems',
      status: 'Available',
      account: 'Not Connected',
      lastSync: 'Never',
      badge: 'outline' as const,
      isInstalled: false,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-none">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="flex items-center gap-1.5">
              <Share2 className="h-3 w-3 stroke-[2]" /> Integrations & Webhooks
            </Badge>
            <Badge variant="outline">Connected Tools</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Workspace Connectivity & External Tools
          </h1>
          <p className="text-sm text-text-secondary">
            Connect external tools (GitHub, Linear, Slack, Notion) for two-way synchronization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4 stroke-[1.75]" /> Sync All
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="mr-2 h-4 w-4 stroke-[2]" /> Custom Webhook
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {INTEGRATIONS.map((tool, idx) => (
          <Card key={idx} className="bg-surface-1 p-5 hover:border-accent-primary/60 transition-luxury space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary">{tool.name}</h3>
                <Badge variant={tool.badge}>{tool.status}</Badge>
              </div>
              <span className="text-xs text-text-muted">{tool.category}</span>

              <div className="mt-4 pt-3 border-t border-border/40 space-y-1 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span>Account:</span>
                  <span className="font-semibold text-text-primary">{tool.account}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Sync:</span>
                  <span className="text-text-muted">{tool.lastSync}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center justify-between">
              {tool.isInstalled ? (
                <Button variant="outline" size="sm" className="w-full">
                  Configure
                </Button>
              ) : (
                <Button variant="primary" size="sm" className="w-full">
                  Connect
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
