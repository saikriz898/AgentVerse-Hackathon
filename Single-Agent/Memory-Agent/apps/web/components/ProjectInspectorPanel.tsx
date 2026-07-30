'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Edit3,
  ExternalLink,
  Clock,
  FolderGit2,
  Building2,
  Layers,
  Network,
  Lock,
  FileText,
  Paperclip,
  FolderKanban,
  CheckCircle2,
  Check,
  Tag,
  Trash2,
  ShieldCheck,
  Calendar,
  User,
  ListTodo,
} from 'lucide-react';
import Link from 'next/link';

interface ProjectInspectorPanelProps {
  item: any | null;
  onClose: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
}

export default function ProjectInspectorPanel({ item, onClose, onEdit, onDelete }: ProjectInspectorPanelProps) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const statusColorMap: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
    planning: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20',
    'on-hold': 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20',
    completed: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20',
  };

  const badgeClass = statusColorMap[item.status?.toLowerCase()] || statusColorMap['active'];

  const handleExportJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressVal = item.progress !== undefined ? item.progress : (item.status === 'completed' ? 100 : item.status === 'active' ? 65 : item.status === 'planning' ? 25 : 10);

  return (
    <motion.aside
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      className="w-[340px] border-l border-[#E5E7EB] dark:border-white/[0.08] bg-white dark:bg-[#141519] p-4 flex flex-col justify-between h-full shrink-0 select-none font-sans text-[#111827] dark:text-neutral-100 shadow-xl dark:shadow-none"
    >
      {/* Fixed Top Header (shrink-0) */}
      <div className="shrink-0 space-y-3 pb-2 border-b border-[#E5E7EB] dark:border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#111827] dark:text-white font-bold text-sm">
            <FolderGit2 className="w-4 h-4 text-[#2563EB]" />
            <span>Project Inspector</span>
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                title="Edit Project"
                className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleExportJSON}
              title="Copy Project Metadata JSON"
              className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white transition-colors relative"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <ExternalLink className="w-4 h-4" />}
            </button>

            {onDelete && (
              <button
                onClick={() => onDelete(item.id)}
                title="Delete Project"
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

        {/* Code Badge & Status Pill Row */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F6F7F9] dark:bg-white/[0.04] text-[#2563EB] dark:text-blue-300 border border-[#E5E7EB] dark:border-white/[0.06]">
            {item.code || 'PRJ-01'}
          </span>

          <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border ${badgeClass}`}>
            {item.status || 'ACTIVE'}
          </span>
        </div>
      </div>

      {/* Internal Scrollable Content Body (flex-1 overflow-y-auto) */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 my-2">
        {/* Project Name & Description */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-[#111827] dark:text-white leading-snug">
            {item.name}
          </h2>
          <p className="text-xs text-[#6B7280] dark:text-neutral-400 leading-relaxed bg-[#F6F7F9] dark:bg-[#111111] p-3 rounded-xl border border-[#E5E7EB] dark:border-white/[0.04]">
            {item.description || 'Enterprise project workspace for memory context partitions.'}
          </p>
        </div>

        {/* Progress Completion Bar */}
        <div className="p-3 bg-[#F6F7F9] dark:bg-[#111111] rounded-xl border border-[#E5E7EB] dark:border-white/[0.04] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5 text-[#2563EB]" /> Progress
            </span>
            <span className="font-mono text-[#2563EB] dark:text-blue-300 font-bold">{progressVal}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
            <div className="h-full bg-[#2563EB] rounded-full transition-all duration-300" style={{ width: `${progressVal}%` }}></div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#6B7280] dark:text-neutral-400 pt-0.5">
            <span>8 Completed</span>
            <span>4 Pending</span>
          </div>
        </div>

        {/* Section 1: Overview Specs */}
        <div className="space-y-2.5 pt-2.5 border-t border-[#E5E7EB] dark:border-white/[0.06]">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] dark:text-neutral-500 font-semibold">Overview</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Health Indicator
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">Optimal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#9CA3AF]" /> Priority
              </span>
              <span className="font-mono font-bold text-amber-500 capitalize">{item.priority || 'High'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#9CA3AF]" /> Visibility
              </span>
              <span className="font-mono text-[#6B7280] dark:text-neutral-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#9CA3AF]" /> Workspace Private
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Metadata */}
        <div className="space-y-2.5 pt-2.5 border-t border-[#E5E7EB] dark:border-white/[0.06]">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] dark:text-neutral-500 font-semibold">Metadata</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Project Code</span>
              <span className="font-mono font-bold text-[#2563EB] dark:text-blue-300">{item.code || 'PRJ-01'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Owner</span>
              <div className="flex items-center gap-1.5 font-medium text-[#111827] dark:text-neutral-200">
                <div className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[9px] font-bold">A</div>
                <span>Admin User</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400">Target Deadline</span>
              <span className="font-mono text-[#111827] dark:text-neutral-300">Jun 30, 2025</span>
            </div>
          </div>
        </div>

        {/* Section 3: Memory & Knowledge Connections */}
        <div className="space-y-2.5 pt-2.5 border-t border-[#E5E7EB] dark:border-white/[0.06]">
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#6B7280] dark:text-neutral-500 font-semibold">Context Links</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#9CA3AF]" /> Linked Memories
              </span>
              <span className="font-mono font-bold text-[#111827] dark:text-white">14</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-[#9CA3AF]" /> Knowledge Base Specs
              </span>
              <span className="font-mono font-bold text-[#111827] dark:text-white">4</span>
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
