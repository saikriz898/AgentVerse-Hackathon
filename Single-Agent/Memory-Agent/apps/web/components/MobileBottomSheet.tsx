'use client';

import Link from 'next/link';
import { Brain, FolderKanban, Upload, BookOpen, Sparkles, X } from 'lucide-react';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileBottomSheet({ isOpen, onClose }: MobileBottomSheetProps) {
  if (!isOpen) return null;

  const actions = [
    {
      title: 'New Memory',
      description: 'Capture ideas, notes, or information',
      icon: Brain,
      href: '/memory',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'New Project',
      description: 'Organize and track your projects',
      icon: FolderKanban,
      href: '/projects',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Upload File',
      description: 'Upload documents or files',
      icon: Upload,
      href: '/documents',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'New Knowledge',
      description: 'Add knowledge base article',
      icon: BookOpen,
      href: '/knowledge',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'AI Prompt',
      description: 'Create an AI prompt or query',
      icon: Sparkles,
      href: '/context',
      color: 'text-[#7C3AED]',
      bgColor: 'bg-[#7C3AED]/10 border-[#7C3AED]/20',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Modal Container */}
      <div className="relative w-full max-w-lg bg-[#171717] border-t border-white/[0.08] rounded-t-[24px] p-6 pb-8 space-y-5 z-10 shadow-2xl animate-in slide-in-from-bottom duration-250 select-none">
        {/* Top Handle Indicator */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto" />

        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Create New</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#202020] border border-white/[0.06] flex items-center justify-center text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.title}
                href={act.href}
                onClick={onClose}
                className="p-3.5 bg-[#111111] hover:bg-[#202020] border border-white/[0.04] rounded-2xl flex items-center gap-3.5 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${act.bgColor}`}>
                  <Icon className={`w-5 h-5 ${act.color}`} />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {act.title}
                  </span>
                  <span className="text-xs text-neutral-400 truncate">{act.description}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
