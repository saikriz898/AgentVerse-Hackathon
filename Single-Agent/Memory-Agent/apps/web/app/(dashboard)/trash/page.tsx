'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApi, normalizeArray } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import {
  Trash2,
  RotateCcw,
  Search,
  Check,
  Database,
  BookOpen,
  FolderKanban,
  CheckSquare,
  Square,
  AlertTriangle,
  X,
  Loader2,
} from 'lucide-react';

export default function TrashPage() {
  const [activeTab, setActiveTab] = useState<'memories' | 'knowledge' | 'projects'>('memories');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [targetPurgeIds, setTargetPurgeIds] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Query soft-deleted items from backend
  const { data: memoriesData, isLoading: isLoadingMemories } = useQuery({
    queryKey: ['deletedMemories', activeTab],
    queryFn: () => fetchApi(`/memory?deleted=true`),
    staleTime: 5000,
  });

  const deletedList = normalizeArray(memoriesData);

  // Filter list by search term
  const filteredList = deletedList.filter((item: any) => {
    const title = item.title || item.name || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Restore Single/Bulk Mutation
  const restoreMutation = useMutation({
    mutationFn: (ids: string[]) => {
      if (ids.length === 1) {
        return fetchApi(`/memory/${ids[0]}/restore`, { method: 'POST' });
      }
      return fetchApi('/bulk/restore', {
        method: 'POST',
        body: JSON.stringify({ ids, type: 'memory' }),
      });
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['deletedMemories'] });
      setSelectedIds([]);
      setFeedbackMsg(`Successfully restored ${ids.length} item(s).`);
      setTimeout(() => setFeedbackMsg(''), 2500);
    },
    onError: (err: any) => {
      setFeedbackMsg(`Restore failed: ${err.message || 'Network error'}`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    },
  });

  // Permanent Delete Single/Bulk Mutation
  const permanentDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => {
      if (ids.length === 1) {
        return fetchApi(`/memory/${ids[0]}/permanent`, { method: 'DELETE' });
      }
      return fetchApi('/bulk/permanent', {
        method: 'DELETE',
        body: JSON.stringify({ ids, type: 'memory' }),
      });
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['deletedMemories'] });
      setSelectedIds([]);
      setShowConfirmModal(false);
      setTargetPurgeIds([]);
      setFeedbackMsg(`Permanently purged ${ids.length} item(s).`);
      setTimeout(() => setFeedbackMsg(''), 2500);
    },
    onError: (err: any) => {
      setShowConfirmModal(false);
      setFeedbackMsg(`Purge failed: ${err.message || 'Network error'}`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    },
  });

  const confirmPurge = (ids: string[]) => {
    setTargetPurgeIds(ids);
    setShowConfirmModal(true);
  };

  const executePurge = () => {
    if (targetPurgeIds.length > 0) {
      permanentDeleteMutation.mutate(targetPurgeIds);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map((i: any) => i.id));
    }
  };

  const hasItemsInTrash = filteredList.length > 0;
  const isPurging = permanentDeleteMutation.isPending;
  const isRestoring = restoreMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="h-full flex gap-6 relative select-none font-sans text-[#111827] dark:text-neutral-100 overflow-hidden"
    >
      {/* Left Container: Fixed Header + Scrollable Trash Stream + Fixed Footer */}
      <div className="flex-1 flex flex-col justify-between min-w-0 h-full overflow-hidden">
        {/* Fixed Top Header & Filter Toolbar Section (shrink-0) */}
        <div className="shrink-0 space-y-3 pb-1">
          {/* Page Header */}
          <PageHeader
            breadcrumb={['Workspace', 'Trash Vault']}
            title="Trash Vault & Recovery"
            description="Soft-deleted memories, knowledge articles, and project workspaces preserved for restore or permanent purge."
            className="flex flex-col md:flex-row md:items-center justify-between gap-3 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]"
            actions={
              // CONDITIONALLY RENDER DELETE/EMPTY TRASH ONLY WHEN ITEMS EXIST
              hasItemsInTrash ? (
                selectedIds.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => restoreMutation.mutate(selectedIds)}
                      disabled={isRestoring || isPurging}
                      className="h-[34px] px-3 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-none disabled:opacity-50"
                    >
                      {isRestoring ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                      <span>Restore Selected ({selectedIds.length})</span>
                    </button>

                    <button
                      onClick={() => confirmPurge(selectedIds)}
                      disabled={isRestoring || isPurging}
                      className="h-[34px] px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-none disabled:opacity-50"
                    >
                      {isPurging ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      <span>Delete Permanently ({selectedIds.length})</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => confirmPurge(filteredList.map((i: any) => i.id))}
                      disabled={isRestoring || isPurging}
                      className="h-[34px] px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {isPurging ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      <span>Empty Trash</span>
                    </button>
                  </div>
                )
              ) : null
            }
          />

          {/* Feedback Toast Notification */}
          {feedbackMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2"
            >
              <Check className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg}</span>
            </motion.div>
          )}

          {/* Module Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Module Tabs */}
            <div className="flex items-center gap-1 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] p-1 rounded-xl w-full sm:w-auto overflow-x-auto shadow-sm dark:shadow-none">
              {[
                { id: 'memories', label: 'Deleted Memories', icon: Database },
                { id: 'knowledge', label: 'Deleted Knowledge', icon: BookOpen },
                { id: 'projects', label: 'Deleted Projects', icon: FolderKanban },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSelectedIds([]);
                    }}
                    className={`h-[30px] px-3 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                      activeTab === tab.id
                        ? 'bg-[#2563EB]/15 text-[#2563EB] dark:text-blue-300 border border-[#2563EB]/30'
                        : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search deleted items..."
                className="w-full h-[34px] pl-8 pr-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Center Trash Items Stream (ONLY THIS SCROLLS) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 my-1.5">
          {isLoadingMemories ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl"></div>
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-2">
              <Trash2 className="w-10 h-10 text-[#9CA3AF] mx-auto" />
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">Trash Vault Empty</h3>
              <p className="text-xs text-[#6B7280] dark:text-neutral-400">No soft-deleted entries found in this workspace section.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-2.5">
                {/* Select All Checkbox Header */}
                <div className="flex items-center gap-2 px-1 text-xs font-semibold text-[#6B7280] dark:text-neutral-400">
                  <button onClick={toggleSelectAll} className="flex items-center gap-1.5 hover:text-[#111827] dark:hover:text-white">
                    {selectedIds.length === filteredList.length ? (
                      <CheckSquare className="w-4 h-4 text-[#2563EB]" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                    <span>Select All ({filteredList.length})</span>
                  </button>
                </div>

                {filteredList.map((item: any) => {
                  const isChecked = selectedIds.includes(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isChecked
                          ? 'border-[#2563EB] bg-[#2563EB]/10 dark:bg-[#2563EB]/15'
                          : 'bg-white dark:bg-[#171717] border-[#E5E7EB] dark:border-white/[0.06] shadow-sm dark:shadow-none'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button onClick={() => toggleSelect(item.id)} className="shrink-0 text-[#2563EB]">
                          {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-gray-400" />}
                        </button>

                        <div className="space-y-1 truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              DELETED
                            </span>
                            <h3 className="text-sm font-bold text-[#111827] dark:text-white truncate">
                              {item.title || item.name}
                            </h3>
                          </div>
                          <p className="text-xs text-[#6B7280] dark:text-neutral-400 font-mono">
                            {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : 'Deleted recently'}
                          </p>
                        </div>
                      </div>

                      {/* Item Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => restoreMutation.mutate([item.id])}
                          disabled={isRestoring || isPurging}
                          className="h-8 px-3 bg-[#2563EB] hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>

                        <button
                          onClick={() => confirmPurge([item.id])}
                          disabled={isRestoring || isPurging}
                          className="h-8 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Purge</span>
                        </button>
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
          <span>Showing 1-{filteredList.length} of {filteredList.length} deleted items</span>
          <span>Soft-deleted items are retained until purged</span>
        </div>
      </div>

      {/* Delete Permanently Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm bg-white dark:bg-[#0D0D11] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl p-5 space-y-4 font-sans text-xs text-[#111827] dark:text-gray-200 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111827] dark:text-white">Delete Permanently</h3>
                <p className="text-xs text-[#6B7280] dark:text-gray-400 font-mono">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#4B5563] dark:text-gray-300">
              You are about to permanently purge <strong className="text-[#111827] dark:text-white">{targetPurgeIds.length}</strong> soft-deleted item(s) from database storage.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB] dark:border-white/[0.06]">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isPurging}
                className="h-9 px-4 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-[#111827] dark:text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={executePurge}
                disabled={isPurging}
                className="h-9 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isPurging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
