import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Sparkles,
  Bot,
  UserCheck,
  Zap,
  CheckCircle2,
  Clock,
  Search,
  ShieldCheck,
  Send,
  Archive,
  XCircle,
  RefreshCw,
  Eye,
  ArrowRight
} from 'lucide-react';
import { InputAgent, OutputDestination, OutputType, PriorityType } from '../types/communication';
import { api } from '../services/api';

interface QueueItem {
  id: string;
  title: string;
  source_agent: InputAgent;
  audience: OutputDestination;
  priority: PriorityType;
  confidence: number;
  created_at: string;
  status: string;
  payload: Record<string, any>;
}

const INITIAL_FALLBACK_QUEUE: QueueItem[] = [
  {
    id: "comm-queue-001",
    title: "Executive Audit: Security & Subagent Latency Benchmark",
    source_agent: "Review Agent",
    audience: "CEO",
    priority: "High",
    confidence: 0.99,
    created_at: "2 mins ago",
    status: "Pending",
    payload: {
      project: "LifeOS Security Release",
      review_status: "PASSED_WITH_EXCELLENCE",
      vulnerabilities: "Zero Critical",
      test_pass_rate: "100%"
    }
  },
  {
    id: "comm-queue-002",
    title: "Q3 Multi-Agent Milestone Release",
    source_agent: "Chief of Staff",
    audience: "Executive",
    priority: "Critical",
    confidence: 0.98,
    created_at: "15 mins ago",
    status: "Pending",
    payload: {
      project: "Q3 Multi-Agent Ecosystem Milestone",
      high_priority_actions: [
        "Review Communication Agent channel integration",
        "Approve production release build"
      ]
    }
  },
  {
    id: "comm-queue-003",
    title: "Parallel Execution Pipeline Status",
    source_agent: "Execution Agent",
    audience: "Developer",
    priority: "Normal",
    confidence: 0.96,
    created_at: "45 mins ago",
    status: "Pending",
    payload: {
      project: "Parallel Subagent Pipeline",
      execution_time_ms: 1420,
      subtasks_completed: ["DB Connection Pooling Initialized"]
    }
  }
];

interface CommunicationQueueViewProps {
  onOpenStudioWithPayload?: (item: any) => void;
  onShowToast?: (title: string, msg?: string, type?: 'success' | 'info' | 'error') => void;
}

export const CommunicationQueueView: React.FC<CommunicationQueueViewProps> = ({
  onOpenStudioWithPayload,
  onShowToast
}) => {
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_FALLBACK_QUEUE);
  const [search, setSearch] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [previewItem, setPreviewItem] = useState<QueueItem | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const data = await api.getQueue();
      if (Array.isArray(data) && data.length > 0) {
        setQueue(data);
      }
    } catch (err) {
      console.log("Using static fallback queue items.");
    }
  };

  const handleApprove = async (id: string, title: string) => {
    try {
      await api.approveQueueItem(id);
      setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
      if (onShowToast) onShowToast("Approved", `'${title}' approved in queue.`, 'success');
    } catch (e) {
      setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
      if (onShowToast) onShowToast("Approved", `'${title}' approved in queue.`, 'success');
    }
  };

  const handleReject = async (id: string, title: string) => {
    try {
      await api.rejectQueueItem(id);
      setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Rejected' } : item));
      if (onShowToast) onShowToast("Rejected", `'${title}' rejected from queue.`, 'info');
    } catch (e) {
      setQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Rejected' } : item));
      if (onShowToast) onShowToast("Rejected", `'${title}' rejected from queue.`, 'info');
    }
  };

  const handleArchive = async (id: string, title: string) => {
    try {
      await api.archiveQueueItem(id);
      setQueue(prev => prev.filter(item => item.id !== id));
      if (onShowToast) onShowToast("Archived", `'${title}' moved to archive.`, 'info');
    } catch (e) {
      setQueue(prev => prev.filter(item => item.id !== id));
      if (onShowToast) onShowToast("Archived", `'${title}' moved to archive.`, 'info');
    }
  };

  const filteredQueue = queue.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.source_agent.toLowerCase().includes(search.toLowerCase()) ||
                          item.audience.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = selectedPriority === 'All' || item.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center">
            <Inbox className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Incoming Validated Communication Queue</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {filteredQueue.length} Active
              </span>
            </h1>
            <p className="text-xs text-slate-400">Validated outputs from Review Agent & LifeOS ecosystem agents awaiting AI transformation & executive approval.</p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search queue..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="glass-input pl-9 pr-3 py-1.5 rounded-xl text-xs focus:outline-none w-44 sm:w-56"
            />
          </div>

          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="glass-input px-3 py-1.5 rounded-xl text-xs focus:outline-none font-semibold text-sky-300"
          >
            <option value="All" className="bg-slate-900 text-white">All Priorities</option>
            <option value="Critical" className="bg-slate-900 text-white">Critical</option>
            <option value="High" className="bg-slate-900 text-white">High</option>
            <option value="Normal" className="bg-slate-900 text-white">Normal</option>
          </select>
        </div>
      </div>

      {/* Queue Grid Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQueue.map((item) => (
          <div
            key={item.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-sky-500/30 transition-all space-y-3 shadow-lg group"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 font-semibold text-xs border border-sky-500/20 flex items-center space-x-1">
                  <Bot className="h-3.5 w-3.5" />
                  <span>{item.source_agent}</span>
                </span>
                <span className="text-slate-600 text-xs">➔</span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-semibold text-xs border border-indigo-500/20 flex items-center space-x-1">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>{item.audience}</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-semibold font-mono ${
                  item.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse' :
                  item.priority === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {item.priority} Priority
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-xs font-mono border border-emerald-500/20 flex items-center space-x-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>{(item.confidence * 100).toFixed(0)}% Confidence Score</span>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                <Clock className="h-3.5 w-3.5 text-slate-500" />
                <span>{item.created_at}</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition">{item.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-mono">
                {JSON.stringify(item.payload)}
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <span className={`text-xs font-semibold flex items-center space-x-1 ${
                item.status === 'Approved' ? 'text-emerald-400' :
                item.status === 'Rejected' ? 'text-rose-400' : 'text-sky-400'
              }`}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Status: {item.status}</span>
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-300 text-xs font-medium transition flex items-center space-x-1"
                >
                  <Eye className="h-3.5 w-3.5 text-sky-400" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleArchive(item.id, item.title)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-rose-400 text-slate-400 text-xs font-medium transition flex items-center space-x-1"
                >
                  <Archive className="h-3.5 w-3.5" />
                  <span>Archive</span>
                </button>

                <button
                  onClick={() => handleReject(item.id, item.title)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center space-x-1 transition"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => handleApprove(item.id, item.title)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1 transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Approve</span>
                </button>

                {onOpenStudioWithPayload && (
                  <button
                    onClick={() => onOpenStudioWithPayload(item)}
                    className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-md shadow-sky-500/20"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    <span>Regenerate & Transform</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payload Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Eye className="h-4 w-4 text-sky-400" />
                <span>Validated Payload Preview</span>
              </h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-white block">{previewItem.title}</span>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 max-h-60 overflow-y-auto">
                <pre>{JSON.stringify(previewItem.payload, null, 2)}</pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl bg-sky-500 text-white font-semibold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
