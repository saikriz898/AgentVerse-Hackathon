'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { RightContextPanel } from '@/components/layout/RightContextPanel';
import { MobileNav } from '@/components/layout/MobileNav';
import { AIWorkspaceView } from '@/components/workspace/AIWorkspaceView';
import { ProjectsView } from '@/components/workspace/ProjectsView';
import { TasksView } from '@/components/workspace/TasksView';
import { KnowledgeView } from '@/components/workspace/KnowledgeView';
import { DocumentsView } from '@/components/workspace/DocumentsView';
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
      description: 'Multi-source deep web search, cross-source fact verification, and 0–100% confidence scoring.',
      badgeVariant: 'accent' as const,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      role: 'Planning Agent',
      icon: FileCode,
      status: 'Ready',
      tech: 'LangGraph / LangChain / OpenAI',
      description: '10-stage sequential project execution workflow, Jinja2 prompt engine, and risk analysis.',
      badgeVariant: 'accent' as const,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      role: 'Finance Agent',
      icon: LineChart,
      status: 'Ready',
      tech: 'FastAPI / Recharts / Cloud Matrix',
      description: '20+ cost parameter estimator, multi-cloud price comparison (AWS, GCP, Azure), and ROI break-even.',
      badgeVariant: 'accent' as const,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      role: 'Memory Agent',
      icon: Database,
      status: 'RRF Synced',
      tech: 'Neon PostgreSQL / pgvector / Gemini',
      description: 'Reciprocal Rank Fusion hybrid search (768-dim embeddings + BM25) and 2D topology graph.',
      badgeVariant: 'success' as const,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      role: 'Review Agent',
      icon: ShieldCheck,
      status: 'Score >= 80 Gate',
      tech: 'Async SQLAlchemy / Security Scanner',
      description: 'Automated QA score verification, SQLi/secret scanner, and 11-criteria quality evaluation.',
      badgeVariant: 'warning' as const,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      role: 'Communication Agent',
      icon: MessageSquare,
      status: 'Ready',
      tech: 'FastAPI / Offline Rule Engine',
      description: 'Transforms technical JSON into 19 output document types tailored for 9 audience profiles.',
      badgeVariant: 'accent' as const,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-primary font-sans antialiased">
      {/* 1. Sidebar Navigation Shell */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 2. Redesigned 76px Header Bar */}
        <Header />

        {/* 3. Main Workspace Body Area (Dynamic Render) */}
        {activeNavId === 'ai-workspace' && <AIWorkspaceView />}
        {activeNavId === 'projects' && <ProjectsView />}
        {activeNavId === 'tasks' && <TasksView />}
        {activeNavId === 'knowledge' && <KnowledgeView />}
        {activeNavId === 'documents' && <DocumentsView />}

        {(activeNavId === 'dashboard' ||
          !['ai-workspace', 'projects', 'tasks', 'knowledge', 'documents'].includes(activeNavId)) && (
          <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 pb-20 md:pb-8">
            {/* Action Toolbar Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div className="flex items-center gap-3">
                <Badge variant="accent" className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-primary animate-pulse" />
                  <span>Operating System Ready</span>
                </Badge>
                <Badge variant="outline">Quiet Luxury Theme</Badge>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Layers className="mr-2 h-4 w-4 stroke-[1.75]" /> System Topology
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => useUIStore.getState().setActiveNavId('ai-workspace')}
                >
                  <Sparkles className="mr-2 h-4 w-4 stroke-[1.75]" /> Chief of Staff AI
                </Button>
              </div>
            </div>

            {/* Top 4 KPI Metric Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="flex items-center justify-between bg-surface-1">
                <div>
                  <span className="text-xs font-semibold text-text-muted">System Architecture</span>
                  <p className="mt-1.5 text-xl font-bold text-text-primary">Dual-Engine</p>
                  <span className="text-[12px] text-text-secondary">Single-Agent + Multi-Agent</span>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                  <Bot className="h-5 w-5 stroke-[1.75]" />
                </div>
              </Card>

              <Card className="flex items-center justify-between bg-surface-1">
                <div>
                  <span className="text-xs font-semibold text-text-muted">Specialist Fleet</span>
                  <p className="mt-1.5 text-xl font-bold text-text-primary">6 AI Agents</p>
                  <span className="text-[12px] text-emerald-500 font-semibold">All Microservices Configured</span>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <Activity className="h-5 w-5 stroke-[1.75]" />
                </div>
              </Card>

              <Card className="flex items-center justify-between bg-surface-1">
                <div>
                  <span className="text-xs font-semibold text-text-muted">QA Gate Threshold</span>
                  <p className="mt-1.5 text-xl font-bold text-text-primary">Score &ge; 80</p>
                  <span className="text-[12px] text-amber-500 font-semibold">Review Agent Verification</span>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                  <ShieldCheck className="h-5 w-5 stroke-[1.75]" />
                </div>
              </Card>

              <Card className="flex items-center justify-between bg-surface-1">
                <div>
                  <span className="text-xs font-semibold text-text-muted">Memory Engine</span>
                  <p className="mt-1.5 text-xl font-bold text-text-primary">768-Dim RRF</p>
                  <span className="text-[12px] text-text-secondary">Neon PostgreSQL + BM25</span>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                  <Database className="h-5 w-5 stroke-[1.75]" />
                </div>
              </Card>
            </div>

            {/* 6 Specialist Agents Catalog Grid */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-text-primary">
                  Autonomous Specialist Agent Fleet Architecture
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  Production architecture contracts prepared for all 6 single agents + Chief of Staff.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {SPECIALIST_AGENTS.map((agent, idx) => {
                  const Icon = agent.icon;
                  return (
                    <Card key={idx} className="flex flex-col justify-between bg-surface-1 p-6 hover:border-accent-primary/60 transition-luxury">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${agent.iconColor}`}>
                              <Icon className="h-5 w-5 stroke-[1.75]" />
                            </div>
                            <span className="text-base font-bold text-text-primary">{agent.role}</span>
                          </div>
                          <Badge variant={agent.badgeVariant}>{agent.status}</Badge>
                        </div>

                        <p className="mt-4 text-xs md:text-sm text-text-secondary leading-relaxed">
                          {agent.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                        <span className="text-xs font-mono text-text-muted">{agent.tech}</span>
                        <ArrowUpRight className="h-4 w-4 text-text-muted stroke-[1.75]" />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </main>
        )}
      </div>

      {/* 4. Collapsible Right Context Inspector Panel */}
      <RightContextPanel />

      {/* 5. Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
