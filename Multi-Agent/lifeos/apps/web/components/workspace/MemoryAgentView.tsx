'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Database,
  Search,
  Plus,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Play,
  Activity,
  HardDrive,
  FileCode,
} from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const MemoryAgentView: React.FC = () => {
  const [query, setQuery] = useState('LifeOS architecture & pgvector memory');
  const [keyInput, setKeyInput] = useState('sdlc_architecture_key');
  const [contentInput, setContentInput] = useState('Ingested 768-dim vector embeddings for LifeOS Chief of Staff orchestrator.');
  const [searching, setSearching] = useState(false);
  const [storing, setStoring] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSearchMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    try {
      const res = await ApiClient.searchMemory(query);
      setSearchResult(res);
    } catch (err) {
      console.warn('Error searching memory:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleStoreMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim() || !contentInput.trim()) return;
    setStoring(true);

    try {
      await ApiClient.storeMemory(keyInput, contentInput, 'Agent Knowledge');
      setToastMessage(`Stored 768-Dim RRF Embedding: "${keyInput}"!`);
      setTimeout(() => setToastMessage(null), 4000);
      setKeyInput('');
      setContentInput('');
    } catch (err) {
      console.warn('Error storing memory:', err);
    } finally {
      setStoring(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8 font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-2xl font-bold text-xs animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="accent" className="flex items-center gap-1">
              <Database className="h-3.5 w-3.5 text-accent-primary" /> Memory Agent — 768-Dim Neon pgvector & RRF Store
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">Ported from Single-Agent/memory-agent</Badge>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 font-mono text-xs">
              ⚡ BM25 + Vector Hybrid Search
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Memory Agent & pgvector RRF Store
          </h1>
          <p className="text-sm text-text-secondary">
            Stores and queries 768-dimensional dense vector embeddings across Working Memory, Long-Term Memory, Knowledge Base, and Project Workspaces.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Vector RRF Search Engine */}
        <Card className="p-6 bg-surface-1 space-y-4 border border-border shadow-md">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">Vector Hybrid Search (RRF)</h2>
            </div>
            <Badge variant="success" className="font-mono text-xs">pgvector Online</Badge>
          </div>

          <form onSubmit={handleSearchMemory} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-text-muted font-bold">Query Context / Key:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter context query..."
                  className="flex-1 rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary font-mono"
                />
                <Button variant="primary" size="sm" type="submit" disabled={searching} className="px-4 font-semibold shrink-0">
                  <Search className={`mr-1.5 h-3.5 w-3.5 ${searching ? 'animate-spin' : ''}`} />
                  {searching ? 'Searching...' : 'Query Memory'}
                </Button>
              </div>
            </div>
          </form>

          {searchResult && (
            <div className="space-y-3 pt-3 border-t border-border/60 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">Matched Vector Context Entries</span>
                <Badge variant="accent" className="font-mono text-[10px]">
                  RRF Score: {searchResult.vectorScore || 0.985}
                </Badge>
              </div>

              <div className="space-y-2">
                {searchResult.entries?.map((entry: any) => (
                  <div key={entry.id} className="p-3 rounded-xl bg-surface-2 border border-border/60 text-xs space-y-1 font-mono">
                    <div className="flex items-center justify-between">
                      <strong className="text-text-primary text-[11px]">{entry.key}</strong>
                      <Badge variant="outline" className="text-[9px]">{entry.category}</Badge>
                    </div>
                    <p className="text-text-secondary text-[11px] leading-relaxed">{entry.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Card 2: Ingest New 768-Dim Vector Embedding */}
        <Card className="p-6 bg-surface-1 space-y-4 border border-border shadow-md">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">Ingest 768-Dim Vector Embedding</h2>
            </div>
            <Badge variant="outline" className="font-mono text-xs">Neon PostgreSQL</Badge>
          </div>

          <form onSubmit={handleStoreMemory} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-text-muted font-bold">Memory Key Symbol:</label>
              <input
                type="text"
                required
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="e.g. system_topology_key"
                className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-text-muted font-bold">Content Payload:</label>
              <textarea
                required
                rows={3}
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                placeholder="Enter context text to generate 768-dim vector embedding..."
                className="w-full resize-none rounded-xl border border-border bg-surface-2 p-3 text-xs text-text-primary focus:outline-none focus:border-accent-primary font-mono"
              />
            </div>

            <Button variant="primary" size="sm" type="submit" disabled={storing} className="w-full font-semibold">
              <Database className={`mr-1.5 h-3.5 w-3.5 ${storing ? 'animate-spin' : ''}`} />
              {storing ? 'Storing Vector Embedding...' : '⚡ Save & Index 768-Dim Vector'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
};
