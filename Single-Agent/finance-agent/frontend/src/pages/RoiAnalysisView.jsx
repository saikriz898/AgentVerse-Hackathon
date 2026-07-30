import React, { useState, useEffect } from 'react';
import { financeApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp } from 'lucide-react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const RoiAnalysisView = ({ estimate, currency = 'USD' }) => {
  const [devInvestment, setDevInvestment] = useState(estimate?.dev_cost || 137100);
  const [monthlyOps, setMonthlyOps] = useState(estimate?.monthly_operating_cost || 8450);
  const [arpu, setArpu] = useState(49);
  const [subscribers, setSubscribers] = useState(Math.round((estimate?.expected_users || 50000) * 0.05));
  const [roiData, setRoiData] = useState(null);

  useEffect(() => {
    if (estimate) {
      setDevInvestment(estimate.dev_cost || 137100);
      setMonthlyOps(estimate.monthly_operating_cost || 8450);
      setSubscribers(Math.max(500, Math.round((estimate.expected_users || 50000) * 0.05)));
    }
  }, [estimate]);

  const fetchRoi = async () => {
    try {
      const data = await financeApi.calculateRoi(devInvestment, monthlyOps, arpu, subscribers);
      setRoiData(data);
    } catch (err) {
      console.error('Failed to calculate ROI:', err);
    }
  };

  useEffect(() => {
    fetchRoi();
  }, [devInvestment, monthlyOps, arpu, subscribers]);

  return (
    <div className="space-y-6">
      {/* Project Context Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-400">ROI Project Model</span>
          <h2 className="text-base font-bold text-slate-100">{estimate?.project_name || 'Active Software Project'}</h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400">Initial Engineering Investment</span>
          <div className="text-base font-bold text-emerald-400 font-mono">
            {formatCurrency(estimate?.dev_cost || 137100, currency)}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Interactive ROI & Financial Break-even Model</span>
            </h3>
            <p className="text-[11px] text-slate-400">Simulate investment recovery and subscriber growth for {estimate?.project_name || 'your project'}</p>
          </div>
          {roiData && (
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              3-Year ROI: +{roiData.roi_percentage_3yr}%
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Initial Dev Investment</span>
              <span className="text-emerald-400 font-mono font-bold">{formatCurrency(devInvestment, currency)}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="500000"
              step="5000"
              value={devInvestment}
              onChange={(e) => setDevInvestment(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Monthly Operating Cost</span>
              <span className="text-emerald-400 font-mono font-bold">{formatCurrency(monthlyOps, currency)}/mo</span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="500"
              value={monthlyOps}
              onChange={(e) => setMonthlyOps(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Avg Revenue Per User (ARPU)</span>
              <span className="text-emerald-400 font-mono font-bold">{formatCurrency(arpu, currency)}/mo</span>
            </div>
            <input
              type="range"
              min="10"
              max="250"
              step="5"
              value={arpu}
              onChange={(e) => setArpu(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300">Target Paying Subscribers</span>
              <span className="text-emerald-400 font-mono font-bold">{subscribers.toLocaleString()} Users</span>
            </div>
            <input
              type="range"
              min="250"
              max="20000"
              step="250"
              value={subscribers}
              onChange={(e) => setSubscribers(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {roiData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">Expected Monthly Revenue</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              {formatCurrency(roiData.monthly_revenue, currency)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">At {(roiData.target_subscribers || 0).toLocaleString()} subscribers</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">Net Monthly Profit</span>
            <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
              {formatCurrency(roiData.monthly_net_profit, currency)}
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold mt-1">{roiData.profit_margin}% Profit Margin</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">Break-even Point</span>
            <div className="text-2xl font-extrabold text-indigo-400 font-mono mt-1">
              Month {roiData.break_even_month}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">~{roiData.payback_period_years} years payback period</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">3-Year Net Profit</span>
            <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
              {formatCurrency(
                (roiData.projections?.year1?.net || 0) +
                (roiData.projections?.year2?.net || 0) +
                (roiData.projections?.year3?.net || 0),
                currency
              )}
            </div>
            <p className="text-[11px] text-amber-400 font-semibold mt-1">Cumulative net earnings</p>
          </div>
        </div>
      )}

      {roiData && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">24-Month Cumulative Revenue vs Investment Cost Curve</h3>
              <p className="text-[11px] text-slate-400">Visualization of investment recovery and cashflow break-even point</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
              Break-even at M{roiData.break_even_month}
            </span>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData.monthly_chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  formatter={(val) => formatCurrency(val, currency)}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="cumulative_cost" name="Cumulative Cost" stroke="#f43f5e" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="cumulative_revenue" name="Cumulative Revenue" stroke="#10b981" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
