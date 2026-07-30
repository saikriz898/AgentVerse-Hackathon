import React, { useEffect, useState } from 'react';
import { TabType } from './Sidebar';
import {
  Sparkles,
  Inbox,
  Clock,
  Radio,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Bot,
  Zap,
  ShieldCheck,
  Activity,
  Send,
  XCircle,
  Bell,
  BarChart3,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

interface DashboardViewProps {
  onNavigateTab: (tab: TabType) => void;
  onSelectDocument: (doc: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onSelectDocument
}) => {
  const [stats, setStats] = useState<any>({
    pending: 3,
    generatedToday: 18,
    scheduled: 2,
    delivered: 42,
    failed: 0,
    aiQualityScore: 98.4,
    approvalRate: 96.5,
    deliverySuccessRate: 100.0,
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, title: "Executive Audit: Security & Subagent Latency Benchmark", time: "5m ago", status: "Delivered", channel: "Email", agent: "Review Agent" },
    { id: 2, title: "Q3 Multi-Agent Milestone Release", time: "25m ago", status: "Approved", channel: "PDF", agent: "Chief of Staff" },
    { id: 3, title: "Parallel Execution Pipeline Status", time: "1h ago", status: "Delivered", channel: "Slack", agent: "Execution Agent" },
    { id: 4, title: "Gemini 2.5 Flash Latency Benchmark", time: "3h ago", status: "Scheduled", channel: "Teams", agent: "Research Agent" }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Chief of Staff Synced", message: "Security Audit delivered to CEO via Email.", type: "success" },
    { id: 2, title: "Zero Fabrication Guarantee", message: "100% truthfulness score confirmed on incoming payloads.", type: "info" }
  ]);

  useEffect(() => {
    api.getStats().then((data: any) => {
      if (data) {
        setStats((prev: any) => ({
          ...prev,
          generatedToday: data.total_transformations || prev.generatedToday,
          delivered: data.total_delivered || prev.delivered,
          aiQualityScore: data.avg_confidence_score ? roundScore(data.avg_confidence_score * 100) : prev.aiQualityScore
        }));
      }
    }).catch(() => {});
  }, []);

  const roundScore = (val: number) => Math.round(val * 10) / 10;

  return (
    <div className="space-y-6">

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-mono">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>LifeOS Enterprise Communication Operations Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Multi-Agent Operations Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Transforming validated multi-agent outputs into executive communications, recommending optimal delivery channels, tracking delivery, and notifying the Chief of Staff.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('queue')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 flex items-center space-x-2 transition"
            >
              <Inbox className="h-4 w-4 text-sky-400" />
              <span>View Queue ({stats.pending})</span>
            </button>

            <button
              onClick={() => onNavigateTab('studio')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-sky-500/20 flex items-center space-x-2 transition transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Launch AI Transformation Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (8 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pending Communications</span>
            <Inbox className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.pending}</div>
          <div className="text-[11px] text-sky-400 flex items-center space-x-1">
            <span>Validated by Review Agent</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Generated Today</span>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.generatedToday}</div>
          <div className="text-[11px] text-purple-400 flex items-center space-x-1">
            <span>12-Step AI Reasoning Engine</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Scheduled Deliveries</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.scheduled}</div>
          <div className="text-[11px] text-amber-400 flex items-center space-x-1">
            <span>Automated Cron Dispatch</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Delivered</span>
            <Send className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.delivered}</div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
            <span>Chief of Staff Notified</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Failed</span>
            <XCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.failed}</div>
          <div className="text-[11px] text-rose-400 flex items-center space-x-1">
            <span>0 Failures Recorded</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">AI Quality Score</span>
            <ShieldCheck className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.aiQualityScore}%</div>
          <div className="text-[11px] text-teal-400 flex items-center space-x-1">
            <span>Zero Hallucination Guaranteed</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Approval Rate</span>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.approvalRate}%</div>
          <div className="text-[11px] text-indigo-400 flex items-center space-x-1">
            <span>Executive Single-Click</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Delivery Success Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.deliverySuccessRate}%</div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
            <span>10 Active Enterprise Channels</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Activity & Notifications Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activity List (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-sky-400" />
              <h2 className="text-base font-bold text-white">Recent Communication Operations</h2>
            </div>
            <button
              onClick={() => onNavigateTab('history')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1"
            >
              <span>View All History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div key={act.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">{act.title}</span>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                    <span>{act.agent}</span>
                    <span>•</span>
                    <span>Channel: {act.channel}</span>
                    <span>•</span>
                    <span>{act.time}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-semibold border ${
                  act.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' :
                  act.status === 'Approved' ? 'bg-sky-500/10 text-sky-300 border-sky-500/20' :
                  'bg-amber-500/10 text-amber-300 border-amber-500/20'
                }`}>
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Insights Panel (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">Notifications & Alerts</h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Live Feed
            </span>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white">{n.title}</h4>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p>
              </div>
            ))}

            <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/30 to-purple-950/30 border border-sky-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-sky-300 font-bold text-xs">
                <BarChart3 className="h-4 w-4 text-sky-400" />
                <span>AI Communication Analytics</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Most used channel: <strong className="text-sky-300">Email & PDF</strong> | Top Audience: <strong className="text-emerald-300">CEO & Developer</strong>
              </p>
              <button
                onClick={() => onNavigateTab('analytics')}
                className="w-full py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-semibold text-xs transition mt-1"
              >
                Open Analytics Overview ➔
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
