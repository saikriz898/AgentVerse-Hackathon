'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import { Clock } from 'lucide-react';

export default function TimelinePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['memories'],
    queryFn: () => fetchApi('/memory'),
  });

  return (
    <div className="space-y-6 select-none font-sans text-[#111827] dark:text-neutral-100">
      <PageHeader
        breadcrumb={['Workspace', 'Timeline']}
        title="Memory Activity Timeline"
        description="Chronological activity stream and memory ingestion log"
      />

      <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-6 space-y-6 shadow-sm dark:shadow-none">
        {isLoading ? (
          <div className="animate-pulse h-20 bg-[#F6F7F9] dark:bg-white/[0.03] rounded-xl"></div>
        ) : (
          <div className="relative border-l border-[#E5E7EB] dark:border-white/[0.08] ml-4 space-y-6">
            {data?.data?.map((m: any) => (
              <div key={m.id} className="ml-6 space-y-1">
                <div className="absolute -left-2.5 mt-1.5 w-5 h-5 rounded-full bg-[#2563EB] border-4 border-white dark:border-[#171717]" />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#6B7280] dark:text-neutral-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#2563EB]" />
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F6F7F9] dark:bg-white/[0.04] text-[#6B7280] dark:text-neutral-400 border border-[#E5E7EB] dark:border-white/[0.06]">
                    {m.type}
                  </span>
                </div>
                <h3 className="font-semibold text-xs text-[#2563EB] dark:text-blue-300">{m.title}</h3>
                <p className="text-xs text-[#6B7280] dark:text-gray-300 leading-relaxed">{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
