'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Sparkles,
  Database,
  FileText,
  FolderKanban,
  Zap,
  ShieldCheck,
  Activity,
  X,
  ArrowUpRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  Check,
} from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const DEMO_PRESETS = [
    { label: '🚀 Demo: School ERP Portal', term: 'School ERP' },
    { label: '⚡ Demo: 18-Stage AIDLC', term: 'AIDLC' },
    { label: '🧠 Demo: pgvector RRF Memory', term: 'pgvector' },
    { label: '💰 Demo: Finance & ROI Calculation', term: 'Finance' },
    { label: '🛡️ Demo: Security Audit Gate', term: 'OWASP' },
  ];

  const fetchSearchResults = async (q: string) => {
    setLoading(true);
    setSearched(true);
    try {
      const data = await ApiClient.universalSearch(q);
      setResults(data.results || []);
    } catch (err) {
      console.warn('Universal Search API connection pending...', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Perform initial load to populate pre-indexed demo search items
    fetchSearchResults('');
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSearchResults(query);
  };

  const handleDemoPresetClick = (term: string) => {
    setQuery(term);
    fetchSearchResults(term);
  };

  const filteredResults = selectedFilter === 'ALL'
    ? results
    : results.filter((r) => r.type.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="accent">Universal Hybrid Search Engine</Badge>
            <Badge variant="outline" className="font-mono text-xs">Dense Vector + BM25 RRF</Badge>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 font-mono text-xs">
              ⚡ Demo Pre-Indexed Data Synced
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Universal Search Engine
          </h1>
          <p className="text-sm text-text-secondary">
            Perform real-time hybrid search across Projects, Tasks, Artifacts, Vector RRF Memory, Automations, and Audit Logs.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => fetchSearchResults(query)}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Re-index Engine
        </Button>
      </div>

      {/* 1-CLICK DEMO SEARCH PRESETS BAR */}
      <div className="bg-surface-2/80 p-4 rounded-2xl border border-border/80 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-accent-primary" /> Instant Demo Search Queries
          </span>
          <span className="text-[10px] font-mono text-text-muted">Click any demo to test instant search</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.term}
              type="button"
              onClick={() => handleDemoPresetClick(preset.term)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-luxury flex items-center gap-1.5 ${
                query === preset.term
                  ? 'bg-accent-light border-accent-primary text-accent-primary font-bold shadow-xs'
                  : 'bg-surface-1 border-border text-text-secondary hover:border-accent-primary/60 hover:text-text-primary'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Big Search Form Input */}
      <form onSubmit={handleSearchSubmit} className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-accent-primary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all projects, vector memory, artifacts, or code specs..."
              className="w-full rounded-2xl border-2 border-border/80 bg-surface-1 pl-12 pr-10 py-3.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-luxury shadow-md font-mono"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  fetchSearchResults('');
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button variant="primary" size="md" type="submit" disabled={loading} className="px-6 font-semibold">
            <Sparkles className="mr-2 h-4 w-4" /> Universal Search
          </Button>
        </div>
      </form>

      {/* Filter Category Chips */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3 text-xs">
        <span className="text-text-muted font-semibold">Filter Entity:</span>
        {['ALL', 'Project', 'Task', 'Artifact', 'Memory', 'Automation', 'Audit'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-luxury border ${
              selectedFilter === cat
                ? 'bg-accent-light border-accent-primary text-accent-primary font-bold shadow-xs'
                : 'bg-surface-1 border-border text-text-muted hover:text-text-primary'
            }`}
          >
            {cat} {cat === 'ALL' ? `(${results.length})` : `(${results.filter((r) => r.type.toLowerCase() === cat.toLowerCase()).length})`}
          </button>
        ))}
      </div>

      {/* Search Results Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary">
            Indexed Search Results ({filteredResults.length})
          </h2>
          <span className="text-xs text-text-muted font-mono">
            {loading ? 'Searching hybrid index...' : 'RRF Vector Score Ranking Active'}
          </span>
        </div>

        {filteredResults.length === 0 && !loading && (
          <Card className="p-8 text-center text-xs text-text-muted space-y-2">
            <Database className="h-8 w-8 text-text-muted mx-auto" />
            <p className="font-semibold text-text-primary">No matching index entries found for "{query}".</p>
            <p className="text-text-secondary">Click one of the Demo Presets above to test search.</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResults.map((res) => (
            <Card
              key={res.id}
              onClick={() => setSelectedItem(res)}
              className="p-5 bg-surface-1 space-y-3 border border-border/80 hover:border-accent-primary hover:shadow-lg transition-luxury cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-2 border border-border shrink-0">
                      {res.type === 'Artifact' && <FileText className="h-4 w-4 text-emerald-400" />}
                      {res.type === 'Memory' && <Database className="h-4 w-4 text-indigo-400" />}
                      {res.type === 'Project' && <FolderKanban className="h-4 w-4 text-accent-primary" />}
                      {res.type === 'Task' && <CheckCircle2 className="h-4 w-4 text-amber-400" />}
                      {res.type === 'Automation' && <Zap className="h-4 w-4 text-sky-400" />}
                      {res.type === 'Audit' && <ShieldCheck className="h-4 w-4 text-purple-400" />}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-text-primary group-hover:text-accent-primary transition-luxury">{res.title}</span>
                      <span className="text-[10px] font-mono text-text-muted block">{res.category || res.type}</span>
                    </div>
                  </div>

                  <Badge variant="outline" className="font-mono text-[10px] shrink-0">
                    Score: {(res.score || 0.95).toFixed(2)}
                  </Badge>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed bg-surface-2/60 p-3 rounded-xl border border-border/40 font-mono">
                  {res.snippet}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-text-muted border-t border-border/40 font-mono">
                <span>{res.timestamp ? new Date(res.timestamp).toLocaleDateString() : 'Synced'}</span>
                <span className="text-accent-primary font-semibold flex items-center gap-1 group-hover:underline">
                  Inspect Record <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SELECTED RESULT DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-surface-1 border border-border/80 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-light text-accent-primary font-bold">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-text-primary">{selectedItem.title}</h2>
                  <Badge variant="accent" className="font-mono text-xs">{selectedItem.type} Record</Badge>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-text-muted hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-text-muted font-medium">Record Snippet Content:</span>
                <p className="text-text-secondary leading-relaxed bg-surface-2 p-3.5 rounded-xl border border-border/60 font-mono">
                  {selectedItem.snippet}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-surface-2 p-3 rounded-xl border border-border/50">
                  <span className="text-[10px] text-text-muted block">Relevance Match Score</span>
                  <strong className="text-emerald-400 text-xs font-mono mt-0.5 block">{(selectedItem.score || 0.95).toFixed(4)}</strong>
                </div>

                <div className="bg-surface-2 p-3 rounded-xl border border-border/50">
                  <span className="text-[10px] text-text-muted block">Category Metadata</span>
                  <strong className="text-accent-primary text-xs font-mono mt-0.5 block">{selectedItem.category || selectedItem.type}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-end">
              <Button variant="primary" size="sm" onClick={() => setSelectedItem(null)}>
                Close Inspection
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
