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
  Layers,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useAIWorkspaceStore } from '@/lib/stores/useAIWorkspaceStore';

export const WorkflowExecutionPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

  const { sessions, activeSessionId, isThinking } = useAIWorkspaceStore();
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const workflowNodes = activeSession?.workflowNodes || [];
  const isWorkflowActive = activeSession?.isWorkflowActive;

  // Hidden if session has 0 messages and workflow is not active
  if (!isWorkflowActive && activeSession?.messages?.length === 0) {
    return null;
  }

  const ICON_MAP: Record<string, React.ElementType> = {
    ba: FileCode,
    product: Sparkles,
    architecture: Layers,
    pm: Activity,
    engineering: Cpu,
    qa: ShieldCheck,
    deploy: Rocket,
  };

  return (
    <div className="w-full my-3 rounded-2xl border border-border bg-surface-1 overflow-hidden shadow-xs transition-luxury">
      {/* Collapsible Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-3.5 bg-surface-2/60 hover:bg-surface-2 text-left transition-luxury"
      >
        <div className="flex items-center gap-2.5">
          <Cpu className="h-4 w-4 text-accent-primary stroke-[1.75]" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-primary">
                {isThinking ? 'SDLC Pipeline Executing...' : 'SDLC Multi-Department Pipeline Synced'}
              </span>
              <Badge variant={isThinking ? 'accent' : 'success'}>
                {isThinking ? 'Executing Departments' : '7 SDLC Departments Completed'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
          <span className="hidden sm:inline">▼ Click to {isOpen ? 'collapse' : 'expand'}</span>
          <ChevronDown
            className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </div>
      </button>

      {/* Accordion Body: 7 SDLC Departments */}
      {isOpen && (
        <div className="p-4 border-t border-border/60 space-y-3 bg-surface-1">
          {workflowNodes.map((node) => {
            const Icon = ICON_MAP[node.id] || Activity;
            const isNodeExpanded = expandedNodeId === node.id;
            const progress = node.status === 'completed' ? 100 : node.progressPercent || 0;

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
                {/* Department Row Header */}
                <button
                  onClick={() => setExpandedNodeId(isNodeExpanded ? null : node.id)}
                  className="flex w-full flex-col p-3 text-left transition-luxury space-y-2"
                >
                  <div className="flex w-full items-center justify-between">
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
                      <span className="text-[10px] font-mono text-text-muted font-bold">
                        {progress}%
                      </span>
                      <ChevronDown
                        className={cn('h-4 w-4 text-text-muted transition-transform duration-200', isNodeExpanded && 'rotate-180')}
                      />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        node.status === 'completed' && 'bg-emerald-500',
                        node.status === 'running' && 'bg-accent-primary animate-pulse',
                        node.status === 'queued' && 'bg-border'
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </button>

                {/* Assigned Department Work Checklist */}
                <div className="px-3 pb-3 pt-1 space-y-1 border-t border-border/40 bg-surface-2/40">
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                    Assigned Work Checklist:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
                    {node.assignedTasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-text-secondary">
                        {task.status === 'completed' ? (
                          <span className="text-emerald-500 font-bold">✔</span>
                        ) : task.status === 'in_progress' ? (
                          <span className="text-accent-primary animate-pulse font-bold">⏳</span>
                        ) : (
                          <span className="text-text-muted">○</span>
                        )}
                        <span className="truncate">{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expand Details */}
                {isNodeExpanded && (
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
                      {node.durationMs && (
                        <div>
                          <span className="text-text-muted">Duration:</span>{' '}
                          <span className="font-semibold text-text-primary">{(node.durationMs / 1000).toFixed(2)}s</span>
                        </div>
                      )}
                      {node.qaScore && (
                        <div>
                          <span className="text-text-muted">QA Score:</span>{' '}
                          <span className="font-semibold text-emerald-500">{node.qaScore}/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
