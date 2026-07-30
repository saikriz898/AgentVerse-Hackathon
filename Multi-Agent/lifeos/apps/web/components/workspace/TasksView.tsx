'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CheckSquare,
  Plus,
  Sparkles,
  Kanban,
  List,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  User,
  ArrowUpRight,
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const TASKS = [
    {
      id: 'task-1',
      title: 'Configure Tavily Web Search API in Research Agent',
      priority: 'Urgent',
      status: 'In Progress',
      assignee: 'Research Agent',
      dueDate: 'Today',
      timeEstimate: '2.5 hrs',
      checklist: '4/5 completed',
      aiSuggestion: 'Verify 0-100% confidence scoring algorithm threshold.',
    },
    {
      id: 'task-2',
      title: 'Define 10-Stage Sequential LangGraph Execution Schema',
      priority: 'High',
      status: 'In Progress',
      assignee: 'Planning Agent',
      dueDate: 'Tomorrow',
      timeEstimate: '4.0 hrs',
      checklist: '8/10 completed',
      aiSuggestion: 'Risk assessment step passed with 0 critical blockers.',
    },
    {
      id: 'task-3',
      title: 'Build Recharts Cost Parameter Matrix for Cloud Tariffs',
      priority: 'Medium',
      status: 'To Do',
      assignee: 'Finance Agent',
      dueDate: 'Jul 31',
      timeEstimate: '3.0 hrs',
      checklist: '2/6 completed',
      aiSuggestion: 'Include AWS spot instance discount multiplier (+15% ROI).',
    },
    {
      id: 'task-4',
      title: 'Implement RRF Hybrid BM25 Vector Search in Memory Agent',
      priority: 'Urgent',
      status: 'Completed',
      assignee: 'Memory Agent',
      dueDate: 'Jul 29',
      timeEstimate: '5.0 hrs',
      checklist: '6/6 completed',
      aiSuggestion: '768-dim vector embeddings benchmarked under 14ms latency.',
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Hero Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Execution Engine</Badge>
            <Badge variant="outline" className="font-mono">Score 92/100</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Tasks
          </h1>
          <p className="text-sm text-text-secondary">
            Everything that requires execution across your autonomous agent fleet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm">
            <Sparkles className="mr-2 h-4 w-4 stroke-[1.75]" /> AI Breakdown
          </Button>
          <Button variant="primary" size="sm" className="font-semibold">
            <Plus className="mr-2 h-4 w-4 stroke-[2]" /> Create Task
          </Button>
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Today's Tasks</span>
          <p className="mt-1 text-2xl font-bold text-text-primary">14</p>
          <span className="text-[11px] text-text-secondary">4 Pending Execution</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Overdue</span>
          <p className="mt-1 text-2xl font-bold text-amber-500">2</p>
          <span className="text-[11px] text-amber-500 font-semibold">Requires Attention</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Recently Completed</span>
          <p className="mt-1 text-2xl font-bold text-emerald-500">8</p>
          <span className="text-[11px] text-emerald-500 font-semibold">Passed QA Verification</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Execution Score</span>
          <p className="mt-1 text-2xl font-bold text-accent-primary">92/100</p>
          <span className="text-[11px] text-text-secondary">High Velocity</span>
        </Card>
      </div>

      {/* Tasks Catalog Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {TASKS.map((task) => (
          <Card key={task.id} className="bg-surface-1 p-5 space-y-3 hover:border-accent-primary/60 transition-luxury">
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  task.priority === 'Urgent'
                    ? 'error'
                    : task.priority === 'High'
                    ? 'warning'
                    : 'default'
                }
              >
                {task.priority} Priority
              </Badge>

              <span className="text-xs font-medium text-text-muted">{task.dueDate}</span>
            </div>

            <h3 className="text-sm font-bold text-text-primary leading-snug">{task.title}</h3>

            <div className="flex items-center justify-between text-xs text-text-secondary pt-1">
              <span>Assignee: <strong className="text-text-primary">{task.assignee}</strong></span>
              <span>Estimate: <strong className="text-text-primary">{task.timeEstimate}</strong></span>
            </div>

            {/* AI Suggestion Box */}
            <div className="rounded-xl border border-accent-primary/20 bg-accent-light/10 p-2.5 flex items-start gap-2 text-[11px] text-text-secondary">
              <Sparkles className="h-3.5 w-3.5 text-accent-primary shrink-0 mt-0.5" />
              <span>{task.aiSuggestion}</span>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};
