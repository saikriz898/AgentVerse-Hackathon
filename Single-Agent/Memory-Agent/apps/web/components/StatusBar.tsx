'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../lib/api';
import { Database, Server, Activity, Cpu, CheckCircle2 } from 'lucide-react';

export default function StatusBar() {
  const { data: health } = useQuery({
    queryKey: ['systemHealthStatus'],
    queryFn: () => fetchApi('/admin/health'),
    refetchInterval: 10000,
  });

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 h-8 bg-[#0b0f19]/90 backdrop-blur-md border-t border-gray-800/80 px-4 flex items-center justify-between text-xs text-gray-400 select-none">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-medium">Memory Engine Online</span>
        </div>

        <div className="h-3 w-px bg-gray-800"></div>

        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-indigo-400" />
          <span>DB: <strong className="text-gray-200">PostgreSQL (Neon)</strong></span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-blue-400" />
          <span>Redis: <strong className="text-gray-200">BullMQ Active</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-5 font-mono">
        <div className="hidden md:flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Latency: <strong className="text-emerald-400">12ms</strong></span>
        </div>

        <div className="h-3 w-px bg-gray-800"></div>

        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Agent: <strong className="text-gray-200">Agent 3 v1.0</strong></span>
        </div>
      </div>
    </footer>
  );
}
