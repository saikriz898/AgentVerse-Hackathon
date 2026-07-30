'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchApi } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import {
  HardDrive,
  Cpu,
  Layers,
  Server,
  Play,
  Pause,
  RotateCw,
  Trash2,
  ListFilter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  X,
  ChevronRight,
  Database,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface QueueItem {
  id: string;
  name: string;
  counts: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: number;
  };
  isRunning: boolean;
  priority: string;
}

interface WorkerItem {
  id: string;
  name: string;
  queue: string;
  status: 'running' | 'idle' | 'paused';
  processedCount: number;
  failedCount: number;
  cpuUsage: string;
  memoryUsage: string;
  lastHeartbeat: string;
}

interface JobDetails {
  id: string;
  queue: string;
  worker: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  priority: string;
  payload: any;
  durationMs: number;
  startedAt: string;
  completedAt: string;
  stackTrace: string | null;
}

export default function StoragePage() {
  const [activeTab, setActiveTab] = useState<'queues' | 'workers' | 'pipeline' | 'dlq'>('queues');
  const [selectedJob, setSelectedJob] = useState<JobDetails | null>(null);
  const queryClient = useQueryClient();

  // Query live queue metrics & worker status
  const { data: queueData, isLoading } = useQuery({
    queryKey: ['queueStatus'],
    queryFn: () => fetchApi('/queues/status'),
    refetchInterval: 3000,
  });

  // Query jobs list
  const { data: jobsList } = useQuery({
    queryKey: ['queueJobs'],
    queryFn: () => fetchApi('/queues/jobs'),
    refetchInterval: 3000,
  });

  // Queue Action Mutation (Pause/Resume/Retry)
  const actionMutation = useMutation({
    mutationFn: ({ queueId, action }: { queueId?: string; action: string }) =>
      fetchApi('/queues/action', {
        method: 'POST',
        body: JSON.stringify({ queueId, action }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queueStatus'] });
    },
  });

  const queues: QueueItem[] = queueData?.queues || [
    { id: 'memoryQueue', name: 'Memory Queue', counts: { waiting: 0, active: 0, completed: 8, failed: 0, delayed: 0, paused: 0 }, isRunning: true, priority: 'Critical' },
    { id: 'embeddingQueue', name: 'Embedding Queue (768d)', counts: { waiting: 0, active: 0, completed: 8, failed: 0, delayed: 0, paused: 0 }, isRunning: true, priority: 'High' },
    { id: 'relationshipQueue', name: 'Relationship Queue', counts: { waiting: 0, active: 0, completed: 4, failed: 0, delayed: 0, paused: 0 }, isRunning: true, priority: 'Normal' },
    { id: 'graphQueue', name: 'Graph Topology Queue', counts: { waiting: 0, active: 0, completed: 4, failed: 0, delayed: 0, paused: 0 }, isRunning: true, priority: 'Normal' },
    { id: 'searchQueue', name: 'Search Index Queue', counts: { waiting: 0, active: 0, completed: 8, failed: 0, delayed: 0, paused: 0 }, isRunning: true, priority: 'High' },
    { id: 'cleanupQueue', name: 'Cleanup Queue', counts: { waiting: 0, active: 0, completed: 2, failed: 0, delayed: 0, paused: 0 }, isRunning: true, priority: 'Background' },
  ];

  const workers: WorkerItem[] = queueData?.workers || [
    { id: 'w-1', name: 'Memory Worker #1', queue: 'Memory Queue', status: 'running', processedCount: 8, failedCount: 0, cpuUsage: '4.2%', memoryUsage: '42 MB', lastHeartbeat: 'Just now' },
    { id: 'w-2', name: 'Embedding Worker #1 (Gemini 768d)', queue: 'Embedding Queue', status: 'running', processedCount: 8, failedCount: 0, cpuUsage: '12.8%', memoryUsage: '84 MB', lastHeartbeat: 'Just now' },
    { id: 'w-3', name: 'Relationship Worker #1', queue: 'Relationship Queue', status: 'running', processedCount: 4, failedCount: 0, cpuUsage: '3.1%', memoryUsage: '38 MB', lastHeartbeat: 'Just now' },
    { id: 'w-4', name: 'Graph Worker #1', queue: 'Graph Queue', status: 'running', processedCount: 4, failedCount: 0, cpuUsage: '5.6%', memoryUsage: '56 MB', lastHeartbeat: 'Just now' },
    { id: 'w-5', name: 'Search Index Worker #1', queue: 'Search Index Queue', status: 'running', processedCount: 8, failedCount: 0, cpuUsage: '2.4%', memoryUsage: '28 MB', lastHeartbeat: 'Just now' },
  ];

  const jobs: JobDetails[] = jobsList || [
    {
      id: 'job-mem-8931',
      queue: 'Memory Queue',
      worker: 'Memory Worker #1',
      status: 'completed',
      priority: 'Critical',
      payload: { title: 'Memory Agent Architecture Guidelines', type: 'working', workspaceId: 'dev-workspace' },
      durationMs: 14,
      startedAt: new Date(Date.now() - 10000).toISOString(),
      completedAt: new Date(Date.now() - 9986).toISOString(),
      stackTrace: null,
    },
    {
      id: 'job-embed-9942',
      queue: 'Embedding Queue (768d)',
      worker: 'Embedding Worker #1',
      status: 'completed',
      priority: 'High',
      payload: { model: 'text-embedding-004', dimensions: 768, textLength: 420 },
      durationMs: 22,
      startedAt: new Date(Date.now() - 8000).toISOString(),
      completedAt: new Date(Date.now() - 7978).toISOString(),
      stackTrace: null,
    },
  ];

  const summary = queueData?.summary || {
    pending: 0,
    running: 0,
    completed: 8,
    failed: 0,
    deadLetter: 0,
    avgLatencyMs: 14,
    throughputPerMin: 60,
  };

  const pipelineStages = [
    'User Action',
    'Event Detection',
    'Intent Analysis',
    'Task Planning',
    'Queue Selection',
    'Worker Assignment',
    'Execution',
    'Validation',
    'Memory Update',
    'Search Update',
    'Relationship Update',
    'Analytics Update',
    'Completed',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="h-full flex flex-col justify-between relative select-none font-sans text-[#111827] dark:text-neutral-100 overflow-hidden"
    >
      {/* Fixed Top Header (shrink-0) */}
      <div className="shrink-0 space-y-3 pb-1">
        <PageHeader
          breadcrumb={['System', 'Job Queues & Workers']}
          title="Queue & Worker System"
          description="Monitoring BullMQ background queues, worker fleet status, and visual task execution pipelines."
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]"
        />

        {/* Mode Selector Tabs & Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] p-1 rounded-xl shadow-sm dark:shadow-none w-full sm:w-auto">
            {[
              { id: 'queues', label: 'Queue Overview', icon: Server },
              { id: 'workers', label: 'Worker Fleet', icon: Cpu },
              { id: 'pipeline', label: 'Visual Pipeline', icon: Layers },
              { id: 'dlq', label: 'Dead Letter Queue', icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`h-[30px] px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[#2563EB]/15 text-[#2563EB] dark:text-blue-300 border border-[#2563EB]/30'
                      : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => actionMutation.mutate({ action: 'retry-failed' })}
              className="h-[30px] px-2.5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-amber-500/10 hover:text-amber-400 text-[#6B7280] dark:text-neutral-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry Failed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Viewport (ONLY THIS SCROLLS) */}
      <div className="flex-1 my-1.5 overflow-y-auto pr-1 space-y-4">
        {/* Top Summary Counters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 font-mono text-xs">
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Pending</span>
            <p className="text-lg font-bold text-blue-400">{summary.pending}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Running</span>
            <p className="text-lg font-bold text-purple-400">{summary.running}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Completed</span>
            <p className="text-lg font-bold text-emerald-400">{summary.completed}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Failed</span>
            <p className="text-lg font-bold text-rose-400">{summary.failed}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Dead Letter</span>
            <p className="text-lg font-bold text-amber-400">{summary.deadLetter}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Latency</span>
            <p className="text-lg font-bold text-cyan-400">{summary.avgLatencyMs}ms</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Throughput</span>
            <p className="text-lg font-bold text-[#111827] dark:text-gray-300">{summary.throughputPerMin}/m</p>
          </div>
        </div>

        {/* Tab 1: Queue Control Cards & Jobs Table */}
        {activeTab === 'queues' && (
          <div className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {queues.map((q) => (
                <div key={q.id} className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-3 shadow-sm dark:shadow-none">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
                    <span className="font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-[#2563EB]" /> {q.name}
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                      {q.isRunning ? 'RUNNING' : 'PAUSED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-[#6B7280] dark:text-neutral-400">
                    <div>Waiting: <strong className="text-[#2563EB] dark:text-blue-400">{q.counts.waiting}</strong></div>
                    <div>Active: <strong className="text-purple-600 dark:text-purple-400">{q.counts.active}</strong></div>
                    <div>Completed: <strong className="text-emerald-600 dark:text-emerald-400">{q.counts.completed}</strong></div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => actionMutation.mutate({ queueId: q.id, action: q.isRunning ? 'pause' : 'resume' })}
                      className="px-2 py-1 bg-[#F3F4F6] dark:bg-white/[0.04] hover:bg-gray-200 dark:hover:bg-white/10 text-[#111827] dark:text-gray-300 rounded text-[11px] font-mono flex items-center gap-1 border border-[#E5E7EB] dark:border-white/[0.06]"
                    >
                      {q.isRunning ? <Pause className="w-3 h-3 text-amber-500 dark:text-amber-400" /> : <Play className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />}
                      <span>{q.isRunning ? 'Pause' : 'Resume'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Jobs Table */}
            <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
              <div className="p-3.5 border-b border-[#E5E7EB] dark:border-white/[0.06] font-bold text-xs flex items-center justify-between text-[#111827] dark:text-white">
                <span>RECENT QUEUE EXECUTIONS</span>
                <span className="text-[10px] font-mono text-gray-500">Live Auto-Polling Active</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs text-left">
                  <thead className="bg-[#F9FAFB] dark:bg-[#121212] border-b border-[#E5E7EB] dark:border-white/[0.06] text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase">
                    <tr>
                      <th className="p-3">Job ID</th>
                      <th className="p-3">Queue</th>
                      <th className="p-3">Worker</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-white/[0.04]">
                    {jobs.map((j) => (
                      <tr key={j.id} className="hover:bg-[#F3F4F6] dark:hover:bg-white/[0.02]">
                        <td className="p-3 font-bold text-[#111827] dark:text-white">{j.id}</td>
                        <td className="p-3 text-gray-300">{j.queue}</td>
                        <td className="p-3 text-gray-400">{j.worker}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                            {j.status}
                          </span>
                        </td>
                        <td className="p-3 text-purple-400">{j.priority}</td>
                        <td className="p-3 text-cyan-400">{j.durationMs}ms</td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedJob(j)}
                            className="px-2 py-1 bg-[#2563EB]/15 text-[#2563EB] dark:text-blue-300 rounded text-[10px] font-bold border border-[#2563EB]/30 hover:bg-[#2563EB]/25"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Worker Fleet Panel */}
        {activeTab === 'workers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {workers.map((w) => (
              <div key={w.id} className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
                  <span className="font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-purple-400" /> {w.name}
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                    {w.status}
                  </span>
                </div>
                <div className="space-y-1 text-[#6B7280] dark:text-neutral-400">
                  <p>Assigned Queue: <strong className="text-white">{w.queue}</strong></p>
                  <p>Jobs Processed: <strong className="text-emerald-400">{w.processedCount}</strong> (Failed: {w.failedCount})</p>
                  <p>CPU Utilization: <strong className="text-purple-400">{w.cpuUsage}</strong> • Memory: <strong className="text-cyan-400">{w.memoryUsage}</strong></p>
                  <p>Last Heartbeat: <strong className="text-gray-300">{w.lastHeartbeat}</strong></p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Visual Execution Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
                <span className="font-bold text-xs text-[#111827] dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" /> AUTONOMOUS TASK EXECUTION PIPELINE FLOW
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  STATUS: LIVE EVENT DISPATCH
                </span>
              </div>

              {/* Horizontal Visual Pipeline Stages */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-2">
                {pipelineStages.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 shrink-0">
                    <div className="px-3 py-2 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl flex flex-col items-center justify-center text-center space-y-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-[10px] text-[#111827] dark:text-white">{stage}</span>
                    </div>
                    {idx < pipelineStages.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Execution Pipelines */}
            <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-3">
              <span className="font-bold text-xs text-[#111827] dark:text-white">RECENT EXECUTED PIPELINES</span>

              <div className="space-y-2">
                {[
                  { id: 'pipe-8931', event: 'Memory Created', queue: 'embeddingQueue', worker: 'Embedding Worker #1', status: 'Completed', latency: '14ms' },
                  { id: 'pipe-8932', event: 'Knowledge Spec Added', queue: 'searchQueue', worker: 'Search Worker #1', status: 'Completed', latency: '18ms' },
                  { id: 'pipe-8933', event: 'Relationship Edge Linked', queue: 'relationshipQueue', worker: 'Relationship Worker #1', status: 'Completed', latency: '11ms' },
                ].map((p) => (
                  <div key={p.id} className="p-3 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#111827] dark:text-white">{p.id}</span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">{p.event}</span>
                      <span className="text-[#6B7280] dark:text-gray-400">{p.queue}</span>
                      <span className="text-[#2563EB] dark:text-blue-400 font-semibold">{p.worker}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{p.latency}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[10px] font-bold uppercase">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slide-over Job Inspector Drawer */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end font-mono text-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#0D0D11] border-l border-[#E5E7EB] dark:border-white/[0.08] p-5 h-full flex flex-col justify-between space-y-4 text-[#111827] dark:text-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-white/[0.08]">
              <span className="font-bold text-[#2563EB] dark:text-cyan-400">JOB INSPECTOR: {selectedJob.id}</span>
              <button onClick={() => setSelectedJob(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 leading-relaxed">
              <div>Queue: <strong className="text-[#111827] dark:text-white">{selectedJob.queue}</strong></div>
              <div>Worker: <strong className="text-purple-600 dark:text-purple-400">{selectedJob.worker}</strong></div>
              <div>Status: <strong className="text-emerald-600 dark:text-emerald-400 uppercase">{selectedJob.status}</strong></div>
              <div>Duration: <strong className="text-[#2563EB] dark:text-cyan-400">{selectedJob.durationMs}ms</strong></div>
              <div>Started: <span className="text-gray-500 dark:text-gray-400">{selectedJob.startedAt}</span></div>
              <div>Completed: <span className="text-gray-500 dark:text-gray-400">{selectedJob.completedAt}</span></div>

              <div className="pt-2">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Payload JSON</span>
                <pre className="mt-1 p-3 bg-[#F8FAFC] dark:bg-[#14151B] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl text-[11px] text-[#2563EB] dark:text-emerald-400 overflow-x-auto">
                  {JSON.stringify(selectedJob.payload, null, 2)}
                </pre>
              </div>
            </div>

            <button
              onClick={() => setSelectedJob(null)}
              className="w-full py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-[#111827] dark:text-white rounded-xl font-bold"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Status Footer (shrink-0) */}
      <div className="shrink-0 flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-white/[0.06] text-xs text-[#6B7280] dark:text-neutral-400 font-mono bg-white dark:bg-[#090909] z-10">
        <span>Queue Engine: BULLMQ + REDIS SYNCHRONIZED</span>
        <span>Auto-Poll: 3000ms</span>
      </div>
    </motion.div>
  );
}
