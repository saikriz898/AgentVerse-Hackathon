'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  BookOpen,
  Search,
  Database,
  Sparkles,
  RefreshCw,
  FileCode,
} from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const KnowledgeView: React.FC = () => {
  const [memoryEntries, setMemoryEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMemory = async (query?: string) => {
    setLoading(true);
    try {
      const data = await ApiClient.getMemoryEntries(query);
      setMemoryEntries(data.memoryEntries || []);
    } catch (err) {
      console.warn('Memory API fallback...', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemory();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMemory(searchQuery);
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Central RRF Vector Memory</Badge>
            <Badge variant="outline" className="font-mono">768-dim Embeddings</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Knowledge & Memory ({memoryEntries.length})
          </h1>
          <p className="text-sm text-text-secondary">
            Hybrid BM25 + pgvector reciprocal rank fusion graph store connected to Memory Agent (:4000).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => fetchMemory()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 stroke-[1.75] ${loading ? 'animate-spin' : ''}`} /> Sync Memory
          </Button>
        </div>
      </div>

      {/* RRF Hybrid Vector Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted stroke-[1.75]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query 768-dim vector embeddings or keywords..."
            className="w-full rounded-2xl border border-border bg-surface-2 pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-luxury"
          />
        </div>
        <Button variant="primary" size="sm" type="submit">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Vector Search
        </Button>
      </form>

      {/* Memory Entries Catalog */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface-secondary animate-pulse p-5" />
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {memoryEntries.map((mem) => (
            <Card key={mem.id} className="bg-surface-1 p-5 space-y-3 border border-border hover:border-accent-primary/60 transition-luxury">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-indigo-400" />
                  <span className="font-mono font-bold text-xs text-text-primary">{mem.key}</span>
                </div>
                <Badge variant="accent" className="font-mono text-[10px]">
                  RRF Score: {(mem.vectorScore || 0.95).toFixed(3)}
                </Badge>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed bg-surface-secondary p-3 rounded-xl border border-border/40 font-mono">
                {mem.content}
              </p>

              <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
                <span>Category: <strong className="text-text-primary">{mem.category || 'Architecture'}</strong></span>
                <span>Updated: {mem.updatedAt ? new Date(mem.updatedAt).toLocaleTimeString() : 'Just now'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};
