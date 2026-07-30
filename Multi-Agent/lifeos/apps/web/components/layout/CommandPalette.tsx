'use client';

import React, { useEffect, useState } from 'react';
import { Search, Bot, FolderKanban, BookOpen, Settings, Zap, X } from 'lucide-react';
import { useCommandPaletteStore } from '@/lib/stores/useCommandPaletteStore';

export const CommandPalette: React.FC = () => {
  const { isOpen, close, toggle } = useCommandPaletteStore();
  const [query, setQuery] = useState('');

  // Keyboard shortcut ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggle, close]);

  if (!isOpen) return null;

  const COMMANDS = [
    { icon: Bot, label: 'Run Chief of Staff AI Prompt', category: 'AI Fleet' },
    { icon: FolderKanban, label: 'Create New Project Space', category: 'Workspace' },
    { icon: BookOpen, label: 'Search Vector Memory Stream', category: 'Memory' },
    { icon: Zap, label: 'Execute Automation Workflow', category: 'System' },
    { icon: Settings, label: 'Open Workspace Settings', category: 'Preferences' },
  ];

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 backdrop-blur-sm transition-luxury px-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface p-4 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <Search className="h-5 w-5 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search workspace..."
            className="w-full bg-transparent text-base text-text-primary placeholder:text-text-muted focus:outline-none"
            autoFocus
          />
          <button
            onClick={close}
            className="flex h-7 w-7 items-center justify-center rounded-xl text-text-muted hover:bg-surface-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={idx}
                  onClick={close}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm text-text-primary hover:bg-accent-light hover:text-accent-primary transition-luxury"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-accent-primary" />
                    <span className="font-medium">{cmd.label}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-text-muted uppercase">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="py-6 text-center text-sm text-text-muted">
              No commands found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
