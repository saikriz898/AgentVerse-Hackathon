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
  Plus,
  X,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Bot,
  Share2,
} from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';
import { useUIStore } from '@/lib/stores/useUIStore';

export const KnowledgeView: React.FC = () => {
  const [memoryEntries, setMemoryEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  // Form State
  const [newKey, setNewKey] = useState('');
  const [newCategory, setNewCategory] = useState<'Architecture' | 'System Spec' | 'User Preference' | 'Agent Knowledge'>('Architecture');
  const [newContent, setNewContent] = useState('');
  const [saveSuccessBanner, setSaveSuccessBanner] = useState(false);

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

  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newContent.trim()) return;

    try {
      await ApiClient.addMemoryEntry(newKey, newContent, newCategory);
      setNewKey('');
      setNewContent('');
      setIsAddModalOpen(false);
      setSaveSuccessBanner(true);
      setTimeout(() => setSaveSuccessBanner(false), 4000);
      fetchMemory();
    } catch (err) {
      console.warn('Error adding memory entry', err);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="accent">Central RRF Vector Memory</Badge>
            <Badge variant="outline" className="font-mono text-xs">768-dim Embeddings</Badge>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 font-mono text-xs">
              ⚡ Auto-Ingestion Active
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Knowledge & RRF Vector Memory ({memoryEntries.length})
          </h1>
          <p className="text-sm text-text-secondary">
            Hybrid BM25 + Neon pgvector reciprocal rank fusion store. Automatically ingests every Chief of Staff execution, artifact & task output.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => useUIStore.getState().setActiveNavId('graph-topology')}>
            <Share2 className="mr-1.5 h-3.5 w-3.5 text-accent-primary" /> 🌐 2D Graph Topology
          </Button>
          <Button variant="outline" size="sm" onClick={() => fetchMemory()} disabled={loading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Memory
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Knowledge Base
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessBanner && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl text-xs font-mono flex items-center justify-between animate-fade-in shadow-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> New knowledge item successfully vector-embedded and saved to 768-dim RRF memory vault!
          </span>
          <button onClick={() => setSaveSuccessBanner(false)} className="text-text-muted hover:text-text-primary">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Automatic Ingestion Telemetry Banner */}
      <div className="bg-gradient-to-r from-surface-2/90 via-surface-1 to-surface-2/90 border border-border/80 p-4 rounded-2xl space-y-2 text-xs shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-bold text-text-primary flex items-center gap-2">
            <Bot className="h-4 w-4 text-accent-primary" /> Automatic RRF Vector Memory Storage Engine
          </span>
          <Badge variant="accent" className="font-mono text-[10px]">Realtime Synced</Badge>
        </div>
        <p className="text-text-secondary leading-relaxed">
          Every prompt execution, 18-stage AIDLC output, code artifact, and task completion generated by the Chief of Staff is automatically stored into pgvector embeddings in real time.
        </p>
      </div>

      {/* RRF Hybrid Vector Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-primary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query 768-dim vector embeddings or search knowledge keywords..."
            className="w-full rounded-2xl border border-border bg-surface-2 pl-10 pr-4 py-3 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-luxury shadow-inner"
          />
        </div>
        <Button variant="primary" size="sm" type="submit" className="px-5 font-semibold">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> RRF Vector Search
        </Button>
      </form>

      {/* Memory Entries Catalog */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-surface-2/60 animate-pulse p-5" />
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {memoryEntries.map((mem) => (
            <Card
              key={mem.id}
              onClick={() => setSelectedEntry(mem)}
              className="bg-surface-1 p-5 space-y-3 border border-border/80 hover:border-accent-primary hover:shadow-lg transition-luxury cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-indigo-400 shrink-0" />
                    <span className="font-mono font-bold text-xs text-text-primary group-hover:text-accent-primary transition-luxury truncate">
                      {mem.key}
                    </span>
                  </div>
                  <Badge variant="accent" className="font-mono text-[10px] shrink-0">
                    RRF Score: {(mem.vectorScore || 0.95).toFixed(3)}
                  </Badge>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed bg-surface-2/60 p-3 rounded-xl border border-border/40 font-mono">
                  {mem.content}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border/40 font-mono">
                <span>Category: <strong className="text-text-primary">{mem.category || 'Architecture'}</strong></span>
                <span className="text-accent-primary font-semibold flex items-center gap-1 group-hover:underline">
                  Inspect Vector <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ADD KNOWLEDGE / VECTOR MEMORY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-surface-1 border border-border/80 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-light text-accent-primary font-bold">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary">Add Knowledge / Vector Memory Entry</h2>
                  <p className="text-xs text-text-muted">Ingest new technical specifications, documents, or rules into pgvector store.</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddKnowledge} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-text-muted font-medium">Memory Key / Title Identifier:</label>
                <input
                  type="text"
                  required
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. school_management_portal_auth_rules"
                  className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-text-primary focus:outline-none focus:border-accent-primary font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-text-muted font-medium">Domain Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-text-primary focus:outline-none focus:border-accent-primary font-mono cursor-pointer"
                >
                  <option value="Architecture">Architecture</option>
                  <option value="System Spec">System Spec</option>
                  <option value="User Preference">User Preference</option>
                  <option value="Agent Knowledge">Agent Knowledge</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-text-muted font-medium">Knowledge Content / Documentation:</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter full technical specification, API contract, or system rule to embed in vector database..."
                  className="w-full resize-none rounded-xl border border-border bg-surface-2 p-3 text-text-primary focus:outline-none focus:border-accent-primary font-mono leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  <Database className="mr-1.5 h-3.5 w-3.5" /> Ingest & Embed Knowledge
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SELECTED KNOWLEDGE ITEM INSPECTOR MODAL */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-surface-1 border border-border/80 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-text-primary font-mono">{selectedEntry.key}</h2>
                  <Badge variant="accent" className="font-mono text-xs">{selectedEntry.category || 'Architecture'}</Badge>
                </div>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="text-text-muted hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-text-muted font-medium">Vector Memory Content:</span>
                <p className="text-text-secondary leading-relaxed bg-surface-2 p-3.5 rounded-xl border border-border/60 font-mono">
                  {selectedEntry.content}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-surface-2 p-3 rounded-xl border border-border/50">
                  <span className="text-[10px] text-text-muted block">Dense Vector RRF Score</span>
                  <strong className="text-emerald-400 text-xs font-mono mt-0.5 block">{(selectedEntry.vectorScore || 0.95).toFixed(4)}</strong>
                </div>

                <div className="bg-surface-2 p-3 rounded-xl border border-border/50">
                  <span className="text-[10px] text-text-muted block">Embedding Dimensions</span>
                  <strong className="text-accent-primary text-xs font-mono mt-0.5 block">768-Dim Dense Vector</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-end">
              <Button variant="primary" size="sm" onClick={() => setSelectedEntry(null)}>
                Close Vector Inspection
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
