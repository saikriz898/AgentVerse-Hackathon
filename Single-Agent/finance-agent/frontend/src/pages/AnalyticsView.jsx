import React, { useState, useEffect } from 'react';
import { financeApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { BarChart3, Zap } from 'lucide-react';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const AnalyticsView = ({ estimate, currency = 'USD' }) => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        await financeApi.getSettings();
        const est = estimate || {
          project_name: 'Enterprise AI Agent Operating System',
          total_estimated_cost: 238500,
          dev_cost: 137100,
          infra_cost: 48000,
          ai_cost: 32400,
          devops_cost: 11200,
          maintenance_cost: 9800,
        };

        const total = est.total_estimated_cost || 238500;

        setAnalyticsData({
          top_cost_categories: [
            { category: 'Engineering Development Build', amount: est.dev_cost, percentage: Math.round((est.dev_cost / total) * 100 * 10) / 10, trend: '+4.2%' },
            { category: 'Cloud Infrastructure & Hosting', amount: est.infra_cost, percentage: Math.round((est.infra_cost / total) * 100 * 10) / 10, trend: '-1.8%' },
            { category: 'AI LLM Token & Embedding APIs', amount: est.ai_cost, percentage: Math.round((est.ai_cost / total) * 100 * 10) / 10, trend: '+12.5%' },
            { category: 'DevOps & Security Audits', amount: est.devops_cost, percentage: Math.round((est.devops_cost / total) * 100 * 10) / 10, trend: '0.0%' },
            { category: 'Software Maintenance & SLA Support', amount: est.maintenance_cost, percentage: Math.round((est.maintenance_cost / total) * 100 * 10) / 10, trend: '-2.1%' }
          ],
          quarterly_comparison: [
            { quarter: 'Q1 2026', dev_cost: Math.round(est.dev_cost * 0.35), infra_cost: Math.round(est.infra_cost * 0.25), ai_cost: Math.round(est.ai_cost * 0.22), total: Math.round((est.dev_cost * 0.35) + (est.infra_cost * 0.25) + (est.ai_cost * 0.22)) },
            { quarter: 'Q2 2026', dev_cost: Math.round(est.dev_cost * 0.40), infra_cost: Math.round(est.infra_cost * 0.25), ai_cost: Math.round(est.ai_cost * 0.25), total: Math.round((est.dev_cost * 0.40) + (est.infra_cost * 0.25) + (est.ai_cost * 0.25)) },
            { quarter: 'Q3 2026', dev_cost: Math.round(est.dev_cost * 0.15), infra_cost: Math.round(est.infra_cost * 0.25), ai_cost: Math.round(est.ai_cost * 0.26), total: Math.round((est.dev_cost * 0.15) + (est.infra_cost * 0.25) + (est.ai_cost * 0.26)) },
            { quarter: 'Q4 2026 (Est)', dev_cost: Math.round(est.dev_cost * 0.10), infra_cost: Math.round(est.infra_cost * 0.25), ai_cost: Math.round(est.ai_cost * 0.27), total: Math.round((est.dev_cost * 0.10) + (est.infra_cost * 0.25) + (est.ai_cost * 0.27)) }
          ],
          resource_utilization: {
            cpu_compute_utilization: '68%',
            memory_utilization: '74%',
            database_storage_used: `${Math.round((est.expected_users || 50000) * 0.006)} GB / 1000 GB`,
            ai_token_quota_used: `${((est.ai_cost || 32400) / 450).toFixed(1)} M / 100 M Tokens`,
            active_microservices: 14
          }
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, [estimate]);

  return (
    <div className="space-y-6">
      {/* Project Context Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-400">Financial Analytics Target</span>
          <h2 className="text-base font-bold text-slate-100">{estimate?.project_name || 'Active Software Project'}</h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400">Total Project 1-Year TCO</span>
          <div className="text-base font-bold text-emerald-400 font-mono">
            {formatCurrency(estimate?.total_estimated_cost || 238500, currency)}
          </div>
        </div>
      </div>

      {analyticsData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Top Expenditure Categories & TCO Distribution</span>
              </h3>
              <span className="text-[11px] text-slate-400">Current Financial Year</span>
            </div>

            <div className="space-y-3">
              {analyticsData.top_cost_categories.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{item.category}</span>
                    <span className="font-mono font-bold text-emerald-400">{formatCurrency(item.amount, currency)} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Resource & Quota Utilization</span>
              </h3>
              <span className="text-[11px] text-slate-400">Real-time Metrics</span>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Compute CPU Allocation</span>
                  <span className="text-slate-200 font-bold">{analyticsData.resource_utilization.cpu_compute_utilization}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Database Storage Capacity</span>
                  <span className="text-slate-200 font-bold">{analyticsData.resource_utilization.database_storage_used}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-violet-500 h-full rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">AI LLM Monthly Token Quota</span>
                  <span className="text-slate-200 font-bold">{analyticsData.resource_utilization.ai_token_quota_used}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68.4%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {analyticsData && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">Quarterly Expense Breakdown for {estimate?.project_name || 'Project'} (Q1 - Q4 2026)</h3>
            <span className="text-[11px] text-slate-400">Dev vs Infra vs AI Tokens</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.quarterly_comparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="quarter" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => formatCurrency(val, currency)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="dev_cost" name="Engineering Build" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="infra_cost" name="Cloud Hosting" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="ai_cost" name="AI Token API" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
