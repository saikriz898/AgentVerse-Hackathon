import React, { useEffect, useState, useCallback } from 'react';
import { reviewService } from '../services/reviewService';
import { DashboardStats } from '../types/review';
import { RefreshCw, ShieldAlert, Award } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await reviewService.getDashboardStats();
        if (isMounted) {
          setStats(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Quality Analytics & Distribution</h2>
          <p className="text-xs text-slate-400 mt-1">
            Deep insights into multi-agent quality scores, defect breakdown, and approval trends.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition flex items-center space-x-2 text-xs font-semibold"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quality Score Tier Distribution */}
        <div className="glass-card rounded-2xl p-6 border space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              Quality Score Distribution Tiers
            </h3>
            <span className="text-xs font-mono text-indigo-400 font-bold">Overall Avg: {stats?.avg_quality_score ?? 0}/100</span>
          </div>

          <div className="space-y-4">
            {(stats?.quality_distribution || []).map((dist, i) => {
              let color = 'bg-emerald-500';
              if (dist.tier.includes('Rejected')) color = 'bg-rose-500';
              else if (dist.tier.includes('Needs')) color = 'bg-amber-500';
              else if (dist.tier.includes('Acceptable')) color = 'bg-yellow-500';

              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{dist.tier}</span>
                    <span className="font-mono text-slate-400">{dist.count} reviews ({dist.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${color}`}
                      style={{ width: `${Math.max(5, dist.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Issue Category Distribution */}
        <div className="glass-card rounded-2xl p-6 border space-y-6">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Top Defect & Issue Categories
          </h3>

          <div className="space-y-4">
            {(stats?.issue_trends || []).map((trend, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-200">{trend.category}</p>
                  <p className="text-[11px] text-slate-400">Frequency Impact Rating</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {trend.percentage}% Impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
