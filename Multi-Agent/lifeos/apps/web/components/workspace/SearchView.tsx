'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Sparkles, Database, FileText, FolderKanban } from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const SearchView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await ApiClient.universalSearch(query);
      setResults(data.results || []);
    } catch (err) {
      console.warn('Universal Search API fallback...', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Universal Index Search</Badge>
            <Badge variant="outline" className="font-mono">Global Registry</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Search Engine
          </h1>
          <p className="text-sm text-text-secondary">
            Search indexed Projects, Tasks, Artifacts, Vector Memory, and System Audit Logs.
          </p>
        </div>
      </div>

      {/* Big Search Form */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all projects, vector memory, artifacts, or code specs..."
            className="w-full rounded-2xl border border-border bg-surface-2 pl-12 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-luxury shadow-inner"
          />
        </div>
        <Button variant="primary" size="md" type="submit" disabled={loading}>
          <Sparkles className="mr-2 h-4 w-4" /> Universal Search
        </Button>
      </form>

      {/* Search Results Catalog */}
      {searched && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-text-primary">Search Results ({results.length})</h2>

          {results.length === 0 && !loading && (
            <Card className="p-8 text-center text-xs text-text-muted">
              No matching records found for "{query}". Try a different keyword or vector query.
            </Card>
          )}

          <div className="space-y-3">
            {results.map((res) => (
              <Card key={res.id} className="p-5 bg-surface-1 space-y-2 border border-border hover:border-accent-primary/60 transition-luxury">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {res.type === 'Artifact' ? (
                      <FileText className="h-4 w-4 text-emerald-400" />
                    ) : res.type === 'Memory' ? (
                      <Database className="h-4 w-4 text-indigo-400" />
                    ) : (
                      <FolderKanban className="h-4 w-4 text-accent-primary" />
                    )}
                    <span className="font-bold text-sm text-text-primary">{res.title}</span>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {res.type} • Score: {(res.score || 0.95).toFixed(2)}
                  </Badge>
                </div>
                <p className="text-xs text-text-secondary font-mono leading-relaxed bg-surface-secondary p-3 rounded-xl border border-border/40">
                  {res.snippet}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};
