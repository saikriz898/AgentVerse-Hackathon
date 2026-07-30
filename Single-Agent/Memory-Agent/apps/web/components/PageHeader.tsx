'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  breadcrumb?: string[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  breadcrumb = ['Workspace', 'Dashboard'],
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={
        className ||
        'mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none border-b border-[#E5E7EB] dark:border-white/[0.04] pb-6'
      }
    >
      <div className="space-y-1">
        {/* Breadcrumb Hierarchy */}
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-neutral-400 font-medium tracking-wide">
            {breadcrumb.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-neutral-600 shrink-0" />}
                <span
                  className={
                    idx === breadcrumb.length - 1
                      ? 'text-[#111827] dark:text-neutral-200 font-semibold'
                      : 'hover:text-[#111827] dark:hover:text-neutral-300 transition-colors'
                  }
                >
                  {item}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Page Title */}
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white font-sans">{title}</h1>

        {/* Page Description */}
        {description && (
          <p className="text-xs md:text-sm text-[#6B7280] dark:text-neutral-400 max-w-3xl leading-relaxed">{description}</p>
        )}
      </div>

      {/* Page Actions Slot */}
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
