import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'outline';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[hsl(var(--surface-secondary))] text-[hsl(var(--text-secondary))]',
    accent: 'bg-[hsl(var(--accent-light))] text-[hsl(var(--accent-primary))] font-semibold',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium',
    error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium',
    outline: 'border border-[hsl(var(--border))] text-[hsl(var(--text-secondary))]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs transition-luxury select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
