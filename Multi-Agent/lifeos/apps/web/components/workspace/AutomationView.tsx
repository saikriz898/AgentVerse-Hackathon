'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Zap, Layers, RefreshCw, CheckCircle2, Play } from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const AutomationView: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [queues, setQueues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAutomationData = async () => {
    setLoading(true);
    try {
      const [wfData, qData] = await Promise.all([
        ApiClient.getWorkflowHistory(),
        ApiClient.getQueues(),
      ]);
      setWorkflows(wfData.workflows || []);
      setQueues(qData.queues || []);
    } catch (err) {
      console.warn('Automation API fallback...', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomationData();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Automation Workflows & Queues</Badge>
            <Badge variant="outline" className="font-mono">BullMQ Redis</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Automation & Background Queues
          </h1>
          <p className="text-sm text-text-secondary">
            LangGraph task orchestration and background job queue processing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchAutomationData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 stroke-[1.75] ${loading ? 'animate-spin' : ''}`} /> Sync Queues
          </Button>
        </div>
      </div>

      {/* BullMQ Queues Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {queues.map((q) => (
          <Card key={q.name} className="p-4 bg-surface-1 space-y-1">
            <span className="text-xs font-semibold text-text-muted">{q.name} Queue</span>
            <p className="text-xl font-bold text-text-primary">{q.completed} Done</p>
            <span className="text-[10px] text-emerald-400 font-semibold">{q.active} Active Job</span>
          </Card>
        ))}
      </div>

      {/* Recent Workflow Executions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text-primary">Recent Automated Workflows</h2>
        {workflows.map((wf) => (
          <Card key={wf.id} className="p-5 bg-surface-1 space-y-3 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-accent-primary" />
                <span className="font-bold text-sm text-text-primary">{wf.title}</span>
              </div>
              <Badge variant={wf.status === 'Completed' ? 'success' : 'accent'}>{wf.status}</Badge>
            </div>
            <p className="text-xs font-mono text-text-secondary">{wf.promptText}</p>
            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span>Steps: {wf.steps ? wf.steps.length : 0} Completed</span>
              <span>Duration: {wf.durationMs}ms</span>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};
