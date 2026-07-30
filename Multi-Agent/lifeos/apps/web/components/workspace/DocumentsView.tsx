'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  Plus,
  Sparkles,
  FileCode,
  Download,
  Share2,
  Edit,
  RotateCcw,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const DOCUMENTS = [
    {
      id: 'doc-1',
      title: 'LifeOS Product Requirements Document (PRD) V1',
      type: 'Executive PRD',
      author: 'Communication Agent',
      lastEdited: '10 mins ago',
      version: 'v1.4.0',
      status: 'Approved',
      summary: 'Production PRD specification covering Chief of Staff orchestration, single-agent contracts, and Next.js design system.',
    },
    {
      id: 'doc-2',
      title: 'Multi-Cloud Price Comparison & Infrastructure ROI',
      type: 'Financial Report',
      author: 'Finance Agent',
      lastEdited: '1 hour ago',
      version: 'v2.1.0',
      status: 'Under Review',
      summary: '20+ cost parameter estimator for spot vs reserved AWS/GCP instances with break-even timeline.',
    },
    {
      id: 'doc-3',
      title: 'Security Scan Audit & QA Quality Evaluation',
      type: 'Security Report',
      author: 'Review Agent',
      lastEdited: '3 hours ago',
      version: 'v1.0.2',
      status: 'Passed (94/100)',
      summary: 'SQLi, secret scanner, and 11-criteria code quality report confirming zero high-severity vulnerabilities.',
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Hero Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Document Workspace</Badge>
            <Badge variant="outline">19 Output Formats</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Documents
          </h1>
          <p className="text-sm text-text-secondary">
            Create, organize and collaborate on executive documents with AI synthesis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm">
            <Sparkles className="mr-2 h-4 w-4 stroke-[1.75]" /> AI Writer
          </Button>
          <Button variant="primary" size="sm" className="font-semibold">
            <Plus className="mr-2 h-4 w-4 stroke-[2]" /> New Document
          </Button>
        </div>
      </div>

      {/* Document Catalog Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {DOCUMENTS.map((doc) => (
          <Card key={doc.id} className="bg-surface-1 p-6 flex flex-col justify-between hover:border-accent-primary/60 transition-luxury">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant={doc.status.includes('Approved') || doc.status.includes('Passed') ? 'success' : 'warning'}>
                  {doc.status}
                </Badge>
                <span className="text-[10px] font-mono text-text-muted">{doc.version}</span>
              </div>

              <h3 className="mt-3 text-sm font-bold text-text-primary leading-snug">{doc.title}</h3>
              <p className="mt-2 text-xs text-text-secondary leading-relaxed">{doc.summary}</p>

              {/* AI Quick Actions Toolbar */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2">
                <button className="text-[11px] font-semibold text-accent-primary hover:underline">
                  Rewrite
                </button>
                <span className="text-text-muted">•</span>
                <button className="text-[11px] font-semibold text-accent-primary hover:underline">
                  Summarize
                </button>
                <span className="text-text-muted">•</span>
                <button className="text-[11px] font-semibold text-accent-primary hover:underline">
                  Review
                </button>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
              <span>Author: <strong className="text-text-primary">{doc.author}</strong></span>
              <span>{doc.lastEdited}</span>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};
