'use client';

import React, { useState } from 'react';
import { Paperclip, Mic, ArrowUp, Command, FileText, Sparkles, Terminal, Code } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ComposerProps {
  onSend?: (message: string) => void;
}

export const Composer: React.FC<ComposerProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);

  const SLASH_COMMANDS = [
    { command: '/prd', description: 'Generate a 10-stage PRD technical specification' },
    { command: '/research', description: 'Execute multi-source deep web research with 0-100% confidence scoring' },
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

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-border bg-surface-1 p-3.5 shadow-lg transition-luxury">
      {/* Slash Command Autocomplete Menu */}
      {showSlashMenu && (
        <div className="absolute bottom-full left-0 mb-2 w-full max-w-md rounded-2xl border border-border bg-surface-1 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-text-muted border-b border-border/60">
            Slash Commands
          </div>
          <div className="space-y-1 mt-1">
            {SLASH_COMMANDS.map((sc, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setText(sc.command + ' ');
                  setShowSlashMenu(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs hover:bg-accent-light hover:text-accent-primary transition-luxury text-left"
              >
                <span className="font-mono font-bold text-accent-primary">{sc.command}</span>
                <span className="text-text-muted truncate ml-2">{sc.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File Badges */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2.5 border-b border-border/60 mb-2">
          {attachedFiles.map((file, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-2 px-2.5 py-1 text-xs text-text-secondary"
            >
              <FileText className="h-3.5 w-3.5 text-accent-primary" />
              <span>{file}</span>
            </span>
          ))}
        </div>
      )}

      {/* Multi-line Text Area */}
      <textarea
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask your Chief of Staff AI or type / for slash commands..."
        rows={2}
        className="w-full resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none leading-relaxed"
      />

      {/* Composer Action Toolbar */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAttachedFiles((prev) => [...prev, 'architecture-spec.pdf'])}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-text-muted hover:bg-surface-2 hover:text-text-primary transition-luxury"
            title="Attach File"
          >
            <Paperclip className="h-4 w-4 stroke-[1.75]" />
          </button>

          <button
            onClick={() => setText((prev) => prev + '/')}
            className="flex h-8 px-2.5 items-center gap-1 text-xs font-mono text-text-muted hover:bg-surface-2 hover:text-accent-primary rounded-xl transition-luxury"
            title="Slash Commands"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>/</span>
          </button>

          <button
            className="flex h-8 w-8 items-center justify-center rounded-xl text-text-muted hover:bg-surface-2 hover:text-text-primary transition-luxury"
            title="Voice Input"
          >
            <Mic className="h-4 w-4 stroke-[1.75]" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-text-muted">
            <Command className="h-3 w-3" /> Enter
          </kbd>

          <Button
            onClick={handleSend}
            disabled={!text.trim()}
            size="sm"
            className="h-9 px-3.5 rounded-xl font-semibold"
          >
            <span>Send</span>
            <ArrowUp className="ml-1 h-3.5 w-3.5 stroke-[2]" />
          </Button>
        </div>
      </div>
    </div>
  );
};
