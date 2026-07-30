'use client';

import React, { useState } from 'react';
import {
  X,
  Database,
  FileCode,
  Activity,
  Cpu,
  Zap,
  DollarSign,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/useUIStore';
import { useAIWorkspaceStore } from '@/lib/stores/useAIWorkspaceStore';
import { Badge } from '@/components/ui/Badge';

export const RightContextPanel: React.FC = () => {
  const { isRightPanelOpen, toggleRightPanel } = useUIStore();
  const { sessions, activeSessionId } = useAIWorkspaceStore();
  const [activeTab, setActiveTab] = useState<'memory' | 'artifacts' | 'workflow'>('workflow');

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const workflowNodes = activeSession?.workflowNodes || [];
  const artifacts = activeSession?.artifacts || [];
  const memoryEntries = activeSession?.memoryEntries || [];

  if (!isRightPanelOpen) return null;

  return (
    <aside className="w-80 border-l border-border bg-sidebar p-4 flex flex-col h-screen select-none shrink-0 z-30 transition-all duration-200">
      {/* Header Bar */}
      <div className="flex h-12 items-center justify-between border-b border-border/60 pb-3 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-accent-primary stroke-[1.75]" />
          <h3 className="text-sm font-bold text-text-primary">Inspector & Memory</h3>
        </div>

        <button
          onClick={toggleRightPanel}
          className="flex h-7 w-7 items-center justify-center rounded-xl text-text-muted hover:bg-surface-2 hover:text-text-primary transition-luxury"
          title="Close Inspector"
        >
          <X className="h-4 w-4 stroke-[1.75]" />
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center rounded-2xl border border-border bg-surface-2 p-1 mb-4 shrink-0">
        <button
          onClick={() => setActiveTab('workflow')}
          className={cn(
            'flex-1 py-1.5 text-xs font-semibold rounded-xl transition-luxury',
            activeTab === 'workflow'
              ? 'bg-surface-1 text-text-primary shadow-xs'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          Workflow
        </button>
        <button
          onClick={() => setActiveTab('artifacts')}
          className={cn(
            'flex-1 py-1.5 text-xs font-semibold rounded-xl transition-luxury',
            activeTab === 'artifacts'
              ? 'bg-surface-1 text-text-primary shadow-xs'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          Artifacts ({artifacts.length})
        </button>
        <button
          onClick={() => setActiveTab('memory')}
          className={cn(
            'flex-1 py-1.5 text-xs font-semibold rounded-xl transition-luxury',
            activeTab === 'memory'
              ? 'bg-surface-1 text-text-primary shadow-xs'
              : 'text-text-muted hover:text-text-primary'
          )}
        >
          Memory ({memoryEntries.length})
        </button>
      </div>

      {/* Tab Content Canvas */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* Tab 1: Workflow Nodes */}
        {activeTab === 'workflow' && (
          <div className="space-y-2.5">
            {workflowNodes.map((node) => (
              <div
                key={node.id}
                className="rounded-2xl border border-border/80 bg-surface-1 p-3 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">{node.agentRole}</span>
                  <Badge variant={node.status === 'completed' ? 'success' : node.status === 'running' ? 'accent' : 'outline'}>
                    {node.status}
                  </Badge>
                </div>
                <p className="text-[11px] text-text-secondary">{node.title}</p>
                {node.durationMs && (
                  <div className="flex items-center justify-between text-[10px] text-text-muted pt-1 border-t border-border/40">
                    <span>Duration: {(node.durationMs / 1000).toFixed(2)}s</span>
                    {node.qaScore && <span className="text-emerald-500 font-semibold">QA: {node.qaScore}/100</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Artifacts */}
        {activeTab === 'artifacts' && (
          <div className="space-y-2.5">
            {artifacts.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">No artifacts generated in this session yet.</p>
            ) : (
              artifacts.map((art) => (
                <div
                  key={art.id}
                  className="rounded-2xl border border-border/80 bg-surface-1 p-3 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary truncate">{art.title}</span>
                    <Badge variant="accent">{art.version}</Badge>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">{art.createdAt}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Memory Entries */}
        {activeTab === 'memory' && (
          <div className="space-y-2.5">
            {memoryEntries.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">No memory entries stored yet.</p>
            ) : (
              memoryEntries.map((mem) => (
                <div
                  key={mem.id}
                  className="rounded-2xl border border-border/80 bg-surface-1 p-3 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">{mem.key}</span>
                    <span className="text-[10px] text-emerald-500 font-semibold">{(mem.confidence * 100).toFixed(0)}% Match</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">{mem.value}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="mt-auto pt-3 border-t border-border/60 text-[11px] text-text-muted space-y-1 shrink-0">
        <div className="flex items-center justify-between">
          <span>Active Session</span>
          <span className="text-text-primary font-medium truncate max-w-[120px]">{activeSession.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Token Cost</span>
          <span className="text-emerald-500 font-mono">$0.02 / turn</span>
        </div>
      </div>
    </aside>
  );
};
