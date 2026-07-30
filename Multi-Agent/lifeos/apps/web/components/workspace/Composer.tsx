'use client';

import React, { useState } from 'react';
import { Paperclip, Mic, ArrowUp, Command, FileText, Image as ImageIcon, Code, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ComposerProps {
  onSend?: (message: string) => void;
}

export const Composer: React.FC<ComposerProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);

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
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-border bg-surface-1 p-3.5 shadow-md transition-luxury">
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
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask your Chief of Staff AI to research, plan, execute, estimate costs, or draft docs..."
        rows={2}
        className="w-full resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none leading-relaxed"
      />

      {/* Composer Action Toolbar */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setAttachedFiles((prev) => [...prev, 'architecture-spec.pdf'])}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-text-muted hover:bg-surface-2 hover:text-text-primary transition-luxury"
            title="Attach Document or Image"
          >
            <Paperclip className="h-4 w-4 stroke-[1.75]" />
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
            className="h-9 px-3.5 rounded-xl"
          >
            <span>Send</span>
            <ArrowUp className="ml-1 h-3.5 w-3.5 stroke-[2]" />
          </Button>
        </div>
      </div>
    </div>
  );
};
