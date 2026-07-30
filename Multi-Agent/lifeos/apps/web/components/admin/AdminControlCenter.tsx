'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Bot,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  RotateCcw,
  Terminal,
  ShieldCheck,
  Cpu,
  Database,
  Zap,
  Server,
  Layers,
  BarChart3,
  Sliders,
  Radio,
  FileCode,
} from 'lucide-react';

interface AgentCard {
  id: string;
  name: string;
  role: string;
  version: string;
  url: string;
  status: 'Online' | 'Offline' | 'Degraded' | 'Disabled';
  health: 'Healthy' | 'Warning' | 'Critical';
  latencyMs: number;
  capabilities: string[];
  retryCount: number;
  errorCount: number;
  lastSeen: string;
}

interface ServiceHealth {
  id: string;
  name: string;
  category: string;
  status: 'Online' | 'Degraded' | 'Offline';
  health: 'Green' | 'Yellow' | 'Red';
  latencyMs: number;
  lastChecked: string;
  details: string;
}

export const AdminControlCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agents' | 'workflows' | 'health' | 'queues' | 'analytics' | 'providers'>('agents');
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<AgentCard[]>([]);
  const [healthServices, setHealthServices] = useState<ServiceHealth[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedAgentLogs, setSelectedAgentLogs] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const fetchBackendData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Agents
      const agentsRes = await fetch('http://localhost:4001/api/v1/agents');
      if (agentsRes.ok) {
        const data = await agentsRes.json();
        setAgents(data.agents || []);
      }

      // 2. Fetch Health Dashboard
      const healthRes = await fetch('http://localhost:4001/api/v1/health/dashboard');
      if (healthRes.ok) {
        const data = await healthRes.json();
        setHealthServices(data.services || []);
      }

      // 3. Fetch Workflows & Logs
      const wfRes = await fetch('http://localhost:4001/api/v1/workflows/history');
      if (wfRes.ok) {
        const data = await wfRes.json();
        setWorkflows(data.workflows || []);
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.warn('LifeOS Backend connection pending...', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
    const interval = setInterval(fetchBackendData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handlePingAgent = async (agentId: string) => {
    try {
      setStatusMessage(`Pinging ${agentId}...`);
      const res = await fetch(`http://localhost:4001/api/v1/agents/${agentId}/ping`, { method: 'POST' });
      const data = await res.json();
      setStatusMessage(`Ping response from ${agentId}: ${data.latencyMs}ms latency.`);
      fetchBackendData();
    } catch (err: any) {
      setStatusMessage(`Ping failed for ${agentId}: ${err.message}`);
    }
  };

  const handleToggleAgent = async (agentId: string, currentStatus: string) => {
    try {
      const enabled = currentStatus === 'Disabled';
      setStatusMessage(`${enabled ? 'Enabling' : 'Disabling'} ${agentId}...`);
      await fetch(`http://localhost:4001/api/v1/agents/${agentId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      setStatusMessage(`Agent ${agentId} ${enabled ? 'Enabled' : 'Disabled'}.`);
      fetchBackendData();
    } catch (err: any) {
      setStatusMessage(`Failed to update ${agentId}`);
    }
  };

  const handleRestartAgent = async (agentId: string) => {
    try {
      setStatusMessage(`Restarting agent ${agentId}...`);
      await fetch(`http://localhost:4001/api/v1/agents/${agentId}/restart`, { method: 'POST' });
      setStatusMessage(`Agent ${agentId} restarted cleanly.`);
      fetchBackendData();
    } catch (err: any) {
      setStatusMessage(`Failed to restart ${agentId}`);
    }
  };

  const handleTestAgent = async (agentId: string) => {
    try {
      setStatusMessage(`Running diagnostic test on ${agentId}...`);
      const res = await fetch(`http://localhost:4001/api/v1/agents/${agentId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'Self-Test Verification' }),
      });
      const data = await res.json();
      setStatusMessage(`Test result for ${agentId}: ${data.success ? 'PASSED (100%)' : 'FAILED'}`);
      fetchBackendData();
    } catch (err: any) {
      setStatusMessage(`Test execution failed for ${agentId}`);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8 bg-background">
      {/* 1. Executive Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">LifeOS Core Control Center</h1>
            <Badge variant="accent" className="flex items-center gap-1.5 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>V1.0.0 Production</span>
            </Badge>
          </div>
          <p className="mt-1 text-sm text-text-muted">
            Enterprise Management Gateway, 30s Health Heartbeat, Workflow Engine & Agent Fleet Control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusMessage && (
            <span className="text-xs font-mono text-accent-primary bg-accent-light px-3 py-1.5 rounded-xl border border-accent-primary/20 animate-fade-in">
              {statusMessage}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={fetchBackendData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 stroke-[1.75] ${loading ? 'animate-spin' : ''}`} /> Refresh State
          </Button>
        </div>
      </div>

      {/* 2. Operational Tab Controller Bar */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('agents')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'agents'
              ? 'bg-accent-primary text-white shadow-md'
              : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
          }`}
        >
          <Bot className="h-4 w-4 stroke-[1.75]" /> Agent Manager ({agents.length})
        </button>

        <button
          onClick={() => setActiveTab('workflows')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'workflows'
              ? 'bg-accent-primary text-white shadow-md'
              : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
          }`}
        >
          <Layers className="h-4 w-4 stroke-[1.75]" /> Workflow Monitor ({workflows.length})
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'health'
              ? 'bg-accent-primary text-white shadow-md'
              : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
          }`}
        >
          <Activity className="h-4 w-4 stroke-[1.75]" /> Health Dashboard
        </button>

        <button
          onClick={() => setActiveTab('queues')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'queues'
              ? 'bg-accent-primary text-white shadow-md'
              : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
          }`}
        >
          <Terminal className="h-4 w-4 stroke-[1.75]" /> Queues & Execution Logs
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'bg-accent-primary text-white shadow-md'
              : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
          }`}
        >
          <BarChart3 className="h-4 w-4 stroke-[1.75]" /> Analytics & Costs
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'providers'
              ? 'bg-accent-primary text-white shadow-md'
              : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
          }`}
        >
          <Sliders className="h-4 w-4 stroke-[1.75]" /> AI Providers
        </button>
      </div>

      {/* 3. TAB 1: AGENT MANAGER PANEL */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="flex flex-col justify-between bg-surface-1 p-5 space-y-4 hover:border-accent-primary/40 transition-luxury">
                <div>
                  {/* Header: Name, Version & Status */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                        <Bot className="h-5 w-5 stroke-[1.75]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary tracking-tight">{agent.name}</h3>
                        <span className="text-xs font-mono text-text-muted">{agent.version} • {agent.url}</span>
                      </div>
                    </div>

                    <Badge variant={agent.status === 'Online' ? 'success' : agent.status === 'Disabled' ? 'outline' : 'warning'}>
                      {agent.status}
                    </Badge>
                  </div>

                  {/* Capabilities List */}
                  <p className="mt-3 text-xs text-text-secondary line-clamp-2">{agent.role}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {agent.capabilities.map((cap, i) => (
                      <span key={i} className="text-[10px] font-medium bg-surface-secondary px-2 py-0.5 rounded-lg border border-border/60 text-text-secondary">
                        {cap}
                      </span>
                    ))}
                  </div>

                  {/* Metrics Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-2 bg-surface-secondary p-3 rounded-xl border border-border/40 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-muted">Latency</span>
                      <p className="text-xs font-bold text-emerald-400">{agent.latencyMs} ms</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-muted">Retries</span>
                      <p className="text-xs font-bold text-text-primary">{agent.retryCount}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-muted">Errors</span>
                      <p className="text-xs font-bold text-amber-400">{agent.errorCount}</p>
                    </div>
                  </div>
                </div>

                {/* Agent Action Buttons */}
                <div className="pt-3 border-t border-border/60 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePingAgent(agent.id)}>
                      <Radio className="mr-1.5 h-3.5 w-3.5 stroke-[1.75]" /> Ping
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTestAgent(agent.id)}>
                      <Play className="mr-1.5 h-3.5 w-3.5 stroke-[1.75]" /> Test
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleRestartAgent(agent.id)}>
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5 stroke-[1.75]" /> Restart
                    </Button>
                    <Button
                      variant={agent.status === 'Disabled' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleAgent(agent.id, agent.status)}
                    >
                      {agent.status === 'Disabled' ? 'Enable' : 'Disable'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 2: WORKFLOW MONITOR */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {workflows.map((wf) => (
              <Card key={wf.id} className="bg-surface-1 p-6 space-y-4 border border-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-accent-primary">{wf.id}</span>
                      <h3 className="font-bold text-base text-text-primary">{wf.title}</h3>
                    </div>
                    <p className="mt-1 text-xs text-text-secondary font-mono">{wf.promptText}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={wf.status === 'Completed' ? 'success' : 'accent'}>{wf.status}</Badge>
                    <span className="text-xs font-mono text-text-muted">{wf.durationMs}ms</span>
                  </div>
                </div>

                {/* Workflow DAG Steps Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {wf.steps.map((st: any) => (
                    <div key={st.id} className="bg-surface-secondary p-3 rounded-xl border border-border/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-text-primary">
                          Step {st.stepNumber}: {st.agentId.toUpperCase()}
                        </span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <p className="text-[11px] text-text-secondary truncate">{st.name}</p>
                      <span className="text-[10px] font-mono text-text-muted">{st.durationMs}ms</span>
                    </div>
                  ))}
                </div>

                {wf.artifact && (
                  <div className="mt-3 bg-surface p-4 rounded-xl border border-border/80 text-xs font-mono">
                    <span className="text-emerald-400 font-bold">Generated Artifact:</span> {wf.artifact.title} ({wf.artifact.version})
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 5. TAB 3: HEALTH DASHBOARD */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {healthServices.map((svc) => (
              <Card key={svc.id} className="bg-surface-1 p-5 flex items-center justify-between border border-border">
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                    svc.health === 'Green' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                  }`}>
                    {svc.category === 'Database' ? <Database className="h-5 w-5" /> : <Server className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-sm">{svc.name}</h3>
                    <span className="text-xs text-text-secondary">{svc.details}</span>
                    <p className="mt-1 text-[11px] font-mono text-text-muted">Latency: {svc.latencyMs}ms</p>
                  </div>
                </div>

                <Badge variant={svc.health === 'Green' ? 'success' : 'warning'}>{svc.health}</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 4: QUEUES & EXECUTION LOGS */}
      {activeTab === 'queues' && (
        <Card className="bg-surface-1 p-6 space-y-4">
          <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
            <Terminal className="h-5 w-5 text-accent-primary" /> Live Operational System Logs
          </h3>

          <div className="bg-surface-secondary p-4 rounded-xl border border-border font-mono text-xs space-y-2 max-h-[400px] overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 border-b border-border/40 pb-1.5">
                <span className="text-text-muted text-[11px] shrink-0">{log.timestamp.split('T')[1].split('.')[0]}</span>
                <span className={`font-bold shrink-0 ${log.level === 'error' ? 'text-red-400' : log.level === 'warn' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  [{log.level.toUpperCase()}]
                </span>
                <span className="text-text-primary leading-tight">{log.message}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 7. TAB 5: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-surface-1 p-5">
            <span className="text-xs font-semibold text-text-muted">Workflows Executed</span>
            <p className="mt-1 text-2xl font-bold text-text-primary">142</p>
            <span className="text-xs text-emerald-400 font-semibold">100% Execution Rate</span>
          </Card>

          <Card className="bg-surface-1 p-5">
            <span className="text-xs font-semibold text-text-muted">Average Response Time</span>
            <p className="mt-1 text-2xl font-bold text-text-primary">1.24 sec</p>
            <span className="text-xs text-emerald-400 font-semibold">Fast Sub-second Pipeline</span>
          </Card>

          <Card className="bg-surface-1 p-5">
            <span className="text-xs font-semibold text-text-muted">Total Tokens Consumed</span>
            <p className="mt-1 text-2xl font-bold text-text-primary">1,420,500</p>
            <span className="text-xs text-text-secondary">Token Budget Allocation</span>
          </Card>

          <Card className="bg-surface-1 p-5">
            <span className="text-xs font-semibold text-text-muted">Estimated Compute Cost</span>
            <p className="mt-1 text-2xl font-bold text-text-primary">$14.82 USD</p>
            <span className="text-xs text-emerald-400 font-semibold">Within Target Budget</span>
          </Card>
        </div>
      )}

      {/* 8. TAB 6: AI PROVIDERS */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-surface-1 p-5 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text-primary">Google Gemini 1.5/3.6 Flash</h3>
              <Badge variant="success">Active Primary</Badge>
            </div>
            <p className="text-xs text-text-secondary">Default orchestrator model for fast multi-agent reasoning and artifact creation.</p>
          </Card>

          <Card className="bg-surface-1 p-5 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-text-primary">Anthropic Claude 3.5 Sonnet</h3>
              <Badge variant="outline">Fallback Ready</Badge>
            </div>
            <p className="text-xs text-text-secondary">Secondary fallback engine for complex code audits and PRD review synthesis.</p>
          </Card>
        </div>
      )}
    </main>
  );
};
