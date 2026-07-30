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
import { useAIWorkspaceStore } from '@/lib/stores/useAIWorkspaceStore';

export const WorkflowExecutionPanel: React.FC = () => {
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

  const { sessions, activeSessionId, isThinking } = useAIWorkspaceStore();
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const workflowNodes = activeSession?.workflowNodes || [];

  const ICON_MAP: Record<string, React.ElementType> = {
    memory: Database,
    research: Sparkles,
    planning: FileCode,
    execution: Activity,
    finance: LineChart,
    review: ShieldCheck,
    communication: MessageSquare,
  };

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

        <Badge
          variant={isThinking ? 'accent' : 'success'}
          className="flex items-center gap-1.5"
        >
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              isThinking ? 'bg-accent-primary animate-ping' : 'bg-emerald-500'
            )}
          />
          <span>{isThinking ? 'Executing Pipeline' : 'Pipeline Synced'}</span>
        </Badge>
      </div>

      {/* Nodes List */}
      <div className="space-y-2">
        {workflowNodes.map((node) => {
          const Icon = ICON_MAP[node.id] || Activity;
          const isExpanded = expandedNodeId === node.id;

          return (
            <div
              key={node.id}
              className={cn(
                'rounded-xl border transition-all duration-200 overflow-hidden',
                node.status === 'completed' && 'border-emerald-500/20 bg-emerald-500/5',
                node.status === 'running' && 'border-accent-primary/40 bg-accent-light/10 shadow-xs',
                node.status === 'queued' && 'border-border/60 bg-surface-2/40 opacity-60'
              )}
            >
              {/* Header Row */}
              <button
                onClick={() => setExpandedNodeId(isExpanded ? null : node.id)}
                className="flex w-full items-center justify-between p-3 text-left transition-luxury"
              >
                <div className="flex items-center gap-3">
                  {node.status === 'completed' && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  )}
                  {node.status === 'running' && (
                    <Clock className="h-4 w-4 text-accent-primary animate-spin shrink-0" />
                  )}
                  {node.status === 'queued' && (
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
