'use client';

import React, { useState } from 'react';
import { FileCode, FileText, Code2, Copy, Check } from 'lucide-react';

export interface ArtifactProps {
  title: string;
  type: 'markdown' | 'json' | 'code' | 'pdf';
  content: string;
}

export const ArtifactViewer: React.FC<ArtifactProps> = ({ title, type, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full my-4 rounded-2xl border border-border bg-surface-1 overflow-hidden shadow-sm transition-luxury">
      {/* Artifact Header Bar */}
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {type === 'code' && <Code2 className="h-4 w-4 text-accent-primary" />}
          {type === 'json' && <FileCode className="h-4 w-4 text-accent-primary" />}
          {type === 'markdown' && <FileText className="h-4 w-4 text-emerald-500" />}
          <span className="text-xs font-bold text-text-primary">{title}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex h-7 px-2.5 items-center gap-1 text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-3 rounded-xl transition-luxury"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Theme-Aware Readable Code Block Body */}
      <div className="p-4 font-mono text-xs text-text-primary bg-surface-2/70 overflow-x-auto max-h-80 leading-relaxed font-semibold">
        <pre className="whitespace-pre-wrap">{content}</pre>
      </div>
    </div>
  );
};
