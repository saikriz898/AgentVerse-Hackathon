'use client';

import React, { useState } from 'react';
import {
  Paperclip,
  Mic,
  Command,
  FileText,
  Sparkles,
  Terminal,
  Search,
  Database,
  Play,
  FileCode,
  ShieldCheck,
  Rocket,
  Layers,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAIWorkspaceStore } from '@/lib/stores/useAIWorkspaceStore';
import { ContextBuilderModal } from '@/components/workspace/ContextBuilderModal';
import { cn } from '@/lib/utils';

export interface ComposerProps {
  onSend?: (message: string) => void;
}

export const Composer: React.FC<ComposerProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [isOptimizerActive, setIsOptimizerActive] = useState(true);
  const [isContextBuilderOpen, setIsContextBuilderOpen] = useState(false);

  const { isDeepResearch, isMemorySyncEnabled, toggleDeepResearch, toggleMemorySync } = useAIWorkspaceStore();

  const SLASH_COMMANDS = [
    { command: '/build', description: 'Execute full Startup SDLC (Requirements -> Arch -> Code -> QA -> Deploy)' },
    { command: '/optimize', description: 'Run Prompt Optimizer gap analysis & expand execution plan' },
    { command: '/sdlc', description: 'Execute 18-stage SDLC autonomous multi-agent pipeline' },
    { command: '/prd', description: 'Generate a 10-stage PRD technical specification & feature roadmap' },
    { command: '/arch', description: 'Design system topology, database schema & OpenAPI v3 contracts' },
    { command: '/cost', description: 'Estimate multi-cloud infrastructure cost & ROI break-even' },
    { command: '/qa', description: 'Run automated QA score verification and security scan' },
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    if (val.startsWith('/')) {
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend?.(text);
    setText('');
    setShowSlashMenu(false);
  };

  const handleApplyContextBlock = (contextBlock: string) => {
    setText((prev) => (prev ? `${prev}\n\n${contextBlock}` : contextBlock));
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-border bg-surface-1 p-3.5 shadow-lg transition-luxury">
      {/* Mode Toggles Toolbar */}
      <div className="flex flex-wrap items-center gap-2 pb-2.5 mb-2 border-b border-border/60 text-xs">
        <button
          onClick={toggleDeepResearch}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-medium border transition-luxury',
            isDeepResearch
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-semibold'
              : 'border-border text-text-muted hover:text-text-primary'
          )}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Deep Research: {isDeepResearch ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={toggleMemorySync}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-medium border transition-luxury',
            isMemorySyncEnabled
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold'
              : 'border-border text-text-muted hover:text-text-primary'
          )}
        >
          <Database className="h-3.5 w-3.5" />
          <span>pgvector RRF: {isMemorySyncEnabled ? 'CONNECTED' : 'OFF'}</span>
        </button>

        <button
          onClick={() => setIsOptimizerActive(!isOptimizerActive)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-medium border transition-luxury',
            isOptimizerActive
              ? 'bg-accent-light border-accent-primary text-accent-primary font-semibold'
              : 'border-border text-text-muted hover:text-text-primary'
          )}
        >
          <Zap className="h-3.5 w-3.5 text-accent-primary" />
          <span>Prompt Optimizer: {isOptimizerActive ? 'ON' : 'OFF'}</span>
        </button>

        <button
          onClick={() => setIsContextBuilderOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl font-semibold border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-luxury"
        >
          <Layers className="h-3.5 w-3.5 text-purple-400" />
          <span>🧩 Context Builder</span>
        </button>
      </div>

      {/* Input Area */}
      <textarea
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a goal or command (e.g. /build, /aidlc, /optimize, or plain prompt)..."
        className="w-full resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none min-h-[70px] max-h-[180px] font-sans leading-relaxed"
      />

      {/* Slash Commands Floating Menu */}
      {showSlashMenu && (
        <div className="absolute bottom-full left-3 mb-2 w-80 rounded-2xl border border-border/80 bg-surface-1 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className="px-2 py-1 text-[11px] font-bold text-text-muted uppercase tracking-wider border-b border-border/40 mb-1">
            Available Slash Commands
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {SLASH_COMMANDS.map((item) => (
              <button
                key={item.command}
                onClick={() => {
                  setText(item.command + ' ');
                  setShowSlashMenu(false);
                }}
                className="flex w-full flex-col text-left rounded-xl px-2.5 py-1.5 hover:bg-surface-2 transition-luxury"
              >
                <span className="font-mono text-xs font-bold text-accent-primary">{item.command}</span>
                <span className="text-[11px] text-text-secondary truncate">{item.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="font-mono text-[11px]">⌘+Enter to execute 18-stage pipeline</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="md" onClick={handleSend} disabled={!text.trim()} className="font-semibold px-5">
            <Sparkles className="mr-1.5 h-4 w-4" /> Execute Goal
          </Button>
        </div>
      </div>

      {/* Context Builder Modal */}
      <ContextBuilderModal
        isOpen={isContextBuilderOpen}
        onClose={() => setIsContextBuilderOpen(false)}
        onApplyContext={handleApplyContextBlock}
      />
    </div>
  );
};
