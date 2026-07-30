'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { RightContextPanel } from '@/components/layout/RightContextPanel';
import { MobileNav } from '@/components/layout/MobileNav';
import { AIWorkspaceView } from '@/components/workspace/AIWorkspaceView';
import { ProjectsView } from '@/components/workspace/ProjectsView';
import { TasksView } from '@/components/workspace/TasksView';
import { KnowledgeView } from '@/components/workspace/KnowledgeView';
import { DocumentsView } from '@/components/workspace/DocumentsView';
import { AutomationView } from '@/components/workspace/AutomationView';
import { AnalyticsView } from '@/components/workspace/AnalyticsView';
import { AIModelsView } from '@/components/workspace/AIModelsView';
import { SearchView } from '@/components/workspace/SearchView';
import { IntegrationsView } from '@/components/workspace/IntegrationsView';
import { NotificationsView } from '@/components/workspace/NotificationsView';
import { SettingsView } from '@/components/workspace/SettingsView';
import { ProfileView } from '@/components/workspace/ProfileView';
import { AdminControlCenter } from '@/components/admin/AdminControlCenter';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Database,
  FileCode,
  ArrowUpRight,
  Layers,
  Activity,
  Cpu,
} from 'lucide-react';
import { useUIStore } from '@/lib/stores/useUIStore';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const activeNavId = useUIStore((s) => s.activeNavId);

  useEffect(() => {
    setMounted(true);
  }, []);

  const SYSTEM_CAPABILITIES = [
    {
      title: 'Business Analysis',
      icon: FileCode,
      status: 'Active',
      tech: 'BRD / User Stories / Scope',
      description: 'Requirement discovery, stakeholder alignment, user personas, and acceptance criteria.',
      badgeVariant: 'accent' as const,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Product Strategy',
      icon: Sparkles,
      status: 'Active',
      tech: '10-Stage PRD / Feature Matrix',
      description: 'Vision roadmap, MVP feature prioritization, milestone breakdown, and release planning.',
      badgeVariant: 'accent' as const,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'System Architecture',
      icon: Layers,
      status: 'Active',
      tech: 'Neon pgvector / OpenAPI v3',
      description: 'Database schema design, system topology, API contracts, and security architecture.',
      badgeVariant: 'success' as const,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Software Engineering',
      icon: Cpu,
      status: 'Active',
      tech: 'Next.js 16 / FastAPI Interop',
      description: 'App Router frontend, FastAPI microservice orchestrator, and RRF vector search integration.',
      badgeVariant: 'accent' as const,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Quality Assurance',
      icon: ShieldCheck,
      status: 'Gate >= 80',
      tech: 'SQLi & Secret Scanner / QA Gate',
      description: 'Automated 11-criteria quality verification, security audit, and zero-vulnerability gate.',
      badgeVariant: 'warning' as const,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'DevOps & Documentation',
      icon: Activity,
      status: 'Active',
      tech: 'Docker / Helm / OpenAPI Wiki',
      description: 'Container build specs, deployment plans, release notes, and executive summary reports.',
      badgeVariant: 'accent' as const,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-text-primary">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent-primary animate-ping" />
          <span className="text-sm font-semibold">Loading LifeOS Operating System...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-text-primary font-sans antialiased">
      {/* 1. Sidebar Navigation Shell */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 2. Redesigned 76px Header Bar */}
        <Header />

        {/* 3. Main Workspace Body Area (Dynamic Render Across All 14 Modules) */}
        {activeNavId === 'ai-workspace' && <AIWorkspaceView />}
        {activeNavId === 'projects' && <ProjectsView />}
        {activeNavId === 'tasks' && <TasksView />}
        {activeNavId === 'knowledge' && <KnowledgeView />}
        {activeNavId === 'documents' && <DocumentsView />}
        {activeNavId === 'automation' && <AutomationView />}
        {activeNavId === 'analytics' && <AnalyticsView />}
        {activeNavId === 'ai-models' && <AIModelsView />}
        {activeNavId === 'search' && <SearchView />}
        {activeNavId === 'integrations' && <IntegrationsView />}
        {activeNavId === 'notifications' && <NotificationsView />}
        {activeNavId === 'settings' && <SettingsView />}
        {activeNavId === 'profile' && <ProfileView />}
        {activeNavId === 'admin-control' && <AdminControlCenter />}

        {activeNavId === 'dashboard' && (
          <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 pb-20 md:pb-8">
            {/* Action Toolbar Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
              <div className="flex items-center gap-3">
                <Badge variant="accent" className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent-primary animate-pulse" />
                  <span>Unified Chief of Staff AI</span>
                </Badge>
                <Badge variant="outline">AIDLC Operating System</Badge>
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
                  <Bot className="mr-2 h-4 w-4 stroke-[1.75]" /> Chief of Staff AI
                </Button>
              </div>
            </div>

            {/* Top 4 Executive Metrics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="flex items-center justify-between bg-surface-1">
                <div>
                  <span className="text-xs font-semibold text-text-muted">AI Architecture</span>
                  <p className="mt-1.5 text-xl font-bold text-text-primary">Unified AI</p>
                  <span className="text-[12px] text-text-secondary">Chief of Staff Orchestrator</span>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                  <Bot className="h-5 w-5 stroke-[1.75]" />
                </div>
              </Card>

              <Card className="flex items-center justify-between bg-surface-1">
                <div>
                  <span className="text-xs font-semibold text-text-muted">SDLC Capabilities</span>
                  <p className="mt-1.5 text-xl font-bold text-text-primary">7 Modules</p>
                  <span className="text-[12px] text-emerald-500 font-semibold">Dynamic Intent Routing</span>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <Activity className="h-5 w-5 stroke-[1.75]" />
                </div>
              </Card>

              <Card className="flex items-center justify-between bg-surface-1">
                <div>
                  <span className="text-xs font-semibold text-text-muted">QA Gate Threshold</span>
                  <p className="mt-1.5 text-xl font-bold text-text-primary">Score &ge; 80</p>
                  <span className="text-[12px] text-amber-500 font-semibold">Security Audit Passed</span>
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
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                  <Database className="h-5 w-5 stroke-[1.75]" />
                </div>
              </Card>
            </div>

            {/* Internal Capabilities Catalog Grid */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-text-primary">
                  Internal AIDLC System Capabilities
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  The Chief of Staff AI orchestrates these specialized modules automatically based on prompt intent.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {SYSTEM_CAPABILITIES.map((cap, idx) => {
                  const Icon = cap.icon;
                  return (
                    <Card key={idx} className="flex flex-col justify-between bg-surface-1 p-6 hover:border-accent-primary/60 transition-luxury">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${cap.iconColor}`}>
                              <Icon className="h-5 w-5 stroke-[1.75]" />
                            </div>
                            <span className="text-base font-bold text-text-primary">{cap.title}</span>
                          </div>
                          <Badge variant={cap.badgeVariant}>{cap.status}</Badge>
                        </div>

                        <p className="mt-4 text-xs md:text-sm text-text-secondary leading-relaxed">
                          {cap.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                        <span className="text-xs font-mono text-text-muted">{cap.tech}</span>
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
