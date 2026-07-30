'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi, normalizeArray } from '../../../lib/api';
import InspectorPanel from '../../../components/InspectorPanel';
import PageHeader from '../../../components/PageHeader';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import {
  Database,
  Plus,
  Search,
  Filter,
  Clock,
  Tag,
  X,
  Pin,
  Star,
  MoreHorizontal,
  Layers,
  Sparkles,
  Network,
  Building2,
  Check,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FolderKanban,
  Edit3,
  Trash2,
  Archive,
  RotateCcw,
} from 'lucide-react';

export default function MemoryPage() {
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<any | null>(null);
  const [deletingMemory, setDeletingMemory] = useState<any | null>(null);

  const [filterType, setFilterType] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('recently-updated');
  const [pinnedMap, setPinnedMap] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('working');
  const [importanceScore, setImportanceScore] = useState(0.85);
  const [tagsInput, setTagsInput] = useState('embeddings, gemini, configuration');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['memories'],
    queryFn: () => fetchApi('/memory?limit=200'),
    staleTime: 0,
  });

  // Create Mutation with 0ms Optimistic Updates
  const createMutation = useMutation({
    mutationFn: (newMem: any) =>
      fetchApi('/memory', {
        method: 'POST',
        body: JSON.stringify(newMem),
      }),
    onMutate: async (newMem) => {
      await queryClient.cancelQueries({ queryKey: ['memories'] });
      const previousData = queryClient.getQueryData(['memories']);
      queryClient.setQueryData(['memories'], (old: any) => {
        const oldList = normalizeArray(old);
        const optItem = {
          id: crypto.randomUUID(),
          title: newMem.title,
          content: newMem.content,
          type: newMem.type || 'working',
          importanceScore: newMem.importanceScore || 0.85,
          updatedAt: 'Just now',
          author: 'You',
          tags: newMem.tags || [],
        };
        const newList = [optItem, ...oldList];
        return Array.isArray(old) ? newList : { ...old, data: newList };
      });
      return { previousData };
    },
    onError: (err: any, _vars, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['memories'], context.previousData);
      }
      setFormError(err.message || 'Failed to create memory entry.');
    },
    onSuccess: (resData: any) => {
      if (resData?.id) {
        setSelectedMemory(resData);
        queryClient.setQueryData(['memories'], (old: any) => {
          const oldList = normalizeArray(old);
          const filtered = oldList.filter((item: any) => item.title !== resData.title && item.id !== resData.id);
          const newList = [resData, ...filtered];
          return Array.isArray(old) ? newList : { ...old, data: newList };
        });
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
      setIsCreateModalOpen(false);
      setTitle('');
      setContent('');
      setFormError('');
    },
  });

  // Update Mutation with 0ms Optimistic Updates
  const updateMutation = useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: any }) =>
      fetchApi(`/memory/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      }),
    onMutate: async ({ id, updatedData }) => {
      await queryClient.cancelQueries({ queryKey: ['memories'] });
      const previousData = queryClient.getQueryData(['memories']);
      queryClient.setQueryData(['memories'], (old: any) => {
        const oldList = normalizeArray(old);
        const newList = oldList.map((item: any) => (item.id === id ? { ...item, ...updatedData, updatedAt: 'Just now' } : item));
        return Array.isArray(old) ? newList : { ...old, data: newList };
      });
      return { previousData };
    },
    onError: (err: any, _vars, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['memories'], context.previousData);
      }
      setFormError(err.message || 'Failed to update memory entry.');
    },
    onSuccess: (resData: any) => {
      if (resData?.id) {
        setSelectedMemory(resData);
        queryClient.setQueryData(['memories'], (old: any) => {
          const oldList = normalizeArray(old);
          const newList = oldList.map((item: any) => (item.id === resData.id ? { ...item, ...resData } : item));
          return Array.isArray(old) ? newList : { ...old, data: newList };
        });
      }
    },
    onSettled: () => {
      setEditingMemory(null);
      setFormError('');
    },
  });

  // Soft Delete & Permanent Delete Mutation with 0ms Optimistic Updates
  const deleteMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'soft' | 'archive' | 'permanent' }) => {
      if (action === 'permanent') return fetchApi(`/memory/${id}/permanent`, { method: 'DELETE' });
      return fetchApi(`/memory/${id}`, { method: 'DELETE' });
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['memories'] });
      const previousData = queryClient.getQueryData(['memories']);
      queryClient.setQueryData(['memories'], (old: any) => {
        const oldList = normalizeArray(old);
        const newList = oldList.filter((item: any) => item.id !== id);
        return Array.isArray(old) ? newList : { ...old, data: newList };
      });
      return { previousData };
    },
    onError: (_err, _vars, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['memories'], context.previousData);
      }
    },
    onSuccess: (_res: any, vars: any) => {
      const deletedId = vars?.id;
      if (deletedId) {
        queryClient.setQueryData(['memories'], (old: any) => {
          const oldList = normalizeArray(old);
          const newList = oldList.filter((item: any) => item.id !== deletedId);
          return Array.isArray(old) ? newList : { ...old, data: newList };
        });
        setSelectedMemory((prev: any) => (prev?.id === deletedId ? null : prev));
      }
    },
    onSettled: () => {
      setDeletingMemory(null);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || createMutation.isPending) return;
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!content.trim()) {
      setFormError('Content is required');
      return;
    }
    setIsSubmitting(true);
    setFormError('');
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const normalizedType = (type || 'working').replace('-', '_');

    if (type === 'knowledge') {
      fetchApi('/knowledge', {
        method: 'POST',
        body: JSON.stringify({ title, content, category: 'Architecture' }),
      })
        .then((resData: any) => {
          const newMem = {
            id: resData?.id || crypto.randomUUID(),
            title: `Knowledge Base: ${title}`,
            content: `[Category: Architecture]\n${content}`,
            type: 'knowledge',
            importanceScore: 0.9,
            updatedAt: 'Just now',
            author: 'You',
            tags,
          };
          setSelectedMemory(newMem);
          queryClient.setQueryData(['memories'], (old: any) => {
            const oldList = normalizeArray(old);
            const newList = [newMem, ...oldList.filter((m: any) => m.id !== newMem.id)];
            return Array.isArray(old) ? newList : { ...old, data: newList };
          });
          setIsCreateModalOpen(false);
          setTitle('');
          setContent('');
          setFormError('');
        })
        .catch((err: any) => {
          setFormError(err.message || 'Failed to add knowledge article.');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
      return;
    }

    if (type === 'project') {
      fetchApi('/projects', {
        method: 'POST',
        body: JSON.stringify({ name: title, description: content, status: 'active', priority: 'high' }),
      })
        .then((resData: any) => {
          const newMem = {
            id: resData?.id || crypto.randomUUID(),
            title: `Project Initialized: ${title}`,
            content: `Code: ${resData?.code || 'PRJ-NEW'} | Status: active | Priority: high\nDescription: ${content}`,
            type: 'project',
            importanceScore: 0.85,
            updatedAt: 'Just now',
            author: 'You',
            tags,
          };
          setSelectedMemory(newMem);
          queryClient.setQueryData(['memories'], (old: any) => {
            const oldList = normalizeArray(old);
            const newList = [newMem, ...oldList.filter((m: any) => m.id !== newMem.id)];
            return Array.isArray(old) ? newList : { ...old, data: newList };
          });
          setIsCreateModalOpen(false);
          setTitle('');
          setContent('');
          setFormError('');
        })
        .catch((err: any) => {
          setFormError(err.message || 'Failed to create project workspace.');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
      return;
    }

    createMutation.mutate({
      title,
      content,
      type: normalizedType,
      importance: Number(importanceScore) || 0.85,
      pinned: false,
      tags,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMemory) return;
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!content.trim()) {
      setFormError('Content is required');
      return;
    }
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const normalizedType = (type || 'working').replace('-', '_');
    updateMutation.mutate({
      id: editingMemory.id,
      updatedData: {
        title,
        content,
        type: normalizedType,
        importance: Number(importanceScore) || 0.85,
        tags,
      },
    });
  };

  const openEditModal = (m: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMemory(m);
    setTitle(m.title || '');
    setContent(m.content || '');
    setType(m.type || 'working');
    setImportanceScore(m.importanceScore || 0.85);
    setTagsInput(m.tags?.join(', ') || '');
    setFormError('');
  };

  const openDeleteModal = (m: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingMemory(m);
  };

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const rawMemories = normalizeArray(data);

  const typeColorMap: Record<string, string> = {
    working: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20',
    'long-term': 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20',
    'short-term': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
    knowledge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20',
    project: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20',
    episodic: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20',
    semantic: 'bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/20',
    procedural: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20',
  };

  const filteredMemories = rawMemories.filter((m: any) => {
    if (filterType === 'pinned') return Boolean(pinnedMap[m.id]);
    if (filterType === 'archived') return m.status === 'archived';
    if (filterType === 'all') return true;
    const mType = (m.type || 'working').toLowerCase().replace('-', '_');
    const fType = filterType.toLowerCase().replace('-', '_');
    return mType === fType || (fType === 'knowledge' && (mType === 'knowledge' || m.title?.startsWith('Knowledge Base:'))) || (fType === 'project' && (mType === 'project' || m.title?.startsWith('Project Initialized:')));
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="h-full flex gap-3 relative select-none font-sans text-[#111827] dark:text-neutral-100 overflow-hidden"
    >
      {/* Left Container: Fixed Header + Scrollable Memory List + Fixed Footer */}
      <div className="flex-1 flex flex-col justify-between min-w-0 h-full overflow-hidden">
        {/* Fixed Top Header & Filter Toolbar Section (shrink-0) */}
        <div className="shrink-0 space-y-3 pb-1">
          {/* Compact Page Header with Store Memory Action Button */}
          <PageHeader
            breadcrumb={['Workspace', 'Memory']}
            title="Unified Memory Engine"
            description="Centralized autonomous memory partition combining working memories, knowledge base articles, and project workspaces."
            className="flex flex-col md:flex-row md:items-center justify-between gap-3 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]"
            actions={
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setTitle('');
                    setContent('');
                    setType('working');
                    setImportanceScore(0.85);
                    setTagsInput('');
                    setFormError('');
                    setIsCreateModalOpen(true);
                  }}
                  className="h-[36px] px-3.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-none shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Store Memory</span>
                </button>

                <button
                  onClick={() => {
                    setTitle('');
                    setContent('');
                    setType('knowledge');
                    setImportanceScore(0.9);
                    setTagsInput('architecture, guidelines');
                    setFormError('');
                    setIsCreateModalOpen(true);
                  }}
                  className="h-[36px] px-3.5 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-none shrink-0"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Add Knowledge</span>
                </button>

                <button
                  onClick={() => {
                    setTitle('');
                    setContent('');
                    setType('project');
                    setImportanceScore(0.95);
                    setTagsInput('project, workspace');
                    setFormError('');
                    setIsCreateModalOpen(true);
                  }}
                  className="h-[36px] px-3.5 bg-[#F59E0B] hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-none shrink-0"
                >
                  <FolderKanban className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>
            }
          />

          {/* Filter & Sort Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] p-1 rounded-xl w-full sm:w-auto overflow-x-auto shadow-sm dark:shadow-none">
              {[
                { id: 'all', label: 'All Entries' },
                { id: 'working', label: 'Working' },
                { id: 'knowledge', label: 'Knowledge Base' },
                { id: 'project', label: 'Projects' },
                { id: 'long-term', label: 'Long Term' },
                { id: 'short-term', label: 'Short Term' },
                { id: 'pinned', label: 'Pinned' },
                { id: 'archived', label: 'Archived' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`h-[30px] px-3 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    filterType === tab.id
                      ? 'bg-[#2563EB]/15 text-[#2563EB] dark:text-blue-300 border border-[#2563EB]/30'
                      : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right Toolbar Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button className="h-[34px] px-3 bg-white dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#202020] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl text-xs font-medium text-[#111827] dark:text-neutral-300 flex items-center gap-1.5 transition-colors shadow-sm dark:shadow-none">
                <Filter className="w-3.5 h-3.5 text-[#6B7280] dark:text-neutral-400" />
                <span>Filter</span>
              </button>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="h-[34px] px-3 bg-white dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#202020] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl text-xs font-medium text-[#111827] dark:text-neutral-300 focus:outline-none transition-colors shadow-sm dark:shadow-none cursor-pointer"
              >
                <option value="recently-updated">Sort: Recently Updated</option>
                <option value="importance">Sort: Importance Score</option>
                <option value="title">Sort: Title A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scrollable Center Memory Details List (ONLY THIS SCROLLS) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 my-1.5">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 animate-pulse bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl"></div>
              ))}
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-3 shadow-sm dark:shadow-none">
              <Database className="w-12 h-12 mx-auto text-[#2563EB]/40 dark:text-blue-400/40" />
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">No Memory Entries Found</h3>
              <p className="text-xs text-[#6B7280] dark:text-neutral-400 max-w-sm mx-auto">
                No active working, long-term, or short-term memory records match your current filter. Store a memory entry to begin logging.
              </p>
              <button
                onClick={() => {
                  setTitle('');
                  setContent('');
                  setType('working');
                  setImportanceScore(0.85);
                  setFormError('');
                  setIsCreateModalOpen(true);
                }}
                className="mt-2 h-9 px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Store First Memory</span>
              </button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-2.5">
                {filteredMemories.map((m: any) => {
                  const isSelected = selectedMemory?.id === m.id;
                  const isPin = Boolean(pinnedMap[m.id]);
                  const badgeClass = typeColorMap[m.type?.toLowerCase()] || typeColorMap['working'];

                  return (
                    <motion.div
                      key={m.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setSelectedMemory(m)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#2563EB]/10 dark:bg-[#2563EB]/15'
                          : 'bg-white dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#1E1E1E] border-[#E5E7EB] dark:border-white/[0.06] shadow-sm dark:shadow-none'
                      }`}
                    >
                      {/* Left Column: Type Pill + Title + Excerpt + Tags */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${badgeClass}`}>
                            {m.type || 'WORKING'}
                          </span>
                          <h3 className="text-sm font-bold text-[#111827] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors truncate">
                            {m.title}
                          </h3>
                        </div>

                        <p className="text-xs text-[#6B7280] dark:text-neutral-400 line-clamp-1 leading-relaxed">
                          {m.content}
                        </p>

                        {/* Entity Tags */}
                        {m.tags && m.tags.length > 0 && (
                          <div className="flex items-center gap-1 pt-0.5">
                            {m.tags.slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#F6F7F9] dark:bg-white/[0.04] text-[#6B7280] dark:text-neutral-400 border border-[#E5E7EB] dark:border-white/[0.06]"
                              >
                                #{tag}
                              </span>
                            ))}
                            {m.tags.length > 3 && (
                              <span className="text-[10px] font-mono text-[#6B7280] dark:text-neutral-500">
                                +{m.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Column: Score + Updated Time + Author + Action Buttons */}
                      <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                        <div className="flex flex-col items-end text-right">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{m.importanceScore || '0.85'}</span>
                          </div>
                          <span className="text-[11px] font-mono text-[#6B7280] dark:text-neutral-400">
                            {m.updatedAt || 'Updated 2h ago'}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-medium text-[#6B7280] dark:text-neutral-400 mt-0.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[8px] font-bold">A</div>
                            <span>You</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => togglePin(m.id, e)}
                            title={isPin ? 'Unpin' : 'Pin Memory'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isPin ? 'text-[#2563EB] bg-blue-500/10' : 'text-[#9CA3AF] dark:text-neutral-500 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06]'
                            }`}
                          >
                            <Pin className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => openEditModal(m, e)}
                            title="Edit Memory"
                            className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-neutral-500 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => openDeleteModal(m, e)}
                            title="Delete Memory"
                            className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Fixed Bottom Pagination Footer Bar (shrink-0) */}
        <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2.5 border-t border-[#E5E7EB] dark:border-white/[0.06] text-xs text-[#6B7280] dark:text-neutral-400 font-mono bg-white dark:bg-[#090909] z-10">
          <span>Showing {filteredMemories.length > 0 ? 1 : 0}-{filteredMemories.length} of {filteredMemories.length} memories</span>

          <div className="flex items-center gap-1">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] disabled:opacity-50">
              <ChevronLeft className="w-4 h-4 text-[#111827] dark:text-white" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center">
              {page}
            </button>
            <button onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06]">
              <ChevronRight className="w-4 h-4 text-[#111827] dark:text-white" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select className="h-7 px-2 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-lg text-xs font-mono text-[#111827] dark:text-neutral-300 focus:outline-none">
              <option>20 / page</option>
              <option>50 / page</option>
              <option>100 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right Inspector Panel */}
      <AnimatePresence>
        {selectedMemory && (
          <InspectorPanel
            key="inspector"
            item={selectedMemory}
            onClose={() => setSelectedMemory(null)}
            onEdit={(item) => {
              setEditingMemory(item);
              setTitle(item.title || '');
              setContent(item.content || '');
              setType(item.type || 'working');
              setImportanceScore(item.importanceScore || 0.85);
              setTagsInput(item.tags?.join(', ') || '');
            }}
            onDelete={(item) => setDeletingMemory(item)}
          />
        )}
      </AnimatePresence>

      {/* Reusable Enterprise Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingMemory)}
        item={deletingMemory}
        moduleName="Memory"
        onClose={() => setDeletingMemory(null)}
        isPending={deleteMutation.isPending}
        onConfirm={({ action }) => {
          if (deletingMemory) {
            deleteMutation.mutate({ id: deletingMemory.id, action });
          }
        }}
      />

      {/* Create Memory Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="p-6 w-full max-w-lg space-y-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl shadow-2xl text-[#111827] dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#111827] dark:text-white">
                    {type === 'knowledge' ? 'Add Knowledge Article' : type === 'project' ? 'Create Project Workspace' : 'Store New Memory'}
                  </h2>
                  <p className="text-xs text-[#6B7280] dark:text-neutral-400">
                    {type === 'knowledge'
                      ? 'Index domain knowledge & architectural guidelines into vector memory'
                      : type === 'project'
                      ? 'Initialize a dedicated project workspace partition'
                      : 'Create a validated knowledge item for AI retrieval'}
                  </p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-[#6B7280] dark:text-neutral-400 hover:text-black dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Category Quick Tabs */}
              <div className="flex items-center gap-1 bg-[#F6F7F9] dark:bg-[#111111] p-1 rounded-xl border border-[#E5E7EB] dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setType('working')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    type !== 'knowledge' && type !== 'project'
                      ? 'bg-white dark:bg-[#1C1C1C] text-[#2563EB] dark:text-blue-300 shadow-sm'
                      : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Memory</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('knowledge')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    type === 'knowledge'
                      ? 'bg-white dark:bg-[#1C1C1C] text-[#6366F1] dark:text-indigo-300 shadow-sm'
                      : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Knowledge</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('project')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    type === 'project'
                      ? 'bg-white dark:bg-[#1C1C1C] text-[#F59E0B] dark:text-amber-300 shadow-sm'
                      : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white'
                  }`}
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Project</span>
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/50 rounded-xl text-xs text-[#DC2626] dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Gemini Text-Embedding-004 Configuration Specs"
                    className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Content Body *</label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Detailed knowledge string, architectural decisions, or instructions..."
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl p-3 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Memory Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none"
                    >
                      <option value="working">Working Memory</option>
                      <option value="knowledge">Knowledge Base Article</option>
                      <option value="project">Project Memory</option>
                      <option value="long-term">Long-Term Memory</option>
                      <option value="short-term">Short-Term Memory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Importance Score</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={importanceScore}
                      onChange={(e) => setImportanceScore(parseFloat(e.target.value))}
                      className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="embeddings, gemini, configuration"
                    className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB] dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="h-10 px-4 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl font-medium text-[#6B7280] dark:text-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="h-10 px-5 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-none"
                  >
                    {createMutation.isPending ? 'Saving...' : 'Store Memory'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Memory Modal */}
      <AnimatePresence>
        {editingMemory && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="p-6 w-full max-w-lg space-y-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl shadow-2xl text-[#111827] dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#111827] dark:text-white">Edit Memory Entry</h2>
                  <p className="text-xs text-[#6B7280] dark:text-neutral-400">Update memory properties and content body</p>
                </div>
                <button onClick={() => setEditingMemory(null)} className="p-1 text-[#6B7280] dark:text-neutral-400 hover:text-black dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/50 rounded-xl text-xs text-[#DC2626] dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Content Body *</label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl p-3 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Memory Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none"
                    >
                      <option value="working">Working Memory</option>
                      <option value="long-term">Long-Term Memory</option>
                      <option value="short-term">Short-Term Memory</option>
                      <option value="project">Project Memory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Importance Score</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={importanceScore}
                      onChange={(e) => setImportanceScore(parseFloat(e.target.value))}
                      className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="embeddings, gemini, configuration"
                    className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB] dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setEditingMemory(null)}
                    className="h-10 px-4 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl font-medium text-[#6B7280] dark:text-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="h-10 px-5 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-none"
                  >
                    {updateMutation.isPending ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
