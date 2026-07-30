'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Database,
  FileText,
  FolderKanban,
  CheckSquare,
  Bookmark,
  Sparkles,
  Command,
  ArrowRight,
} from 'lucide-react';

export const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const SEARCH_RESULTS = [
    {
      title: 'LifeOS PRD Technical Specification',
      category: 'Documents',
      icon: FileText,
      snippet: 'Dual-Engine platform combining Chief of Staff orchestrator with 7 SDLC Specialist Departments...',
      relevance: '98.4% RRF Match',
      date: '12:43 PM',
    },
    {
      title: 'Neon pgvector 768-Dim Database Schema',
      category: 'Knowledge',
      icon: Database,
      snippet: 'Reciprocal Rank Fusion hybrid search (768-dim embeddings + BM25 keyword matching)...',
      relevance: '96.2% RRF Match',
      date: 'Yesterday',
    },
    {
      title: 'Build School ERP Startup App',
      category: 'Projects',
      icon: FolderKanban,
      snippet: 'Full end-to-end SDLC pipeline executed across 7 specialist departments...',
      relevance: '94.8% RRF Match',
      date: '2 hours ago',
    },
    {
      title: 'Security QA Gate Score >= 80 Audit',
      category: 'Artifacts',
      icon: Sparkles,
      snippet: '0 High severity vulnerabilities found. Passed SQLi scanner & secret scanner...',
      relevance: '92.1% RRF Match',
      date: 'Just now',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-none">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="flex items-center gap-1.5">
              <Search className="h-3 w-3 stroke-[2]" /> RRF Vector Search
            </Badge>
            <Badge variant="outline">768-Dim Hybrid Embeddings</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Universal Workspace Search
          </h1>
          <p className="text-sm text-text-secondary">
            Search instantly across Projects, Tasks, Documents, Knowledge Graph, Conversations, and Memory.
          </p>
        </div>
      </div>

      {/* Main Command Input Box */}
      <div className="relative w-full max-w-3xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent-primary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, documents, memory, artifacts or type / for commands..."
          className="w-full h-14 rounded-2xl border border-border bg-surface-1 pl-12 pr-16 text-sm text-text-primary focus:outline-none focus:border-accent-primary shadow-lg transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-text-muted">
          <kbd className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-2 py-1 text-[10px] font-mono">
            <Command className="h-3 w-3" /> K
          </kbd>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {['all', 'Documents', 'Knowledge', 'Projects', 'Artifacts', 'Memory'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-luxury capitalize ${
              activeCategory === cat
                ? 'bg-accent-light text-accent-primary border-accent-primary/40 font-bold'
                : 'border-border text-text-muted hover:text-text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {SEARCH_RESULTS.map((res, idx) => {
          const Icon = res.icon;
          return (
            <Card key={idx} className="bg-surface-1 p-4 hover:border-accent-primary/60 transition-luxury flex items-center justify-between group">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-light text-accent-primary shrink-0 mt-0.5">
                  <Icon className="h-5 w-5 stroke-[1.75]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                      {res.title}
                    </h3>
                    <Badge variant="outline">{res.category}</Badge>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed line-clamp-1">
                    {res.snippet}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 ml-4">
                <span className="text-[11px] font-semibold text-emerald-500">{res.relevance}</span>
                <span className="text-[10px] text-text-muted">{res.date}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
