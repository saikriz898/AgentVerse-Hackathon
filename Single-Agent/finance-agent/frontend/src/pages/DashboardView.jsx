import React from 'react';
import { KpiCard } from '../components/KpiCard';
import { RecentEstimatesWidget } from '../components/RecentEstimatesWidget';
import { SavedReportsWidget } from '../components/SavedReportsWidget';
import { AiSuggestionsWidget } from '../components/AiSuggestionsWidget';
import { FinancialRiskAlertsWidget } from '../components/FinancialRiskAlertsWidget';
import { formatCurrency } from '../utils/formatters';

import {
  DollarSign,
  Code2,
  Cloud,
  Calendar,
  TrendingUp,
  Percent,
  PieChart as PieIcon,
  ShieldCheck
} from 'lucide-react';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from 'recharts';

export const DashboardView = ({
  estimate,
  budget,
  recentEstimates = [],
  currency = 'USD',
  onSelectEstimate,
  onNavigateTab,
}) => {
  const costDistributionData = [
    { name: 'Engineering Dev', value: estimate.dev_cost, color: '#10b981' },
    { name: 'Cloud Infrastructure', value: estimate.infra_cost, color: '#6366f1' },
    { name: 'AI Services & APIs', value: estimate.ai_cost, color: '#8b5cf6' },
    { name: 'DevOps & Security', value: estimate.devops_cost, color: '#f59e0b' },
    { name: 'Software Maintenance', value: estimate.maintenance_cost, color: '#06b6d4' },
  ];

  const budgetAllocationData = (budget.department_allocations || []).map((d) => ({
    name: d.department.split(' ')[0],
    Allocated: d.allocated_amount,
    Spent: d.spent_amount,
  }));

  const monthlyExpenseTrend = [
    { month: 'Jan', cloud: 3400, dev: 22000, ai: 1800, total: 27200 },
    { month: 'Feb', cloud: 3600, dev: 24000, ai: 2100, total: 29700 },
    { month: 'Mar', cloud: 3900, dev: 28000, ai: 2600, total: 34500 },
    { month: 'Apr', cloud: 4100, dev: 26000, ai: 2900, total: 33000 },
    { month: 'May', cloud: 4300, dev: 22000, ai: 3400, total: 29700 },
    { month: 'Jun', cloud: 4500, dev: 18000, ai: 3900, total: 26400 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active Project
            </span>
            <h2 className="text-xl font-bold text-slate-100">{estimate.project_name}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {estimate.project_type} • {estimate.industry} • {(estimate.expected_users || 0).toLocaleString()} Expected Users • Confidence Score: <span className="text-emerald-400 font-bold">{estimate.confidence_score}%</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('estimator')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-500/20"
          >
            Re-Estimate Project
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            Export Financial Report
          </button>
        </div>
      </div>

      {/* 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Estimated Cost"
          value={estimate.total_estimated_cost}
          currency={currency}
          change="+3.4%"
          changeType="positive"
          subtext="Total 1-Year TCO projection"
          icon={DollarSign}
          colorScheme="emerald"
        />
        <KpiCard
          title="Development Cost"
          value={estimate.dev_cost}
          currency={currency}
          change="One-time"
          subtext="Engineering & UI build"
          icon={Code2}
          colorScheme="indigo"
        />
        <KpiCard
          title="Infrastructure Cost"
          value={estimate.infra_cost}
          currency={currency}
          change="-2.1%"
          changeType="positive"
          subtext="Annual cloud & hosting"
          icon={Cloud}
          colorScheme="violet"
        />
        <KpiCard
          title="Monthly Operating Cost"
          value={estimate.monthly_operating_cost}
          currency={currency}
          change="+1.5%"
          changeType="negative"
          subtext="Cloud, AI tokens & maintenance"
          icon={Calendar}
          colorScheme="cyan"
        />
        <KpiCard
          title="Annual Operating Cost"
          value={estimate.annual_operating_cost}
          currency={currency}
          subtext="12-month operational run-rate"
          icon={PieIcon}
          colorScheme="amber"
        />
        <KpiCard
          title="ROI (3-Year)"
          value="184.5%"
          isCurrency={false}
          change="+12.0%"
          changeType="positive"
          subtext="Expected 3-year return"
          icon={TrendingUp}
          colorScheme="emerald"
        />
        <KpiCard
          title="Profit Margin"
          value="64.2%"
          isCurrency={false}
          change="Healthy"
          subtext="Projected net margin"
          icon={Percent}
          colorScheme="indigo"
        />
        <KpiCard
          title="Budget Utilization"
          value={`${Math.round((budget.total_spent / (budget.total_budget || 1)) * 100)}%`}
          isCurrency={false}
          change="68.7% spent"
          subtext={`${formatCurrency(budget.remaining_budget, currency)} remaining`}
          icon={ShieldCheck}
          colorScheme="violet"
        />
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-100">Cost Distribution Breakdown</h3>
            <span className="text-[11px] text-slate-400">By Tier</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {costDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => formatCurrency(val, currency)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {costDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-300 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Department Budget Allocation vs Spent</h3>
              <p className="text-[11px] text-slate-400">Track department budget utilization</p>
            </div>
            <button
              onClick={() => onNavigateTab('budget')}
              className="text-xs text-emerald-400 hover:underline"
            >
              Open Planner
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetAllocationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => formatCurrency(val, currency)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Allocated" fill="#334155" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Spent" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Monthly Expense Forecast & Run-Rate</h3>
            <p className="text-[11px] text-slate-400">Engineering development vs Cloud hosting vs AI token expenses</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-medium text-slate-300">H1 2026</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyExpenseTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                formatter={(val) => formatCurrency(val, currency)}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentEstimatesWidget estimates={recentEstimates} currency={currency} onSelectEstimate={onSelectEstimate} />
        <AiSuggestionsWidget suggestions={estimate.optimization_suggestions || []} />
        <SavedReportsWidget
          reports={[
            { id: '1', report_title: 'Q3 2026 Executive Financial Summary', report_type: 'Executive Summary', author: 'AI Financial Architect', summary: '', report_data: {}, file_format: 'PDF', created_at: '' },
            { id: '2', report_title: 'SaaS AI Copilot Cost Breakdown Report', report_type: 'Project Cost Report', author: 'AI Financial Architect', summary: '', report_data: {}, file_format: 'PDF', created_at: '' }
          ]}
          onDownloadReport={(rep) => alert(`Downloading ${rep.report_title}...`)}
        />
        <FinancialRiskAlertsWidget risks={estimate.risk_assessment || []} />
      </div>
    </div>
  );
};
