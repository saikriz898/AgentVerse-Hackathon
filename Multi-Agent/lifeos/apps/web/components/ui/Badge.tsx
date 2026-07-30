import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'outline' | 'info';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface-2 text-text-secondary border border-border/60',
    accent: 'bg-accent-light text-accent-primary font-semibold border border-accent-primary/20',
    success: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-semibold border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20',
    outline: 'border border-border text-text-secondary bg-surface-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs transition-luxury select-none font-medium',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
