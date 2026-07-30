'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Edit3,
  ExternalLink,
  Clock,
  Database,
  Building2,
  Layers,
  Network,
  Lock,
  FileText,
  Paperclip,
  FolderKanban,
  CheckCircle2,
  Check,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

interface InspectorPanelProps {
  item: any | null;
  onClose: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

export default function InspectorPanel({ item, onClose, onEdit, onDelete }: InspectorPanelProps) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

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

  const badgeClass = typeColorMap[item.type?.toLowerCase()] || typeColorMap['working'];

  const handleExportJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.aside
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      className="w-[360px] border border-[#E5E7EB] dark:border-white/[0.08] bg-white dark:bg-[#141519] rounded-2xl p-5 flex flex-col justify-between h-full shrink-0 select-none font-sans text-[#111827] dark:text-neutral-100 shadow-xl dark:shadow-none"
    >
      {/* Fixed Top Header (shrink-0) */}
      <div className="shrink-0 space-y-3 pb-2 border-b border-[#E5E7EB] dark:border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#111827] dark:text-white font-bold text-sm">
            <Database className="w-4 h-4 text-[#2563EB]" />
            <span>Inspector</span>
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                title="Edit Memory"
                className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleExportJSON}
              title="Copy Memory Metadata JSON"
              className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white transition-colors relative"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <ExternalLink className="w-4 h-4" />}
            </button>

            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                title="Delete Memory"
                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              title="Close Inspector"
              className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Memory Type & Status Pill Row */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border ${badgeClass}`}>
            {item.type || 'WORKING'}
          </span>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </span>
        </div>
      </div>

      {/* Internal Scrollable Content Body (flex-1 overflow-y-auto) */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 my-2">
        {/* Title & Excerpt Overview */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-[#111827] dark:text-white leading-snug">
            {item.title || 'Gemini Text-Embedding-004 Configuration'}
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-neutral-400 leading-relaxed bg-[#F6F7F9] dark:bg-[#111111] p-3 rounded-xl border border-[#E5E7EB] dark:border-white/[0.04]">
            {item.content || 'All memory embeddings are generated with 768 dimensions using Gemini API text-embedding-004 model.'}
          </p>
        </div>

        {/* Section 1: Overview Specs */}
        <div className="space-y-2.5 pt-2.5 border-t border-[#E5E7EB] dark:border-white/[0.06]">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] dark:text-neutral-500 font-semibold">Overview</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" /> Importance Score
              </span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.importanceScore || '0.85'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#9CA3AF]" /> Memory Type
              </span>
              <span className="font-semibold text-[#111827] dark:text-neutral-200 capitalize">{item.type || 'Working'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Status
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#9CA3AF]" /> Visibility
              </span>
              <span className="font-mono text-[#6B7280] dark:text-neutral-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#9CA3AF]" /> Private
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Metadata */}
        <div className="space-y-2.5 pt-2.5 border-t border-[#E5E7EB] dark:border-white/[0.06]">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] dark:text-neutral-500 font-semibold">Metadata</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Created</span>
              <span className="font-mono text-[#111827] dark:text-neutral-300">
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Updated</span>
              <span className="font-mono text-[#111827] dark:text-neutral-300">
                {item.updatedAt ? (typeof item.updatedAt === 'string' && item.updatedAt.includes('ago') ? item.updatedAt : new Date(item.updatedAt).toLocaleString()) : 'Just now'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Workspace</span>
              <span className="font-medium text-[#111827] dark:text-neutral-200 truncate max-w-[130px]">{item.workspace || item.workspaceId || 'Development Workspace'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Author</span>
              <div className="flex items-center gap-1.5 font-medium text-[#111827] dark:text-neutral-200">
                <div className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[9px] font-bold">
                  {(item.author || 'You')[0]?.toUpperCase()}
                </div>
                <span>{item.author || 'You'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: AI & Embeddings */}
        <div className="space-y-2.5 pt-2.5 border-t border-[#E5E7EB] dark:border-white/[0.06]">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] dark:text-neutral-500 font-semibold">AI & Embeddings</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Embedding Model</span>
              <span className="font-mono text-[#2563EB] dark:text-blue-300 font-medium">Gemini text-embedding-004</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Vector Dimensions</span>
              <span className="font-mono text-[#111827] dark:text-neutral-300">768</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">AI Classification</span>
              <span className="font-mono text-[#111827] dark:text-neutral-300">Configuration</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Confidence Score</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">0.92</span>
            </div>
          </div>
        </div>

        {/* Section 4: Connections */}
        <div className="space-y-2.5 pt-2.5 border-t border-[#E5E7EB] dark:border-white/[0.06]">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] dark:text-neutral-500 font-semibold">Connections</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#9CA3AF]" /> Related Memories
              </span>
              <span className="font-mono font-bold text-[#111827] dark:text-white">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-[#9CA3AF]" /> Linked Projects
              </span>
              <span className="font-mono font-bold text-[#111827] dark:text-white">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-[#9CA3AF]" /> Attached Files
              </span>
              <span className="font-mono font-bold text-[#111827] dark:text-white">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Single Full-Width Action Button (shrink-0) */}
      <div className="shrink-0 pt-3 border-t border-[#E5E7EB] dark:border-white/[0.06]">
        <Link
          href="/graph"
          className="h-[38px] w-full bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-none"
        >
          <Network className="w-4 h-4" />
          <span>View Graph Topology</span>
        </Link>
      </div>
    </motion.aside>
  );
}
