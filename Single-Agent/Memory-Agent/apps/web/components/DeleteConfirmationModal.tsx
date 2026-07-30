'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  item: {
    id: string;
    title?: string;
    name?: string;
    type?: string;
    category?: string;
    workspace?: string;
    author?: string;
    relatedCount?: number;
  } | null;
  moduleName?: 'Memory' | 'Knowledge' | 'Project';
  onClose: () => void;
  onConfirm: (result: { action: 'soft' | 'archive' | 'permanent'; reason: string }) => void;
  isPending?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  item,
  moduleName = 'Memory',
  onClose,
  onConfirm,
  isPending = false,
}: DeleteConfirmationModalProps) {
  const [selectedAction, setSelectedAction] = useState<'soft' | 'archive' | 'permanent'>('soft');
  const [reason, setReason] = useState('Outdated');

  if (!isOpen || !item) return null;

  const displayTitle = item.title || item.name || 'Selected Entry';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ action: selectedAction, reason });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 6 }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
          className="w-full max-w-[440px] bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl shadow-2xl p-4 text-[#111827] dark:text-white space-y-3"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#111827] dark:text-white leading-tight">
                  Delete {moduleName}
                </h2>
                <p className="text-[11px] text-[#6B7280] dark:text-neutral-400">
                  {selectedAction === 'permanent'
                    ? 'Permanent deletion cannot be undone.'
                    : 'Moves item to Trash Vault.'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#6B7280] dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Item Details Box */}
          <div className="p-2.5 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.04] rounded-xl space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#111827] dark:text-white truncate max-w-[260px]">{displayTitle}</span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 font-bold">
                {item.type || item.category || moduleName}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#6B7280] dark:text-neutral-400 font-mono pt-1 border-t border-[#E5E7EB] dark:border-white/[0.04]">
              <span>Workspace: <strong className="text-[#111827] dark:text-neutral-200">{item.workspace || 'Development'}</strong></span>
              <span>Owner: <strong className="text-[#111827] dark:text-neutral-200">{item.author || 'You'}</strong></span>
            </div>
          </div>

          {/* Linked Relationships Warning Callout */}
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-2 leading-snug">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
            <span>
              Item vector relationships remain preserved in memory and can be restored anytime from Trash.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {/* Delete Options Radio Group */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#6B7280] dark:text-neutral-400 uppercase font-mono">Action</label>

              {/* Move to Trash */}
              <div
                onClick={() => setSelectedAction('soft')}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  selectedAction === 'soft'
                    ? 'border-[#2563EB] bg-[#2563EB]/10 dark:bg-[#2563EB]/15'
                    : 'border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F6F7F9] dark:hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedAction === 'soft' ? 'border-[#2563EB] bg-[#2563EB]' : 'border-gray-400'
                  }`}>
                    {selectedAction === 'soft' && <div className="w-1 h-1 rounded-full bg-white"></div>}
                  </div>
                  <span className="font-bold text-[#111827] dark:text-white text-xs">Move to Trash</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">Recommended</span>
              </div>

              {/* Archive Instead */}
              <div
                onClick={() => setSelectedAction('archive')}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-2 ${
                  selectedAction === 'archive'
                    ? 'border-[#2563EB] bg-[#2563EB]/10 dark:bg-[#2563EB]/15'
                    : 'border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F6F7F9] dark:hover:bg-white/[0.04]'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                  selectedAction === 'archive' ? 'border-[#2563EB] bg-[#2563EB]' : 'border-gray-400'
                }`}>
                  {selectedAction === 'archive' && <div className="w-1 h-1 rounded-full bg-white"></div>}
                </div>
                <span className="font-bold text-[#111827] dark:text-white text-xs">Archive Instead</span>
              </div>

              {/* Permanently Delete */}
              <div
                onClick={() => setSelectedAction('permanent')}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  selectedAction === 'permanent'
                    ? 'border-rose-500 bg-rose-500/10 dark:bg-rose-500/15'
                    : 'border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F6F7F9] dark:hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                    selectedAction === 'permanent' ? 'border-rose-500 bg-rose-500' : 'border-gray-400'
                  }`}>
                    {selectedAction === 'permanent' && <div className="w-1 h-1 rounded-full bg-white"></div>}
                  </div>
                  <span className="font-bold text-rose-600 dark:text-rose-400 text-xs">Permanently Delete</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">Admin Only</span>
              </div>
            </div>

            {/* Optional Reason Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-[#6B7280] dark:text-neutral-400 mb-1">Reason (Optional)</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-8 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-lg px-2.5 text-xs text-[#111827] dark:text-white focus:outline-none"
              >
                <option value="Outdated">Outdated / Obsolete</option>
                <option value="Duplicate">Duplicate Entry</option>
                <option value="No longer needed">No longer needed</option>
                <option value="Created by mistake">Created by mistake</option>
              </select>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB] dark:border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="h-8 px-3 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-lg text-xs font-medium text-[#6B7280] dark:text-neutral-300 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className={`h-8 px-4 text-xs font-semibold rounded-lg transition-all shadow-none ${
                  selectedAction === 'permanent'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-[#2563EB] hover:bg-blue-600 text-white'
                }`}
              >
                {isPending
                  ? 'Processing...'
                  : selectedAction === 'permanent'
                  ? 'Delete Permanently'
                  : selectedAction === 'archive'
                  ? 'Archive Item'
                  : 'Move to Trash'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
