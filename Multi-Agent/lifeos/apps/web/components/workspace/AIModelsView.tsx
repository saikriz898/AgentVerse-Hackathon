'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Box,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Sliders,
  RefreshCw,
} from 'lucide-react';

export const AIModelsView: React.FC = () => {
  const PROVIDERS = [
    {
      name: 'Google Gemini 2.5 Flash',
      type: 'Primary Orchestrator',
      status: 'Connected',
      contextWindow: '1,000,000 Tokens',
      latency: '180ms',
      cost: '$0.075 / 1M tokens',
      badge: 'success' as const,
      isDefault: true,
    },
    {
      name: 'Anthropic Claude 3.5 Sonnet',
      type: 'Code & Architecture',
      status: 'Connected',
      contextWindow: '200,000 Tokens',
      latency: '340ms',
      cost: '$3.00 / 1M tokens',
      badge: 'accent' as const,
      isDefault: false,
    },
    {
      name: 'OpenAI GPT-4o',
      type: 'LangGraph Reasoning',
      status: 'Connected',
      contextWindow: '128,000 Tokens',
      latency: '410ms',
      cost: '$2.50 / 1M tokens',
      badge: 'accent' as const,
      isDefault: false,
    },
    {
      name: 'Ollama Llama 3.3 70B (Local)',
      type: 'Offline Fallback',
      status: 'Ready (Local)',
      contextWindow: '32,000 Tokens',
      latency: '45ms',
      cost: '$0.00 (Self-Hosted)',
      badge: 'outline' as const,
      isDefault: false,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-none">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="flex items-center gap-1.5">
              <Box className="h-3 w-3 stroke-[2]" /> LLM Gateway & Providers
            </Badge>
            <Badge variant="outline">Dynamic Routing</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            AI Infrastructure & Provider Gateway
          </h1>
          <p className="text-sm text-text-secondary">
            Configure LLM providers, context windows, rate limits, latency health, and automated fallback rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4 stroke-[1.75]" /> Health Check
          </Button>
          <Button variant="primary" size="sm">
            <Sliders className="mr-2 h-4 w-4 stroke-[2]" /> Routing Rules
          </Button>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {PROVIDERS.map((provider, idx) => (
          <Card key={idx} className="bg-surface-1 p-5 hover:border-accent-primary/60 transition-luxury space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-light text-accent-primary font-bold">
                  <Cpu className="h-5 w-5 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">{provider.name}</h3>
                  <span className="text-[11px] text-text-muted">{provider.type}</span>
                </div>
              </div>
              <Badge variant={provider.badge}>{provider.status}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-border/40">
              <div>
                <span className="text-text-muted text-[10px] block">CONTEXT</span>
                <span className="font-semibold text-text-primary">{provider.contextWindow}</span>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">LATENCY</span>
                <span className="font-semibold text-emerald-500 font-mono">{provider.latency}</span>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">PRICING</span>
                <span className="font-semibold text-text-primary font-mono">{provider.cost}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {provider.isDefault ? (
                <span className="text-xs text-accent-primary font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Primary Default Engine
                </span>
              ) : (
                <span className="text-xs text-text-muted">Fallback Tier</span>
              )}
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Configure
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
