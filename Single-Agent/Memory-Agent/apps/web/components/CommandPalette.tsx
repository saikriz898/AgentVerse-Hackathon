'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi } from '../lib/api';
import {
  Search,
  Database,
  BookOpen,
  FolderKanban,
  X,
  History,
  ArrowRight,
  Sparkles,
  Command,
  ChevronRight,
} from 'lucide-react';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Gemini text-embedding-004',
    'Antigravity Platform Architecture',
    'JWT Authentication Specs',
  ]);

  const router = useRouter();

  // 250ms Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  // Global Keyboard Listener (Ctrl+K / Cmd+K / Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Live Search Results from Backend
  const { data: searchData, isLoading } = useQuery({
    queryKey: ['globalSearch', debouncedQuery],
    queryFn: () => {
      if (!debouncedQuery.trim()) return Promise.resolve({ results: [] });
      return fetchApi(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
    },
    enabled: isOpen && debouncedQuery.trim().length > 0,
    staleTime: 30000,
  });

  const results = searchData?.results || [];

  const handleSelect = (item: any) => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev.slice(0, 4)]);
    }

    setIsOpen(false);
    if (item.module === 'knowledge') {
      router.push('/knowledge');
    } else if (item.module === 'project') {
      router.push('/projects');
    } else {
      router.push('/memory');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-start justify-center pt-20 px-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden font-sans text-[#111827] dark:text-white"
        >
          {/* Top Search Input Row */}
          <div className="flex items-center px-4 py-3 border-b border-[#E5E7EB] dark:border-white/[0.06] bg-[#F6F7F9]/50 dark:bg-[#111111]/50">
            <Search className="w-5 h-5 text-[#2563EB] mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search memories, knowledge base, projects... (Ctrl+K)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="w-full bg-transparent text-sm font-medium text-[#111827] dark:text-white focus:outline-none placeholder-[#9CA3AF] dark:placeholder-neutral-500"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-white mr-2">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded bg-gray-200 dark:bg-white/[0.06] text-[10px] font-mono text-gray-500 dark:text-neutral-400 border border-gray-300 dark:border-white/[0.08]">
              ESC
            </kbd>
          </div>

          {/* Results Body */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-3">
            {isLoading ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-[#6B7280] dark:text-neutral-400 font-mono">Querying live backend vector search...</p>
              </div>
            ) : query.trim().length > 0 ? (
              results.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Search className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-xs font-semibold text-[#111827] dark:text-white">No matching entries found</p>
                  <p className="text-xs text-[#6B7280] dark:text-neutral-400">Try searching for keywords like "embedding", "architecture", or "auth"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h4 className="text-[10px] font-mono uppercase text-[#6B7280] dark:text-neutral-500 px-2 pb-1 font-semibold">
                    Global Results ({results.length})
                  </h4>
                  {results.map((item: any, idx: number) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = item.module === 'knowledge' ? BookOpen : item.module === 'project' ? FolderKanban : Database;
                    return (
                      <div
                        key={item.id || idx}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-[#2563EB]/10 dark:bg-[#2563EB]/20 border border-[#2563EB]/30'
                            : 'hover:bg-[#F6F7F9] dark:hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="truncate space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 font-bold border border-blue-500/20">
                                {item.module}
                              </span>
                              <h3 className="text-xs font-bold text-[#111827] dark:text-white truncate">
                                {item.title}
                              </h3>
                            </div>
                            <p className="text-[11px] text-[#6B7280] dark:text-neutral-400 truncate">
                              {item.content}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Recent Searches & Suggested Quick Queries */
              <div className="space-y-4 p-1">
                {recentSearches.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#6B7280] dark:text-neutral-500 font-semibold px-1">
                      <span className="flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" /> Recent Searches
                      </span>
                      <button onClick={() => setRecentSearches([])} className="hover:text-rose-500 transition-colors">Clear</button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="px-2.5 py-1 bg-[#F6F7F9] dark:bg-white/[0.04] hover:bg-[#2563EB]/15 hover:text-[#2563EB] border border-[#E5E7EB] dark:border-white/[0.06] rounded-lg text-xs font-medium text-[#6B7280] dark:text-neutral-300 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#6B7280] dark:text-neutral-500 font-semibold px-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> Suggested Quick Commands
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { title: 'Search Memories', sub: 'RRF & Hybrid Retrieval', href: '/search' },
                      { title: 'Knowledge Base', sub: 'Architectural Specs', href: '/knowledge' },
                      { title: 'Project Workspaces', sub: 'Scoped Contexts', href: '/projects' },
                      { title: 'Trash Vault', sub: 'Soft-Deleted Items', href: '/trash' },
                    ].map((cmd) => (
                      <div
                        key={cmd.title}
                        onClick={() => {
                          setIsOpen(false);
                          router.push(cmd.href);
                        }}
                        className="p-2.5 rounded-xl border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F6F7F9] dark:hover:bg-white/[0.04] cursor-pointer transition-colors"
                      >
                        <div className="font-bold text-[#111827] dark:text-white">{cmd.title}</div>
                        <div className="text-[10px] text-[#6B7280] dark:text-neutral-400 font-mono">{cmd.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2 border-t border-[#E5E7EB] dark:border-white/[0.06] bg-[#F6F7F9]/50 dark:bg-[#111111]/50 text-[11px] font-mono text-[#6B7280] dark:text-neutral-400 flex items-center justify-between">
            <span>Press <kbd className="font-bold text-[#111827] dark:text-white">↑</kbd> <kbd className="font-bold text-[#111827] dark:text-white">↓</kbd> to navigate</span>
            <span><kbd className="font-bold text-[#111827] dark:text-white">ENTER</kbd> to open</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
