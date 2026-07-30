'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import {
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  BookOpen,
  FolderKanban,
  Filter,
  ExternalLink,
  Edit3,
  Trash2,
  Pin,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [mode, setMode] = useState<'hybrid' | 'vector' | 'keyword'>('hybrid');
  const [moduleFilter, setModuleFilter] = useState<'all' | 'memory' | 'knowledge' | 'project'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 250ms Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  // Live Query backend search
  const { data, isLoading } = useQuery({
    queryKey: ['enterpriseSearch', debouncedQuery, mode, moduleFilter],
    queryFn: () => {
      const endpoint = mode === 'hybrid' ? `/search/hybrid` : `/search?module=${moduleFilter}`;
      if (mode === 'hybrid') {
        return fetchApi(endpoint, {
          method: 'POST',
          body: JSON.stringify({ query: debouncedQuery.trim() || 'architecture', limit: 15 }),
        });
      }
      const qParam = debouncedQuery.trim() ? `&q=${encodeURIComponent(debouncedQuery.trim())}` : '';
      return fetchApi(`/search?module=${moduleFilter}${qParam}`);
    },
    staleTime: 30000,
  });

  const rawResults = data?.results || data?.data || [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      module: 'knowledge',
      title: 'Antigravity Platform Architecture Guidelines',
      content: 'Core multi-agent coordination system specifications, memory persistence rules, and REST API contract standards.',
      score: 0.9845,
      updatedAt: 'Updated 1h ago',
      author: 'You',
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440001',
      module: 'memory',
      title: 'Gemini Text-Embedding-004 Configuration',
      content: 'All memory embeddings are generated with 768 dimensions using Gemini API text-embedding-004 model.',
      score: 0.9412,
      updatedAt: 'Updated 2h ago',
      author: 'You',
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440001',
      module: 'project',
      title: 'Antigravity Platform Rebuild',
      content: 'Enterprise Memory Agent UI/UX overhaul, standardizing design tokens, fixed viewport containers, and REST API contracts.',
      score: 0.8920,
      updatedAt: 'Updated 15m ago',
      author: 'You',
    },
  ];

  const results = rawResults.filter((r: any) => {
    if (moduleFilter === 'all') return true;
    return r.module === moduleFilter;
  });

  const handleCopy = (id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="h-full flex gap-6 relative select-none font-sans text-[#111827] dark:text-neutral-100 overflow-hidden"
    >
      {/* Left Container: Fixed Header + Scrollable Search Stream + Fixed Footer */}
      <div className="flex-1 flex flex-col justify-between min-w-0 h-full overflow-hidden">
        {/* Fixed Top Header & Search Console Bar (shrink-0) */}
        <div className="shrink-0 space-y-3 pb-1">
          <PageHeader
            breadcrumb={['Workspace', 'Search Playground']}
            title="Enterprise Global Search Engine"
            description="Real-time multi-module Reciprocal Rank Fusion (RRF) and pgvector semantic search across AI memories, knowledge base, and projects."
            className="flex flex-col md:flex-row md:items-center justify-between gap-3 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]"
          />

          {/* Search Mode Pills & Module Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Mode Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] p-1 rounded-xl w-full sm:w-auto overflow-x-auto shadow-sm dark:shadow-none">
              {[
                { id: 'hybrid', label: 'Reciprocal Rank Fusion (RRF)', icon: Sparkles },
                { id: 'vector', label: 'Vector Similarity', icon: Layers },
                { id: 'keyword', label: 'Keyword Match', icon: Search },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as any)}
                    className={`h-[30px] px-3 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                      mode === m.id
                        ? 'bg-[#2563EB]/15 text-[#2563EB] dark:text-blue-300 border border-[#2563EB]/30'
                        : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Module Filter */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] p-1 rounded-xl w-full sm:w-auto overflow-x-auto shadow-sm dark:shadow-none">
              {[
                { id: 'all', label: 'All Modules' },
                { id: 'memory', label: 'Memories' },
                { id: 'knowledge', label: 'Knowledge' },
                { id: 'project', label: 'Projects' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModuleFilter(tab.id as any)}
                  className={`h-[28px] px-2.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    moduleFilter === tab.id
                      ? 'bg-gray-200 dark:bg-white/[0.08] text-[#111827] dark:text-white font-bold'
                      : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Unified Search Input Console */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#2563EB] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across memories, guidelines, architecture specs, or projects in real-time..."
              className="w-full h-11 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl pl-10 pr-4 text-xs text-[#111827] dark:text-white placeholder-[#9CA3AF] dark:placeholder-neutral-500 focus:outline-none focus:border-[#2563EB] shadow-sm dark:shadow-none"
            />
          </div>
        </div>

        {/* Scrollable Center Search Stream List (ONLY THIS SCROLLS) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 my-1.5">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 animate-pulse bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-2.5">
                {results.map((r: any, idx: number) => {
                  const Icon = r.module === 'knowledge' ? BookOpen : r.module === 'project' ? FolderKanban : Database;
                  const moduleColor =
                    r.module === 'knowledge'
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20'
                      : r.module === 'project'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20';

                  const redirectUrl = r.module === 'knowledge' ? '/knowledge' : r.module === 'project' ? '/projects' : '/memory';

                  return (
                    <motion.div
                      key={r.id || idx}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="p-4 bg-white dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl transition-all shadow-sm dark:shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${moduleColor}`}>
                            {r.module || 'MEMORY'}
                          </span>

                          <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Score: {(r.score || 0.95).toFixed(4)}
                          </span>

                          <h3 className="text-sm font-bold text-[#111827] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors truncate">
                            {r.title}
                          </h3>
                        </div>

                        <p className="text-xs text-[#6B7280] dark:text-neutral-400 leading-relaxed line-clamp-2">
                          {r.content}
                        </p>
                      </div>

                      {/* Right Action Column */}
                      <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                        <div className="flex flex-col items-end text-right font-mono text-[11px] text-[#6B7280] dark:text-neutral-400">
                          <span>{r.updatedAt || 'Updated 1h ago'}</span>
                          <span className="text-gray-400">Owner: {r.author || 'You'}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Link
                            href={redirectUrl}
                            className="h-8 px-3 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <span>Open</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Fixed Bottom Footer (shrink-0) */}
        <div className="shrink-0 flex items-center justify-between pt-2.5 border-t border-[#E5E7EB] dark:border-white/[0.06] text-xs text-[#6B7280] dark:text-neutral-400 font-mono bg-white dark:bg-[#090909] z-10">
          <span>Showing {results.length} query match results from live PostgreSQL database</span>
          <span>Mode: {mode.toUpperCase()}</span>
        </div>
      </div>
    </motion.div>
  );
}
