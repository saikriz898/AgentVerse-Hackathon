'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import {
  Database,
  BookOpen,
  FolderKanban,
  Cpu,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Download,
  Calendar,
  Plus,
  Search,
  Network,
  Upload,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: metrics, refetch: refetchMetrics } = useQuery({
    queryKey: ['adminMetrics'],
    queryFn: () => fetchApi('/admin/metrics'),
  });

  const { data: memories, refetch: refetchMemories } = useQuery({
    queryKey: ['recentMemories'],
    queryFn: () => fetchApi('/memory?limit=5'),
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchMetrics(), refetchMemories()]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden select-none font-sans text-[#111827] dark:text-neutral-100">
      {/* Fixed Page Header Section (shrink-0) */}
      <div className="shrink-0 pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]">
        <PageHeader
          breadcrumb={['Workspace', 'Dashboard']}
          title="Dashboard"
          description="Overview of your memory system, AI context, and workspace activity."
          actions={
            <>
              <button className="h-9 px-3.5 bg-white dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#202020] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl text-xs font-medium text-[#111827] dark:text-neutral-300 flex items-center gap-1.5 transition-colors">
                <Download className="w-3.5 h-3.5 text-[#6B7280] dark:text-neutral-400" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3 text-[#9CA3AF] dark:text-neutral-500 ml-0.5" />
              </button>

              <button
                onClick={handleRefresh}
                className="h-9 px-3.5 bg-white dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#202020] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl text-xs font-medium text-[#111827] dark:text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#6B7280] dark:text-neutral-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              <button className="h-9 px-3.5 bg-white dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#202020] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl text-xs font-medium text-[#111827] dark:text-neutral-300 flex items-center gap-1.5 transition-colors font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>May 23, 2025</span>
                <ChevronDown className="w-3 h-3 text-[#9CA3AF] dark:text-neutral-500" />
              </button>
            </>
          }
        />
      </div>

      {/* Scrollable Dashboard Widgets Container (ONLY THIS SCROLLS) */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-6 my-2">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-1">
          {/* Total Memories */}
          <div className="p-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:border-blue-400/40 rounded-xl space-y-2.5 transition-all shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-[#6B7280] dark:text-neutral-400">
              <span className="text-xs font-medium">Total Memories</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Database className="w-4 h-4 text-[#2563EB]" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-[#111827] dark:text-white font-mono">{metrics?.metrics?.totalMemories ?? 1284}</p>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <ArrowUpRight className="w-3 h-3" />
                <span>12.5%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-neutral-400">+143 this week</p>
          </div>

          {/* Knowledge Items */}
          <div className="p-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:border-blue-400/40 rounded-xl space-y-2.5 transition-all shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-[#6B7280] dark:text-neutral-400">
              <span className="text-xs font-medium">Knowledge Items</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[#2563EB]" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-[#111827] dark:text-white font-mono">{metrics?.metrics?.totalKnowledgeItems ?? 342}</p>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <ArrowUpRight className="w-3 h-3" />
                <span>8.2%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-neutral-400">+28 this week</p>
          </div>

          {/* Active Projects */}
          <div className="p-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:border-blue-400/40 rounded-xl space-y-2.5 transition-all shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-[#6B7280] dark:text-neutral-400">
              <span className="text-xs font-medium">Active Projects</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <FolderKanban className="w-4 h-4 text-[#2563EB]" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-[#111827] dark:text-white font-mono">{metrics?.metrics?.totalProjects ?? 18}</p>
              <span className="text-[11px] font-mono text-[#6B7280] dark:text-neutral-400">Active</span>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-neutral-400">Across 3 workspaces</p>
          </div>

          {/* AI Executions */}
          <div className="p-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:border-blue-400/40 rounded-xl space-y-2.5 transition-all shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-[#6B7280] dark:text-neutral-400">
              <span className="text-xs font-medium">AI Context Queries</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#2563EB]" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-[#111827] dark:text-white font-mono">14.2k</p>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <ArrowUpRight className="w-3 h-3" />
                <span>24%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-neutral-400">Avg 42ms response</p>
          </div>

          {/* System Health */}
          <div className="p-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:border-blue-400/40 rounded-xl space-y-2.5 transition-all shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between text-[#6B7280] dark:text-neutral-400">
              <span className="text-xs font-medium">System Health</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">99.9%</p>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Optimal</span>
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-neutral-400">All services online</p>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="p-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">Quick Actions</h3>
              <p className="text-xs text-[#6B7280] dark:text-neutral-400">Fast shortcuts for memory store and knowledge indexing</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <Link
              href="/memory"
              className="h-9 px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-none flex-1 md:flex-initial"
            >
              <Plus className="w-4 h-4" />
              <span>Store Memory</span>
            </Link>

            <Link
              href="/search"
              className="h-9 px-4 bg-[#F6F7F9] dark:bg-white/[0.04] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.08] border border-[#E5E7EB] dark:border-white/[0.08] text-[#111827] dark:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors flex-1 md:flex-initial"
            >
              <Search className="w-4 h-4 text-[#2563EB]" />
              <span>Search Context</span>
            </Link>

            <Link
              href="/graph"
              className="h-9 px-4 bg-[#F6F7F9] dark:bg-white/[0.04] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.08] border border-[#E5E7EB] dark:border-white/[0.08] text-[#111827] dark:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors flex-1 md:flex-initial"
            >
              <Network className="w-4 h-4 text-purple-500" />
              <span>View Graph</span>
            </Link>
          </div>
        </div>

        {/* Main Content Split: Recent Memory Stream & Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols): Recent Memories Stream */}
          <div className="lg:col-span-2 p-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-4 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-[#111827] dark:text-white">Recent Memory Stream</h3>
              </div>
              <Link href="/memory" className="text-xs font-semibold text-[#2563EB] hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {(memories?.data || [
                {
                  id: '1',
                  title: 'Gemini Text-Embedding-004 Configuration',
                  content: 'All memory embeddings are generated with 768 dimensions using Gemini API text-embedding-004 model.',
                  type: 'working',
                  importanceScore: 0.85,
                  updatedAt: '2h ago',
                },
                {
                  id: '2',
                  title: 'Agent 3 Memory Architecture Guidelines',
                  content: 'Memory Agent stores long-term, short-term, semantic, project, and session memories using hybrid search.',
                  type: 'long-term',
                  importanceScore: 0.82,
                  updatedAt: '5h ago',
                },
                {
                  id: '3',
                  title: 'Active Session Working Context',
                  content: 'Currently indexing multi-agent capabilities, standardizing API response structures, and maintaining backward compatibility.',
                  type: 'short-term',
                  importanceScore: 0.78,
                  updatedAt: '1d ago',
                },
              ]).map((m: any) => (
                <div
                  key={m.id}
                  className="p-3.5 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.04] hover:border-blue-500/30 rounded-xl space-y-1.5 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                      {m.type || 'working'}
                    </span>
                    <span className="text-[11px] font-mono text-[#6B7280] dark:text-neutral-400">{m.updatedAt || '2h ago'}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#111827] dark:text-white group-hover:text-[#2563EB] transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-xs text-[#6B7280] dark:text-neutral-400 line-clamp-1 leading-relaxed">
                    {m.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (1 Col): System Activity Log */}
          <div className="p-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-4 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-3">
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">Recent Activity</h3>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Live Feed</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F6F7F9] dark:bg-[#111111] rounded-xl border border-[#E5E7EB] dark:border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Database className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827] dark:text-neutral-200">New memory stored</p>
                    <p className="text-[11px] text-[#6B7280] dark:text-neutral-400">Gemini Embedding Config</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#6B7280] dark:text-neutral-400">2m ago</span>
              </div>

              <div className="p-3 bg-[#F6F7F9] dark:bg-[#111111] rounded-xl border border-[#E5E7EB] dark:border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Network className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827] dark:text-neutral-200">Memory linked</p>
                    <p className="text-[11px] text-[#6B7280] dark:text-neutral-400">Connected 3 memories</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#6B7280] dark:text-neutral-400">15m ago</span>
              </div>

              <div className="p-3 bg-[#F6F7F9] dark:bg-[#111111] rounded-xl border border-[#E5E7EB] dark:border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Cpu className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111827] dark:text-neutral-200">AI context generated</p>
                    <p className="text-[11px] text-[#6B7280] dark:text-neutral-400">For Project Phoenix</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#6B7280] dark:text-neutral-400">32m ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
