'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sliders, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const AIModelsView: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getAIProviders();
      setProviders(data.providers || []);
    } catch (err) {
      console.warn('AI Providers API fallback...', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">AI Provider Manager</Badge>
            <Badge variant="outline" className="font-mono">Fallback Routing</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            AI Models & Providers ({providers.length})
          </h1>
          <p className="text-sm text-text-secondary">
            Centralized LLM provider gateway managing Gemini, Claude, OpenAI, and local Ollama.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchProviders} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 stroke-[1.75] ${loading ? 'animate-spin' : ''}`} /> Refresh Providers
          </Button>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((prov) => (
          <Card key={prov.id} className="p-5 bg-surface-1 space-y-3 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cpu className="h-5 w-5 text-accent-primary" />
                <div>
                  <h3 className="font-bold text-sm text-text-primary">{prov.name}</h3>
                  <span className="text-xs font-mono text-text-muted">{prov.model}</span>
                </div>
              </div>
              <Badge variant={prov.status === 'Active' ? 'success' : 'outline'}>{prov.status}</Badge>
            </div>
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-text-secondary">
              <span>Tokens Used: <strong className="text-text-primary">{prov.totalTokensUsed ? prov.totalTokensUsed.toLocaleString() : 0}</strong></span>
              <span>Priority: #{prov.priority}</span>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};
