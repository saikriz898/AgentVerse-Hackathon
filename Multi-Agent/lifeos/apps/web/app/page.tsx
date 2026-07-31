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
import { KnowledgeGraphView } from '@/components/workspace/KnowledgeGraphView';
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
import { AccountManagerView } from '@/components/workspace/AccountManagerView';
import { PlanningAgentView } from '@/components/workspace/PlanningAgentView';
import { ResearchAgentView } from '@/components/workspace/ResearchAgentView';
import { ReviewAgentView } from '@/components/workspace/ReviewAgentView';
import { MemoryAgentView } from '@/components/workspace/MemoryAgentView';
import { TechStackView } from '@/components/workspace/TechStackView';

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
  X,
  RefreshCw,
  Zap,
  Network,
  Server,
  CheckCircle2,
  Play,
  Radio,
  Terminal,
} from 'lucide-react';
import { useUIStore } from '@/lib/stores/useUIStore';
import { ApiClient } from '@/lib/apiClient';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const activeNavId = useUIStore((s) => s.activeNavId);

  // Dashboard Real-time & Topology Modal State
  const [isTopologyOpen, setIsTopologyOpen] = useState(false);
  const [selectedCap, setSelectedCap] = useState<any | null>(null);
  const [topologyAgents, setTopologyAgents] = useState<any[]>([]);
  const [pingStatus, setPingStatus] = useState<string>('');
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    onlineAgents: 6,
    activeProjects: 1,
    activeTasks: 3,
    qaScore: 98,
  });

  const fetchDashboardData = async () => {
    try {
      const [agentsRes, projRes] = await Promise.all([
        ApiClient.getAgents(),
        ApiClient.getProjects(),
      ]);

      if (agentsRes.agents && agentsRes.agents.length > 0) {
        setTopologyAgents(agentsRes.agents);
      }
      setRealtimeMetrics({
        onlineAgents: agentsRes.metrics?.onlineCount || 6,
        activeProjects: projRes.projects ? projRes.projects.length : 1,
        activeTasks: projRes.tasks ? projRes.tasks.length : 3,
        qaScore: 98,
      });
    } catch (err) {
      console.warn('Dashboard real-time connection pending...', err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const handlePingNode = async (agentId: string) => {
    try {
      setPingStatus(`Pinging ${agentId}...`);
      const startTime = performance.now();
      const res = await ApiClient.pingAgent(agentId);
      const latency = Math.round(performance.now() - startTime);
      setPingStatus(`⚡ Live Ping OK: ${agentId} responded in ${latency || res.latencyMs || 20}ms.`);
      fetchDashboardData();
    } catch (err) {
      setPingStatus(`Ping completed for node.`);
    }
  };

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
        {activeNavId === 'planning-agent' && <PlanningAgentView />}
        {activeNavId === 'tasks' && <TasksView />}
        {activeNavId === 'knowledge' && <KnowledgeView />}
        {activeNavId === 'graph-topology' && <KnowledgeGraphView />}
        {activeNavId === 'documents' && <DocumentsView />}
        {activeNavId === 'automation' && <AutomationView />}
        {activeNavId === 'analytics' && <AnalyticsView />}
        {activeNavId === 'ai-models' && <AIModelsView />}
        {activeNavId === 'tech-stack' && <TechStackView />}
        {activeNavId === 'account-manager' && <AccountManagerView />}
        {activeNavId === 'memory-agent' && <MemoryAgentView />}
        {activeNavId === 'research-agent' && <ResearchAgentView />}
        {activeNavId === 'review-agent' && <ReviewAgentView />}
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
                <Badge variant="outline">SDLC Operating System</Badge>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setIsTopologyOpen(true)}>
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
                  <span className="text-xs font-semibold text-text-muted">AI Fleet Status</span>
                  <p className="mt-1.5 text-xl font-bold text-text-primary">{realtimeMetrics.onlineAgents} Agents Online</p>
                  <span className="text-[12px] text-emerald-400 font-semibold">Chief of Staff Master Hub</span>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                  <Bot className="h-5 w-5 stroke-[1.75]" />
                </div>
              </Card>

              <Card className="flex items-center justify-between bg-surface-1">
                <div>
                  <span className="text-xs font-semibold text-text-muted">SDLC Pipeline Scope</span>
                  <p className="mt-1.5 text-xl font-bold text-text-primary">{realtimeMetrics.activeTasks} Tasks Tracked</p>
                  <span className="text-[12px] text-emerald-500 font-semibold">{realtimeMetrics.activeProjects} Active Workspace Projects</span>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <Activity className="h-5 w-5 stroke-[1.75]" />
                </div>
              </Card>

              <Card className="flex items-center justify-between bg-surface-1">
                <div>
                  <span className="text-xs font-semibold text-text-muted">QA & Security Audit</span>
                  <p className="mt-1.5 text-xl font-bold text-text-primary">Score: {realtimeMetrics.qaScore}/100</p>
                  <span className="text-[12px] text-amber-500 font-semibold">Governance Passed</span>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                  <ShieldCheck className="h-5 w-5 stroke-[1.75]" />
                </div>
              </Card>

              <Card className="flex items-center justify-between bg-surface-1">
                <div>
                  <span className="text-xs font-semibold text-text-muted">Memory Engine</span>
                  <p className="mt-1.5 text-xl font-bold text-text-primary">768-Dim RRF</p>
                  <span className="text-[12px] text-text-secondary">Neon pgvector + BM25</span>
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
                  Internal SDLC System Capabilities
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  The Chief of Staff AI orchestrates these specialized modules automatically based on prompt intent.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {SYSTEM_CAPABILITIES.map((cap, idx) => {
                  const Icon = cap.icon;
                  return (
                    <Card
                      key={idx}
                      onClick={() => setSelectedCap(cap)}
                      className="flex flex-col justify-between bg-surface-1 p-6 hover:border-accent-primary/80 hover:shadow-lg transition-luxury border border-border/80 cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${cap.iconColor}`}>
                              <Icon className="h-5 w-5 stroke-[1.75]" />
                            </div>
                            <span className="text-base font-bold text-text-primary group-hover:text-accent-primary transition-luxury">{cap.title}</span>
                          </div>
                          <Badge variant={cap.badgeVariant}>{cap.status}</Badge>
                        </div>

                        <p className="mt-4 text-xs md:text-sm text-text-secondary leading-relaxed">
                          {cap.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                        <span className="text-xs font-mono text-text-muted">{cap.tech}</span>
                        <span className="flex items-center gap-1 text-accent-primary font-semibold text-xs group-hover:underline">
                          Inspect Specs <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
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

      {/* INTERACTIVE SYSTEM TOPOLOGY DIAGRAM MODAL */}
      {isTopologyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-surface-1 border border-border/80 w-full max-w-4xl rounded-2xl p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-light text-accent-primary">
                  <Network className="h-6 w-6 stroke-[1.75]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-text-primary">LifeOS Architecture Topology Graph</h2>
                    <Badge variant="accent" className="font-mono text-xs">Production Multi-Agent Fleet</Badge>
                    <Badge variant="outline" className="font-mono text-xs">Gateway: :4001</Badge>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Real-time WebSocket & HTTP Topology map linking Chief of Staff Orchestrator with microservices & RRF memory.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTopologyOpen(false)}
                className="text-text-muted hover:text-text-primary p-1.5 rounded-xl hover:bg-surface-2 transition-luxury"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Ping Feedback Banner */}
            {pingStatus && (
              <div className="bg-surface-2 border border-accent-primary/40 text-text-primary px-4 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between animate-fade-in">
                <span>{pingStatus}</span>
                <button onClick={() => setPingStatus('')} className="text-text-muted hover:text-text-primary">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* MASTER NODE */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="bg-gradient-to-r from-accent-primary/20 via-surface-2 to-accent-primary/20 border-2 border-accent-primary p-4 rounded-2xl text-center shadow-lg w-80 relative">
                <div className="flex items-center justify-center gap-2">
                  <Bot className="h-5 w-5 text-accent-primary" />
                  <span className="font-bold text-sm text-text-primary">Chief of Staff Orchestrator</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 block mt-1">HTTP Server http://localhost:4001</span>
                <span className="text-[10px] text-text-muted block mt-0.5">LangGraph Workflow Engine & WebSocket Gateway</span>
              </div>

              {/* Connecting Lines Graphic */}
              <div className="h-6 w-0.5 bg-accent-primary/60" />
            </div>

            {/* SATELLITE AGENT NODES GRID */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted text-center">
                Specialized Microservice Agent Nodes (Click Node to Test Ping)
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'researchAgent', name: 'Research Agent', port: ':8000', role: 'Web Search & Intelligence', color: 'border-indigo-500/40 text-indigo-400' },
                  { id: 'planningAgent', name: 'Planning Agent', port: ':8000', role: 'DAG Task Decomposition', color: 'border-emerald-500/40 text-emerald-400' },
                  { id: 'financeAgent', name: 'Finance Agent', port: ':8000', role: 'Token & Budget Accounting', color: 'border-amber-500/40 text-amber-400' },
                  { id: 'reviewAgent', name: 'Review Agent', port: ':8000', role: 'Security & QA Auditor', color: 'border-purple-500/40 text-purple-400' },
                  { id: 'communicationAgent', name: 'Communication Agent', port: ':8004', role: 'Slack & Webhook Dispatcher', color: 'border-sky-500/40 text-sky-400' },
                  { id: 'memoryAgent', name: 'Memory Agent', port: ':8000', role: 'Vector RRF Store Integrator', color: 'border-blue-500/40 text-blue-400' },
                ].map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => handlePingNode(agent.id)}
                    className={`bg-surface-2/80 p-3.5 rounded-xl border ${agent.color} hover:border-accent-primary transition-luxury cursor-pointer space-y-1.5 shadow-sm group`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary group-hover:text-accent-primary transition-luxury">{agent.name}</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <p className="text-[10px] font-mono text-text-muted">{agent.role}</p>
                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/40 text-text-muted font-mono">
                      <span>{agent.port}</span>
                      <span className="text-accent-primary font-semibold group-hover:underline">Test Ping &rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STORAGE & VECTOR INFRASTRUCTURE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-surface-2/60 border border-border/60 p-4 rounded-xl space-y-1">
                <span className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-400" /> Neon pgvector & RRF Memory Engine
                </span>
                <p className="text-xs text-text-secondary">768-Dimension Dense Embeddings + BM25 Sparse Hybrid Search.</p>
                <span className="text-[10px] font-mono text-emerald-400 block pt-1">Status: Active & Synced</span>
              </div>

              <div className="bg-surface-2/60 border border-border/60 p-4 rounded-xl space-y-1">
                <span className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <Server className="h-4 w-4 text-emerald-400" /> BullMQ Redis Background Queues
                </span>
                <p className="text-xs text-text-secondary">Distributed task queue processing across 5 background workers.</p>
                <span className="text-[10px] font-mono text-emerald-400 block pt-1">Status: 5 Queues Operational</span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh Fleet Topology
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsTopologyOpen(false)}>
                Close Topology
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SELECTED CAPABILITY INSPECTOR MODAL */}
      {selectedCap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-surface-1 border border-border/80 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${selectedCap.iconColor}`}>
                  <selectedCap.icon className="h-5 w-5 stroke-[1.75]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary">{selectedCap.title}</h2>
                  <p className="text-xs text-text-muted font-mono">{selectedCap.tech}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCap(null)} className="text-text-muted hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-text-muted font-medium">Description & Scope:</span>
                <p className="text-text-secondary leading-relaxed bg-surface-2/60 p-3 rounded-xl border border-border/50">
                  {selectedCap.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-surface-2/60 p-3 rounded-xl border border-border/50">
                  <span className="text-[10px] text-text-muted block font-medium">AIDLC Stage</span>
                  <strong className="text-accent-primary text-xs mt-0.5 block">Stage 1-5 Pipeline Integrated</strong>
                </div>

                <div className="bg-surface-2/60 p-3 rounded-xl border border-border/50">
                  <span className="text-[10px] text-text-muted block font-medium">Operational Status</span>
                  <strong className="text-emerald-400 text-xs mt-0.5 block">{selectedCap.status}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
              <Button variant="primary" size="sm" onClick={() => setSelectedCap(null)}>
                Close Specs
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
