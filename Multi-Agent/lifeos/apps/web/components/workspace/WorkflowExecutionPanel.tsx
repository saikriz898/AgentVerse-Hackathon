'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Circle,
  ChevronDown,
  Sparkles,
  FileCode,
  LineChart,
  Database,
  ShieldCheck,
  MessageSquare,
  Activity,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export interface WorkflowNode {
  id: string;
  agentRole: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  durationMs?: number;
  confidenceScore?: number;
  tokensUsed?: number;
  costEst?: string;
  qaScore?: number;
  details?: string[];
  icon: React.ElementType;
}

export const WorkflowExecutionPanel: React.FC = () => {
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>('planning');

  const WORKFLOW_NODES: WorkflowNode[] = [
    {
      id: 'memory',
      agentRole: 'Memory Agent',
      title: 'Context Vector Loaded',
      status: 'completed',
      durationMs: 140,
      confidenceScore: 0.98,
      tokensUsed: 1240,
      details: ['RRF Hybrid Search (Vector + BM25)', '768-dim Embedding Synced', '3 Pinned Documents Retrieved'],
      icon: Database,
    },
    {
      id: 'research',
      agentRole: 'Research Agent',
      title: 'Multi-Source Deep Web Search',
      status: 'completed',
      durationMs: 2420,
      confidenceScore: 0.95,
      tokensUsed: 4850,
      details: ['Tavily Search API (3x Retry)', 'Cross-Source Fact Checker Passed', '14 Primary References Scraped'],
      icon: Sparkles,
    },
    {
      id: 'planning',
      agentRole: 'Planning Agent',
      title: '10-Stage LangGraph Roadmap',
      status: 'in_progress',
      durationMs: 1180,
      tokensUsed: 3200,
      details: ['Subtask Breakdown Completed', 'Priority Tree Assigned', 'Milestone Generation in Progress...'],
      icon: FileCode,
    },
    {
      id: 'execution',
      agentRole: 'Execution Agent',
      title: 'Task Execution & Code Build',
      status: 'pending',
      icon: Activity,
    },
    {
      id: 'finance',
      agentRole: 'Finance Agent',
      title: 'Cost & Cloud Price Comparison',
      status: 'pending',
      costEst: '$124/mo',
      icon: LineChart,
    },
    {
      id: 'review',
      agentRole: 'Review Agent',
      title: 'QA & Security Scanner',
      status: 'pending',
      qaScore: 95,
      icon: ShieldCheck,
    },
    {
      id: 'communication',
      agentRole: 'Communication Agent',
      title: 'Executive Deliverable Synthesis',
      status: 'pending',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-border bg-surface-1 p-4 shadow-sm transition-luxury">
      {/* Live Pipeline Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-light text-accent-primary">
            <Cpu className="h-4 w-4 stroke-[1.75]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Chief of Staff Orchestrator</h3>
            <p className="text-[11px] text-text-muted">Autonomous 7-Agent Execution Pipeline</p>
          </div>
        </div>
        <Badge variant="accent" className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-accent-primary animate-pulse" />
          <span>Pipeline Active</span>
        </Badge>
      </div>

      {/* Nodes Horizon Bar */}
      <div className="space-y-2">
        {WORKFLOW_NODES.map((node) => {
          const Icon = node.icon;
          const isExpanded = expandedNodeId === node.id;

          return (
            <div
              key={node.id}
              className={cn(
                'rounded-xl border transition-all duration-200 overflow-hidden',
                node.status === 'completed' && 'border-emerald-500/20 bg-emerald-500/5',
                node.status === 'in_progress' && 'border-accent-primary/40 bg-accent-light/10',
                node.status === 'pending' && 'border-border/60 bg-surface-2/40 opacity-60'
              )}
            >
              {/* Node Header Row */}
              <button
                onClick={() => setExpandedNodeId(isExpanded ? null : node.id)}
                className="flex w-full items-center justify-between p-3 text-left transition-luxury"
              >
                <div className="flex items-center gap-3">
                  {node.status === 'completed' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  )}
                  {node.status === 'in_progress' && (
                    <Clock className="h-4 w-4 text-accent-primary animate-spin shrink-0" />
                  )}
                  {node.status === 'pending' && (
                    <Circle className="h-4 w-4 text-text-muted shrink-0" />
                  )}

                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-text-secondary shrink-0" />
                    <span className="text-xs font-bold text-text-primary">{node.agentRole}:</span>
                    <span className="text-xs text-text-secondary truncate">{node.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {node.durationMs && (
                    <span className="text-[10px] font-mono text-text-muted">
                      {(node.durationMs / 1000).toFixed(2)}s
                    </span>
                  )}
                  <ChevronDown
                    className={cn('h-4 w-4 text-text-muted transition-transform duration-200', isExpanded && 'rotate-180')}
                  />
                </div>
              </button>

              {/* Node Expandable Details */}
              {isExpanded && node.details && (
                <div className="border-t border-border/40 p-3 bg-surface-2/60 space-y-2 text-xs text-text-secondary">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                    {node.confidenceScore && (
                      <div>
                        <span className="text-text-muted">Confidence:</span>{' '}
                        <span className="font-semibold text-text-primary">{(node.confidenceScore * 100).toFixed(0)}%</span>
                      </div>
                    )}
                    {node.tokensUsed && (
                      <div>
                        <span className="text-text-muted">Tokens:</span>{' '}
                        <span className="font-semibold text-text-primary">{node.tokensUsed}</span>
                      </div>
                    )}
                    {node.costEst && (
                      <div>
                        <span className="text-text-muted">Cost:</span>{' '}
                        <span className="font-semibold text-text-primary">{node.costEst}</span>
                      </div>
                    )}
                    {node.qaScore && (
                      <div>
                        <span className="text-text-muted">QA Score:</span>{' '}
                        <span className="font-semibold text-emerald-500">{node.qaScore}/100</span>
                      </div>
                    )}
                  </div>

                  <ul className="list-disc list-inside space-y-1 text-[11px] text-text-muted pt-1">
                    {node.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
