'use client';

import React from 'react';
import { FileCode, FileText, Code2, Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ArtifactProps {
  title: string;
  type: 'markdown' | 'json' | 'code' | 'pdf';
  content: string;
}

export const ArtifactViewer: React.FC<ArtifactProps> = ({ title, type, content }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full my-4 rounded-2xl border border-border bg-surface-2 overflow-hidden shadow-sm transition-luxury">
      {/* Artifact Header Bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-surface-1 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {type === 'code' && <Code2 className="h-4 w-4 text-accent-primary" />}
          {type === 'json' && <FileCode className="h-4 w-4 text-blue-400" />}
          {type === 'markdown' && <FileText className="h-4 w-4 text-emerald-400" />}
          <span className="text-xs font-bold text-text-primary">{title}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex h-7 px-2.5 items-center gap-1 text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-xl transition-luxury"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Artifact Body Container */}
      <div className="p-4 font-mono text-xs text-text-primary overflow-x-auto max-h-80 bg-[#0B0D12]">
        <pre className="whitespace-pre-wrap leading-relaxed">{content}</pre>
      </div>
    </div>
  );
};
