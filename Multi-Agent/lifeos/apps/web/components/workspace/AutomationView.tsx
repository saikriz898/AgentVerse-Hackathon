'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Zap,
  Play,
  Pause,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Search,
  Filter,
  MoreVertical,
  Activity,
  Layers,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const AutomationView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const AUTOMATION_RULES = [
    {
      id: 'rule-1',
      name: 'Auto-Generate PRD on Project Creation',
      trigger: 'Project Created',
      action: 'Invoke Chief of Staff -> Product Planning Dept',
      status: 'active',
      lastRun: '12 mins ago',
      nextRun: 'On Event',
      successRate: '98.4%',
      runsCount: 142,
      category: 'Planning',
    },
    {
      id: 'rule-2',
      name: 'Automated QA & Security Audit Gate',
      trigger: 'Sprint Task Completed',
      action: 'Run Review Agent -> Score >= 80 Check',
      status: 'active',
      lastRun: '1 hour ago',
      nextRun: 'On Event',
      successRate: '100%',
      runsCount: 389,
      category: 'QA',
    },
    {
      id: 'rule-3',
      name: 'Nightly Vector Memory RRF Indexing',
      trigger: 'Schedule (00:00 UTC)',
      action: 'Sync Neon pgvector + BM25 Embeddings',
      status: 'active',
      lastRun: 'Yesterday',
      nextRun: 'Today 00:00 UTC',
      successRate: '99.1%',
      runsCount: 84,
      category: 'Memory',
    },
    {
      id: 'rule-4',
      name: 'Multi-Cloud Infrastructure Cost Sync',
      trigger: 'Webhook Event',
      action: 'Compute AWS/GCP/Azure Tariffs',
      status: 'paused',
      lastRun: '3 days ago',
      nextRun: 'Paused',
      successRate: '94.2%',
      runsCount: 56,
      category: 'Finance',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-none">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 stroke-[2]" /> Automation Engine
            </Badge>
            <Badge variant="outline">AIDLC Pipelines</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            AI Workflow Automation Center
          </h1>
          <p className="text-sm text-text-secondary">
            Automate repetitive SDLC tasks, triggers, and multi-agent execution pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Sliders className="mr-2 h-4 w-4 stroke-[1.75]" /> Template Library
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="mr-2 h-4 w-4 stroke-[2]" /> New Automation
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Total Automations</span>
          <p className="mt-1.5 text-2xl font-bold text-text-primary">18 Rules</p>
          <span className="text-[12px] text-emerald-500 font-semibold">14 Active Pipelines</span>
        </Card>
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Executions (24h)</span>
          <p className="mt-1.5 text-2xl font-bold text-text-primary">671 Runs</p>
          <span className="text-[12px] text-text-secondary">Avg Runtime: 1.2s</span>
        </Card>
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Success Rate</span>
          <p className="mt-1.5 text-2xl font-bold text-emerald-500">98.9%</p>
          <span className="text-[12px] text-text-secondary">0 Failed Pipeline Retries</span>
        </Card>
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Time Saved</span>
          <p className="mt-1.5 text-2xl font-bold text-text-primary">42.8 hrs/mo</p>
          <span className="text-[12px] text-text-secondary">AIDLC Automation Savings</span>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search automation rules..."
            className="w-full h-10 rounded-2xl border border-border bg-surface-1 pl-9 pr-4 text-xs text-text-primary focus:outline-none focus:border-accent-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'active', 'paused'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-xl border transition-luxury capitalize',
                filterType === t
                  ? 'bg-accent-light text-accent-primary border-accent-primary/40 font-bold'
                  : 'border-border text-text-muted hover:text-text-primary'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Automation Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {AUTOMATION_RULES.map((rule) => (
          <Card key={rule.id} className="bg-surface-1 p-5 hover:border-accent-primary/60 transition-luxury space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-light text-accent-primary">
                  <Zap className="h-4 w-4 stroke-[1.75]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">{rule.name}</h3>
                  <span className="text-[11px] text-text-muted">{rule.category} Category</span>
                </div>
              </div>
              <Badge variant={rule.status === 'active' ? 'success' : 'outline'}>
                {rule.status}
              </Badge>
            </div>

            {/* Workflow Trigger -> Action Flow */}
            <div className="rounded-xl border border-border/60 bg-surface-2/60 p-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-text-muted block text-[10px]">TRIGGER</span>
                <span className="font-semibold text-text-primary">{rule.trigger}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-text-muted shrink-0" />
              <div>
                <span className="text-text-muted block text-[10px]">ACTION</span>
                <span className="font-semibold text-text-primary truncate max-w-[140px] block">{rule.action}</span>
              </div>
            </div>

            {/* Metrics Footer */}
            <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border/40">
              <span>Runs: <strong className="text-text-primary">{rule.runsCount}</strong></span>
              <span>Success: <strong className="text-emerald-500">{rule.successRate}</strong></span>
              <span>Last: {rule.lastRun}</span>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:text-accent-primary rounded-lg" title="Run Now">
                  <Play className="h-3.5 w-3.5" />
                </button>
                <button className="p-1 hover:text-text-primary rounded-lg" title="Settings">
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
