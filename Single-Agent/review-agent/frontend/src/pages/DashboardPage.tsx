import React, { useEffect, useState, useCallback } from 'react';
import { reviewService } from '../services/reviewService';
import { DashboardStats, ReviewRecord } from '../types/review';
import { KPICard } from '../components/KPICard';
import { ScoreBadge } from '../components/ScoreBadge';
import { ReviewDetailModal } from '../components/ReviewDetailModal';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  BarChart3,
  Sparkles,
  ArrowRight,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeReviewDetail, setActiveReviewDetail] = useState<ReviewRecord | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleReviewClick = async (id: string) => {
    try {
      const details = await reviewService.getReviewById(id);
      setActiveReviewDetail(details);
    } catch (err) {
      console.error('Failed to fetch review detail:', err);
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-indigo-500/20 glow-indigo">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Quality Assurance Command Center</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">LifeOS Review Agent Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time automated verification, defect detection, and quality scoring across Research, Planning, Execution, Memory, and Communication Agents.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/new-review"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-2 glow-indigo"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Run New Review</span>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total QA Reviews"
          value={stats?.total_reviews ?? 0}
          subtitle="Processed across system"
          icon={ShieldCheck}
          color="indigo"
        />
        <KPICard
          title="Approved Outputs"
          value={stats?.approved_reviews ?? 0}
          subtitle={`Score >= 80`}
          icon={CheckCircle2}
          color="emerald"
        />
        <KPICard
          title="Rejected Outputs"
          value={stats?.rejected_reviews ?? 0}
          subtitle={`Score < 80`}
          icon={XCircle}
          color="rose"
        />
        <KPICard
          title="Avg Quality Score"
          value={`${stats?.avg_quality_score ?? 0} / 100`}
          subtitle={`Overall Approval Rate: ${stats?.approval_rate ?? 0}%`}
          icon={BarChart3}
          color="amber"
        />
      </div>

      {/* Agent Performance & Recent Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Agent Performance Matrix */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">Agent Performance Matrix</h3>
            <span className="text-xs text-slate-400">Total Reviewed Agents</span>
          </div>

          <div className="space-y-3">
            {(stats?.agent_performance || []).length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No agent performance records yet. Run your first review!</p>
            ) : (
              (stats?.agent_performance || []).map((agent, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-bold font-mono text-indigo-300">{agent.agent_name}</p>
                    <p className="text-xs text-slate-400">
                      Total Reviews: <span className="text-slate-200 font-mono">{agent.total_reviews}</span> | Approved: <span className="text-emerald-400 font-mono">{agent.approved_count}</span>
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-bold font-mono text-slate-100">{agent.avg_quality_score} <span className="text-xs text-slate-400 font-sans">Avg Score</span></p>
                    <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all"
                        style={{ width: `${agent.approval_rate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reviews Feed */}
        <div className="glass-card rounded-2xl p-6 border space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-100">Recent QA Feed</h3>
              <Link to="/history" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {(stats?.recent_reviews || []).length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No recent reviews.</p>
              ) : (
                (stats?.recent_reviews || []).map((rev) => (
                  <div
                    key={rev.id}
                    onClick={() => handleReviewClick(rev.id)}
                    className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold font-mono text-slate-200">{rev.agent_name}</p>
                      <p className="text-[11px] text-slate-400">{rev.review_type}</p>
                    </div>
                    <ScoreBadge score={rev.quality_score} status={rev.status} showLabel={false} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Link
              to="/new-review"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-indigo-500/20 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Validate Agent Output</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Review Detail Modal */}
      <ReviewDetailModal
        review={activeReviewDetail}
        onClose={() => setActiveReviewDetail(null)}
      />
    </div>
  );
};
