'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Database,
  Search,
  Sparkles,
  BookOpen,
  Bookmark,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export const KnowledgeView: React.FC = () => {
  const KNOWLEDGE_ITEMS = [
    {
      id: 'kn-1',
      title: 'LangGraph 10-Stage Agent Execution Pipeline Architecture',
      source: 'Internal Document / LangChain Spec',
      tags: ['LangGraph', 'Planning Agent', 'Python'],
      confidence: 0.98,
      summary: 'Comprehensive formal design specification for sequential 10-stage task execution graph with risk analysis fallback gates.',
    },
    {
      id: 'kn-2',
      title: 'Neon PostgreSQL pgvector Hybrid RRF Search Schema',
      source: 'Database Vector Store',
      tags: ['pgvector', 'RRF', 'BM25'],
      confidence: 0.96,
      summary: 'Reciprocal Rank Fusion algorithm fusing 768-dimensional Gemini embeddings with BM25 keyword rankings.',
    },
    {
      id: 'kn-3',
      title: 'Tavily Multi-Source Deep Web Fact Checking Benchmark',
      source: 'Research Agent Benchmark',
      tags: ['Tavily', 'Web Research', 'Fact Checker'],
      confidence: 0.94,
      summary: 'Cross-verifies 14 primary references with 0-100% confidence scoring algorithm to eliminate hallucination.',
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="success">768-Dim Vector Synced</Badge>
            <Badge variant="outline">RRF Search Engine</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Knowledge
          </h1>
          <p className="text-sm text-text-secondary">
            Your intelligent memory operating system and vector knowledge base.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted stroke-[1.75]" />
          <input
            type="text"
            placeholder="Search semantic memory or vectors..."
            className="w-full rounded-2xl border border-border bg-surface-2 pl-9 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-luxury"
          />
        </div>
      </div>

      {/* RRF Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Vector Store</span>
          <p className="mt-1 text-xl font-bold text-text-primary">Neon pgvector</p>
          <span className="text-[11px] text-emerald-500 font-semibold">768-Dim Embeddings Synced</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Search Algorithm</span>
          <p className="mt-1 text-xl font-bold text-text-primary">Reciprocal Rank Fusion</p>
          <span className="text-[11px] text-text-secondary">Vector + BM25 Hybrid</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Average RRF Confidence</span>
          <p className="mt-1 text-xl font-bold text-accent-primary">96.4%</p>
          <span className="text-[11px] text-emerald-500 font-semibold">0-Latency Cache Verified</span>
        </Card>
      </div>

      {/* Knowledge Catalog Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text-primary">Indexed Knowledge Collections</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {KNOWLEDGE_ITEMS.map((item) => (
            <Card key={item.id} className="bg-surface-1 p-5 space-y-3 hover:border-accent-primary/60 transition-luxury">
              <div className="flex items-center justify-between">
                <Badge variant="accent">{(item.confidence * 100).toFixed(0)}% Confidence</Badge>
                <span className="text-[11px] text-text-muted font-mono">{item.tags[0]}</span>
              </div>

              <h3 className="text-sm font-bold text-text-primary leading-snug">{item.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{item.summary}</p>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
                <span>{item.source}</span>
                <ArrowUpRight className="h-4 w-4 text-text-muted stroke-[1.75]" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};
