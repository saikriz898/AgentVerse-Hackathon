'use client';

import React from 'react';
import { X, Bot, ShieldCheck, Database, FileCode, Sparkles } from 'lucide-react';
import { useUIStore } from '@/lib/stores/useUIStore';

export const RightContextPanel: React.FC = () => {
  const { isRightPanelOpen, toggleRightPanel } = useUIStore();

  if (!isRightPanelOpen) return null;

  return (
    <aside className="fixed right-0 top-16 z-20 flex h-[calc(100vh-4rem)] w-80 flex-col border-l border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 shadow-xl transition-luxury select-none">
      <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-[hsl(var(--accent-primary))]" />
          <span className="text-sm font-bold text-[hsl(var(--text-primary))]">
            Context Inspector
          </span>
        </div>
        <button
          onClick={toggleRightPanel}
          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius)] text-[hsl(var(--text-muted))] hover:bg-[hsl(var(--surface-secondary))]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-4 overflow-y-auto flex-1">
        {/* Active Agent Status Card */}
        <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface-secondary))] p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[hsl(var(--text-secondary))]">Orchestrator</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[hsl(var(--success))]">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" /> Active
            </span>
          </div>
          <p className="mt-1 text-xs text-[hsl(var(--text-primary))] font-medium">Chief of Staff AI Engine</p>
        </div>

        {/* Multi-Agent Fleet Stream Preview */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[hsl(var(--text-muted))]">
            Fleet System Stream
          </span>
          <div className="mt-2 space-y-2">
            {[
              { icon: Sparkles, label: 'Research Agent', status: 'Idle', color: 'text-blue-500' },
              { icon: FileCode, label: 'Planning Agent', status: 'Ready', color: 'text-indigo-500' },
              { icon: Database, label: 'Memory Agent', status: 'RRF Synced', color: 'text-emerald-500' },
              { icon: ShieldCheck, label: 'Review Agent', status: 'Score 95 QA', color: 'text-amber-500' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-xs font-semibold text-[hsl(var(--text-primary))]">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-[hsl(var(--text-muted))]">
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
