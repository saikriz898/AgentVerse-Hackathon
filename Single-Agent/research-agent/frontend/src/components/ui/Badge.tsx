import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue', className }) => {
  const variants = {
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={twMerge(
        clsx('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border', variants[variant], className)
      )}
    >
      {children}
    </span>
  );
};
