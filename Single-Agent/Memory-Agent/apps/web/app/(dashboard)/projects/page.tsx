'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi, normalizeArray } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import ProjectInspectorPanel from '../../../components/ProjectInspectorPanel';
import {
  FolderGit2,
  FolderKanban,
  Plus,
  Search,
  Filter,
  X,
  Edit3,
  Trash2,
  Pin,
  Clock,
  Tag,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Building2,
  FileText,
  ListTodo,
} from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function ProjectsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/memory');
  }, [router]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOption, setSortOption] = useState<string>('recently-updated');
  const [pinnedMap, setPinnedMap] = useState<Record<string, boolean>>({});

  // 250ms Debounce for Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [priority, setPriority] = useState('high');
  const [formError, setFormError] = useState('');

  const queryClient = useQueryClient();

  // Fetch Projects with TanStack Query caching
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchApi('/projects'),
    staleTime: 0,
  });

  // Create Mutation with 0ms Optimistic Updates
  const createMutation = useMutation({
    mutationFn: (newProj: any) =>
      fetchApi('/projects', {
        method: 'POST',
        body: JSON.stringify(newProj),
      }),
    onMutate: async (newProj) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousData = queryClient.getQueryData(['projects']);
      queryClient.setQueryData(['projects'], (old: any) => {
        const oldList = normalizeArray(old);
        const optItem = {
          id: crypto.randomUUID(),
          name: newProj.name,
          code: newProj.code || 'PRJ-NEW',
          description: newProj.description,
          status: newProj.status || 'active',
          priority: newProj.priority || 'high',
          progress: 0,
          updatedAt: 'Just now',
          author: 'You',
        };
        const newList = [optItem, ...oldList];
        return Array.isArray(old) ? newList : { ...old, data: newList };
      });
      return { previousData };
    },
    onError: (err: any, _vars, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['projects'], context.previousData);
      }
      setFormError(err.message || 'Failed to create project.');
    },
    onSuccess: (resData: any) => {
      if (resData?.id) {
        setSelectedProject(resData);
        queryClient.setQueryData(['projects'], (old: any) => {
          const oldList = normalizeArray(old);
          const filtered = oldList.filter((item: any) => item.name !== resData.name && item.id !== resData.id);
          const newList = [resData, ...filtered];
          return Array.isArray(old) ? newList : { ...old, data: newList };
        });
      }
    },
    onSettled: () => {
      setIsCreateModalOpen(false);
      setName('');
      setCode('');
      setDescription('');
      setStatus('active');
      setPriority('high');
      setFormError('');
    },
  });

  // Update Mutation with 0ms Optimistic Updates
  const updateMutation = useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: any }) =>
      fetchApi(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      }),
    onMutate: async ({ id, updatedData }) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousData = queryClient.getQueryData(['projects']);
      queryClient.setQueryData(['projects'], (old: any) => {
        const oldList = normalizeArray(old);
        const newList = oldList.map((item: any) => (item.id === id ? { ...item, ...updatedData, updatedAt: 'Just now' } : item));
        return Array.isArray(old) ? newList : { ...old, data: newList };
      });
      return { previousData };
    },
    onError: (err: any, _vars, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['projects'], context.previousData);
      }
      setFormError(err.message || 'Failed to update project.');
    },
    onSuccess: (resData: any) => {
      if (resData?.id) {
        setSelectedProject(resData);
        queryClient.setQueryData(['projects'], (old: any) => {
          const oldList = normalizeArray(old);
          const newList = oldList.map((item: any) => (item.id === resData.id ? { ...item, ...resData } : item));
          return Array.isArray(old) ? newList : { ...old, data: newList };
        });
      }
    },
    onSettled: () => {
      setEditingProject(null);
      setFormError('');
    },
  });

  // Delete Mutation with 0ms Optimistic Updates
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetchApi(`/projects/${id}`, {
        method: 'DELETE',
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousData = queryClient.getQueryData(['projects']);
      queryClient.setQueryData(['projects'], (old: any) => {
        const oldList = normalizeArray(old);
        const newList = oldList.filter((item: any) => item.id !== id);
        return Array.isArray(old) ? newList : { ...old, data: newList };
      });
      return { previousData };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(['projects'], context.previousData);
      }
    },
    onSuccess: (_res: any, deletedId: string) => {
      queryClient.setQueryData(['projects'], (old: any) => {
        const oldList = normalizeArray(old);
        const newList = oldList.filter((item: any) => item.id !== deletedId);
        return Array.isArray(old) ? newList : { ...old, data: newList };
      });
      setSelectedProject((prev: any) => (prev?.id === deletedId ? null : prev));
    },
    onSettled: () => {},
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Project name is required');
      return;
    }
    setFormError('');
    createMutation.mutate({ name, code, description, status, priority });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (!name.trim()) {
      setFormError('Project name is required');
      return;
    }
    setFormError('');
    updateMutation.mutate({
      id: editingProject.id,
      updatedData: { name, description, status, priority },
    });
  };

  const openEditModal = (proj: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(proj);
    setName(proj.name || '');
    setCode(proj.code || '');
    setDescription(proj.description || '');
    setStatus(proj.status || 'active');
    setPriority(proj.priority || 'high');
    setFormError('');
  };

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const rawProjects = normalizeArray(data);

  const statusColorMap: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
    planning: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20',
    'on-hold': 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20',
    completed: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20',
  };

  const filteredProjects = rawProjects.filter((p: any) => {
    const matchStatus = filterStatus === 'all' || p.status?.toLowerCase() === filterStatus.toLowerCase();
    const q = debouncedSearch.trim().toLowerCase();
    const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="h-full flex gap-3 relative select-none font-sans text-[#111827] dark:text-neutral-100 overflow-hidden"
    >
      {/* Left Container: Fixed Header + Scrollable Project List + Fixed Footer */}
      <div className="flex-1 flex flex-col justify-between min-w-0 h-full overflow-hidden">
        {/* Fixed Top Header & Filter Toolbar Section (shrink-0) */}
        <div className="shrink-0 space-y-3 pb-1">
          {/* Compact Page Header */}
          <PageHeader
            breadcrumb={['Workspace', 'Projects']}
            title="Projects Memory Context"
            description="Scoped memory partitions and task workflows organized by project workspace."
            className="flex flex-col md:flex-row md:items-center justify-between gap-3 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]"
            actions={
              <button
                onClick={() => {
                  setName('');
                  setCode('');
                  setDescription('');
                  setStatus('active');
                  setPriority('high');
                  setFormError('');
                  setIsCreateModalOpen(true);
                }}
                className="h-[36px] px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-none shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            }
          />

          {/* Status Tabs & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] p-1 rounded-xl w-full sm:w-auto overflow-x-auto shadow-sm dark:shadow-none">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'active', label: 'Active' },
                { id: 'planning', label: 'Planning' },
                { id: 'on-hold', label: 'On Hold' },
                { id: 'completed', label: 'Completed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`h-[30px] px-3 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                    filterStatus === tab.id
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
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full h-[34px] pl-8 pr-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="h-[34px] px-3 bg-white dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#202020] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl text-xs font-medium text-[#111827] dark:text-neutral-300 focus:outline-none cursor-pointer"
              >
                <option value="recently-updated">Sort: Recently Updated</option>
                <option value="title">Sort: Project Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scrollable Center Projects Stream List (ONLY THIS SCROLLS) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 my-1.5">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 h-28 animate-pulse bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl">
                  <div className="w-1/3 h-4 bg-gray-200 dark:bg-white/[0.06] rounded mb-2"></div>
                  <div className="w-3/4 h-3 bg-gray-100 dark:bg-white/[0.04] rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-3 shadow-sm dark:shadow-none">
              <FolderKanban className="w-12 h-12 mx-auto text-[#2563EB]/40 dark:text-blue-400/40" />
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">No Projects Found</h3>
              <p className="text-xs text-[#6B7280] dark:text-neutral-400 max-w-sm mx-auto">
                No active, planning, or on-hold project workspace entries match your filter. Create a new project to organize task workflows.
              </p>
              <button
                onClick={() => {
                  setName('');
                  setDescription('');
                  setStatus('active');
                  setFormError('');
                  setIsCreateModalOpen(true);
                }}
                className="mt-2 h-9 px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Project</span>
              </button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-2.5">
                {filteredProjects.map((p: any, idx: number) => {
                  const isSelected = selectedProject?.id === p.id;
                  const isPin = Boolean(pinnedMap[p.id]);
                  const badgeClass = statusColorMap[p.status?.toLowerCase()] || statusColorMap['active'];
                  const projCode = p.code || `PRJ-${String(p.id || idx).slice(0, 4).toUpperCase()}`;
                  const progressVal = p.progress !== undefined ? p.progress : (p.status === 'completed' ? 100 : p.status === 'active' ? 65 : p.status === 'planning' ? 25 : 10);

                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => setSelectedProject({ ...p, code: projCode, progress: progressVal })}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#2563EB]/10 dark:bg-[#2563EB]/15'
                          : 'bg-white dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#1E1E1E] border-[#E5E7EB] dark:border-white/[0.06] shadow-sm dark:shadow-none'
                      }`}
                    >
                      {/* Left Column: Code Badge + Title + Description + Progress Bar */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F6F7F9] dark:bg-white/[0.04] text-[#2563EB] dark:text-blue-300 border border-[#E5E7EB] dark:border-white/[0.06]">
                            {projCode}
                          </span>

                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${badgeClass}`}>
                            {p.status || 'ACTIVE'}
                          </span>

                          <h3 className="text-sm font-bold text-[#111827] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors truncate">
                            {p.name}
                          </h3>
                        </div>

                        <p className="text-xs text-[#6B7280] dark:text-neutral-400 line-clamp-1 leading-relaxed">
                          {p.description || 'Enterprise project workspace for memory context partitions.'}
                        </p>

                        {/* Progress Bar Row */}
                        <div className="flex items-center gap-3 pt-1 max-w-md">
                          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
                            <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${progressVal}%` }}></div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-[#2563EB] dark:text-blue-300">{progressVal}%</span>
                        </div>
                      </div>

                      {/* Right Column: Author + Updated Time + Action Buttons */}
                      <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                        <div className="flex flex-col items-end text-right">
                          <span className="text-[11px] font-mono text-[#6B7280] dark:text-neutral-400">
                            {p.updatedAt || 'Updated 15m ago'}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] font-medium text-[#6B7280] dark:text-neutral-400 mt-0.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[8px] font-bold">A</div>
                            <span>You</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => togglePin(p.id, e)}
                            title={isPin ? 'Unpin' : 'Pin Project'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isPin ? 'text-[#2563EB] bg-blue-500/10' : 'text-[#9CA3AF] dark:text-neutral-500 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06]'
                            }`}
                          >
                            <Pin className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => openEditModal(p, e)}
                            title="Edit Project"
                            className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-neutral-500 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteMutation.mutate(p.id);
                            }}
                            title="Delete Project"
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
          <span>Showing 1-{filteredProjects.length} of {filteredProjects.length} projects</span>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] disabled:opacity-50">
              <ChevronLeft className="w-4 h-4 text-[#111827] dark:text-white" />
            </button>
            <button className="w-7 h-7 rounded-lg bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center">
              1
            </button>
            <button className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06]">
              <ChevronRight className="w-4 h-4 text-[#111827] dark:text-white" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select className="h-7 px-2 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-lg text-xs font-mono text-[#111827] dark:text-neutral-300 focus:outline-none">
              <option>20 / page</option>
              <option>50 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right Inspector Panel */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectInspectorPanel
            key="inspector"
            item={selectedProject}
            onClose={() => setSelectedProject(null)}
            onEdit={(proj) => {
              setEditingProject(proj);
              setName(proj.name || '');
              setCode(proj.code || '');
              setDescription(proj.description || '');
              setStatus(proj.status || 'active');
              setPriority(proj.priority || 'high');
            }}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
        )}
      </AnimatePresence>

      {/* Create Project Modal */}
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
                  <h2 className="text-base font-bold text-[#111827] dark:text-white">Create New Project</h2>
                  <p className="text-xs text-[#6B7280] dark:text-neutral-400">Initialize a project memory context workspace</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-[#6B7280] dark:text-neutral-400 hover:text-black dark:hover:text-white">
                  <X className="w-4 h-4" />
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
                  <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Antigravity Platform Rebuild"
                    className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="planning">Planning</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Project overview, goals, or architectural specs..."
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl p-3 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] resize-none"
                  ></textarea>
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
                    {createMutation.isPending ? 'Saving...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {editingProject && (
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
                  <h2 className="text-base font-bold text-[#111827] dark:text-white">Edit Project Workspace</h2>
                  <p className="text-xs text-[#6B7280] dark:text-neutral-400">Update project attributes and description</p>
                </div>
                <button onClick={() => setEditingProject(null)} className="p-1 text-[#6B7280] dark:text-neutral-400 hover:text-black dark:hover:text-white">
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
                  <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="planning">Planning</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full h-10 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl px-3 text-xs text-[#111827] dark:text-white focus:outline-none"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#111827] dark:text-neutral-300 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl p-3 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB] dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
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
