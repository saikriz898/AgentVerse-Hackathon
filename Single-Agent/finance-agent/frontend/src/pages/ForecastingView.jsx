import React, { useState, useEffect } from 'react';
import { financeApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { LineChart as LineChartIcon } from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const ForecastingView = ({ estimate, currency = 'USD' }) => {
  const [months, setMonths] = useState(24);
  const [scenario, setScenario] = useState('Base');
  const [forecastData, setForecastData] = useState(null);

  const fetchForecast = async () => {
    try {
      const data = await financeApi.getForecast(months, scenario);
      if (data && estimate) {
        const scaleFactor = (estimate.monthly_operating_cost || 8450) / 7500;
        data.total_forecasted_expenses = Math.round(data.total_forecasted_expenses * scaleFactor);
        data.total_forecasted_revenue = Math.round(data.total_forecasted_revenue * scaleFactor);
        data.forecast_timeline = (data.forecast_timeline || []).map((item) => ({
          ...item,
          infrastructure_cost: Math.round(item.infrastructure_cost * scaleFactor),
          cloud_ai_cost: Math.round(item.cloud_ai_cost * scaleFactor),
          maintenance_cost: Math.round(item.maintenance_cost * scaleFactor),
          support_cost: Math.round(item.support_cost * scaleFactor),
          total_monthly_expenses: Math.round(item.total_monthly_expenses * scaleFactor),
          projected_revenue: Math.round(item.projected_revenue * scaleFactor),
        }));
      }
      setForecastData(data);
    } catch (err) {
      console.error('Failed to get forecast:', err);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [months, scenario, estimate]);

  return (
    <div className="space-y-6">
      {/* Project Context Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-violet-400">Forecasting Target</span>
          <h2 className="text-base font-bold text-slate-100">{estimate?.project_name || 'Active Software Project'}</h2>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400">Base Monthly Operating Run-Rate</span>
          <div className="text-base font-bold text-emerald-400 font-mono">
            {formatCurrency(estimate?.monthly_operating_cost || 8450, currency)}/mo
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-violet-400" />
              <span>Predictive Financial Expense & Scaling Forecast</span>
            </h3>
            <p className="text-[11px] text-slate-400">Multi-year predictive expense modeling for {estimate?.project_name || 'your project'}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              {[12, 24, 36].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    months === m ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m} Months
                </button>
              ))}
            </div>

            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              {['Conservative', 'Base', 'Aggressive'].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setScenario(sc)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    scenario === sc ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {forecastData && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Projected Expenses</span>
              <div className="text-2xl font-extrabold text-slate-100 font-mono mt-1">
                {formatCurrency(forecastData.total_forecasted_expenses, currency)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Growth Rate: {forecastData.monthly_expense_growth_rate}/mo</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Projected Revenue</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                {formatCurrency(forecastData.total_forecasted_revenue, currency)}
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">Net Cashflow Positive</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Forecast Growth Scenario</span>
              <div className="text-2xl font-extrabold text-violet-400 mt-1">{forecastData.scenario}</div>
              <p className="text-[11px] text-slate-400 mt-1">{forecastData.horizon_months}-month horizon timeline</p>
            </div>
          </div>
        )}
      </div>

      {forecastData && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">Forecast Expense Composition vs Revenue Growth</h3>
            <span className="text-[11px] text-slate-400">Stack: Infra + Maintenance + AI LLM + SLA Support</span>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData.forecast_timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="infrastructure_cost" name="Cloud Infrastructure" stackId="1" stroke="#6366f1" fill="#6366f1" />
                <Area type="monotone" dataKey="cloud_ai_cost" name="AI LLM Tokens" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                <Area type="monotone" dataKey="maintenance_cost" name="Maintenance" stackId="1" stroke="#06b6d4" fill="#06b6d4" />
                <Area type="monotone" dataKey="support_cost" name="Support" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                <Area type="monotone" dataKey="projected_revenue" name="Projected Revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
