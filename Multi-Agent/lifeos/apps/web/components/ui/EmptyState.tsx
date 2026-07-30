import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius)] border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-8 text-center transition-luxury',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--surface-secondary))] text-[hsl(var(--accent-primary))]">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[hsl(var(--text-primary))]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[hsl(var(--text-secondary))]">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
