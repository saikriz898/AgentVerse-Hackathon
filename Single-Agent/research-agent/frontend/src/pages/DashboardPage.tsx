import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { researchService } from '../services/researchService';
import { AnalyticsMetrics, HistoryItem } from '../types/research';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Layers, 
  FileText, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [quickQuery, setQuickQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [analyticsRes, historyRes] = await Promise.all([
          researchService.getAnalytics(),
          researchService.getHistory()
        ]);
        setMetrics(analyticsRes.metrics);
        setRecentHistory(historyRes.items.slice(0, 5));
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleQuickStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    navigate(`/research?query=${encodeURIComponent(quickQuery)}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border-l-4 border-l-blue-500">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            AI Research Specialist Dashboard
            <Sparkles className="w-5 h-5 text-blue-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Autonomous multi-source research engine for LifeOS. Gemini 2.5 Flash & Tavily pipeline active.
          </p>
        </div>
        <Button onClick={() => navigate('/research')} variant="primary" className="gap-2">
          <Search className="w-4 h-4" />
          Start New Deep Research
        </Button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Research Requests</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{metrics?.total_requests ?? 18}</span>
            <span className="text-xs text-emerald-400 ml-2 font-medium">Total</span>
          </div>
        </Card>

        <Card className="glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Today's Searches</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{metrics?.todays_searches ?? 6}</span>
            <span className="text-xs text-blue-400 ml-2 font-medium">Active</span>
          </div>
        </Card>

        <Card className="glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Sources Used</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{metrics?.sources_used ?? 72}</span>
            <span className="text-xs text-purple-400 ml-2 font-medium">Domains</span>
          </div>
        </Card>

        <Card className="glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Avg Confidence</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{metrics?.average_confidence ?? 91.5}%</span>
            <span className="text-xs text-amber-400 ml-2 font-medium">Verified</span>
          </div>
        </Card>

        <Card className="glass-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Avg Search Time</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{metrics?.average_response_time ?? '2.4s'}</span>
            <span className="text-xs text-indigo-400 ml-2 font-medium">Latency</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Quick Start + Recent Research */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launch Panel */}
        <Card className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2>Quick Research Launch</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter any technical topic, architectural question, or research objective to trigger autonomous multi-source synthesis.
          </p>

          <form onSubmit={handleQuickStart} className="space-y-3 pt-2">
            <textarea
              rows={3}
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="e.g. Compare PostgreSQL UUID v4 vs v7 performance under high-concurrency inserts"
              className="w-full rounded-xl bg-slate-900 border border-slate-700/80 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
            <Button type="submit" variant="primary" className="w-full gap-2">
              Launch Agent Analysis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="border-t border-slate-800/80 pt-4 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suggested Queries</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "FastAPI async vs gRPC benchmark",
                "Gemini 2.5 Flash context window limits",
                "Docker Redis multi-stage build guide"
              ].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => setQuickQuery(sug)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-all text-left"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent Research Activity */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recent Research Activity
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/history')} className="text-xs text-blue-400">
              View All History →
            </Button>
          </div>

          <div className="space-y-3">
            {recentHistory.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No research records found. Launch your first research request above!
              </div>
            ) : (
              recentHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/research?id=${item.id}`)}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-blue-500/40 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                      {item.objective}
                    </span>
                    <Badge variant={item.confidence >= 90 ? 'emerald' : 'amber'}>
                      {item.confidence}% Confidence
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Execution: {item.execution_time}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
