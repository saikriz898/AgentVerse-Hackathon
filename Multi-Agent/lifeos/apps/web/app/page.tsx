'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { RightContextPanel } from '@/components/layout/RightContextPanel';
import { MobileNav } from '@/components/layout/MobileNav';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Database,
  FileCode,
  LineChart,
  MessageSquare,
  ArrowUpRight,
  Layers,
  Activity,
} from 'lucide-react';
import { useUIStore } from '@/lib/stores/useUIStore';

export default function HomePage() {
  const activeNavId = useUIStore((s) => s.activeNavId);

  const SPECIALIST_AGENTS = [
    {
      role: 'Research Agent',
      icon: Sparkles,
      status: 'Ready',
      tech: 'Gemini 2.5 Flash / Tavily API',
      description: 'Multi-source deep web search, cross-source fact verification, and 0-100% confidence scoring.',
      badgeVariant: 'accent' as const,
    },
    {
      role: 'Planning Agent',
      icon: FileCode,
      status: 'Ready',
      tech: 'LangGraph / LangChain / OpenAI',
      description: '10-stage sequential project execution workflow, Jinja2 prompt engine, and risk analysis.',
      badgeVariant: 'accent' as const,
    },
    {
      role: 'Finance Agent',
      icon: LineChart,
      status: 'Ready',
      tech: 'FastAPI / Recharts / Cloud Matrix',
      description: '20+ cost parameter estimator, multi-cloud price comparison (AWS, GCP, Azure), and ROI break-even.',
      badgeVariant: 'accent' as const,
    },
    {
      role: 'Memory Agent',
      icon: Database,
      status: 'RRF Synced',
      tech: 'Neon PostgreSQL / pgvector / Gemini',
      description: 'Reciprocal Rank Fusion hybrid search (768-dim embeddings + BM25) and 2D topology graph.',
      badgeVariant: 'success' as const,
    },
    {
      role: 'Review Agent',
      icon: ShieldCheck,
      status: 'Score >= 80 Gate',
      tech: 'Async SQLAlchemy / Security Scanner',
      description: 'Automated QA score verification, SQLi/secret scanner, and 11-criteria quality evaluation.',
      badgeVariant: 'warning' as const,
    },
    {
      role: 'Communication Agent',
      icon: MessageSquare,
      status: 'Ready',
      tech: 'FastAPI / Offline Rule Engine',
      description: 'Transforms technical JSON into 19 output document types tailored for 9 audience profiles.',
      badgeVariant: 'accent' as const,
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-primary font-sans antialiased">
      {/* 1. Sidebar Navigation Shell */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 2. Header Bar */}
        <Header />

        {/* 3. Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-20 md:pb-8">
          {/* Welcome Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="accent">Production Foundation Initialized</Badge>
                <Badge variant="outline">Quiet Luxury Design System</Badge>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
                LifeOS Autonomous Workspace
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                Active view: <span className="font-semibold capitalize text-accent-primary">{activeNavId}</span> — Chief of Staff AI Operating System Foundation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Layers className="mr-2 h-4 w-4" /> System Topology
              </Button>
              <Button variant="primary" size="sm">
                <Sparkles className="mr-2 h-4 w-4" /> Chief of Staff AI
              </Button>
            </div>
          </div>

          {/* System Health Metric Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-muted">System Architecture</span>
                <p className="mt-1 text-xl font-bold text-text-primary">Dual-Engine</p>
                <span className="text-[11px] text-text-secondary">Single-Agent + Multi-Agent</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-light text-accent-primary">
                <Bot className="h-5 w-5" />
              </div>
            </Card>

            <Card className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-muted">Specialist Fleet</span>
                <p className="mt-1 text-xl font-bold text-text-primary">6 AI Agents</p>
                <span className="text-[11px] text-emerald-600 font-semibold">All Microservices Configured</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <Activity className="h-5 w-5" />
              </div>
            </Card>

            <Card className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-muted">QA Gate Threshold</span>
                <p className="mt-1 text-xl font-bold text-text-primary">Score &ge; 80</p>
                <span className="text-[11px] text-amber-600 font-semibold">Review Agent Verification</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </Card>

            <Card className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-muted">Memory Engine</span>
                <p className="mt-1 text-xl font-bold text-text-primary">768-Dim RRF</p>
                <span className="text-[11px] text-text-secondary">Neon PostgreSQL + BM25</span>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                <Database className="h-5 w-5" />
              </div>
            </Card>
          </div>

          {/* 6 Specialist Agents Catalog Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  Autonomous Specialist Agent Fleet Architecture
                </h2>
                <p className="text-xs text-text-secondary">
                  Production architecture contracts prepared for all 6 single agents + Chief of Staff.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SPECIALIST_AGENTS.map((agent, idx) => {
                const Icon = agent.icon;
                return (
                  <Card key={idx} className="flex flex-col justify-between hover:border-accent-primary">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-surface-secondary text-accent-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-bold text-text-primary">{agent.role}</span>
                        </div>
                        <Badge variant={agent.badgeVariant}>{agent.status}</Badge>
                      </div>

                      <p className="mt-3 text-xs text-text-secondary leading-relaxed">
                        {agent.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-[10px] font-mono text-text-muted">{agent.tech}</span>
                      <ArrowUpRight className="h-4 w-4 text-text-muted" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* 4. Collapsible Right Context Inspector Panel */}
      <RightContextPanel />

      {/* 5. Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
