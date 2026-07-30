import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const KpiCard = ({
  title,
  value,
  isCurrency = true,
  currency = 'USD',
  change,
  changeType = 'positive',
  subtext,
  icon: Icon,
  colorScheme = 'emerald',
}) => {
  const formattedValue = typeof value === 'number'
    ? (isCurrency ? formatCurrency(value, currency) : value.toLocaleString())
    : value;

  const colorStyles = {
    emerald: {
      bgIcon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glow: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10',
    },
    indigo: {
      bgIcon: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      glow: 'hover:border-indigo-500/40 hover:shadow-indigo-500/10',
    },
    violet: {
      bgIcon: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      glow: 'hover:border-violet-500/40 hover:shadow-violet-500/10',
    },
    amber: {
      bgIcon: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      glow: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
    },
    cyan: {
      bgIcon: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      glow: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
    },
    rose: {
      bgIcon: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      glow: 'hover:border-rose-500/40 hover:shadow-rose-500/10',
    },
  }[colorScheme] || {
    bgIcon: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    glow: 'hover:border-emerald-500/40',
  };

  return (
    <div className={`glass-panel p-5 rounded-2xl border border-slate-800 transition-all duration-300 hover:-translate-y-0.5 shadow-lg ${colorStyles.glow}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{title}</span>
        <div className={`p-2.5 rounded-xl border ${colorStyles.bgIcon}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-extrabold text-slate-100 tracking-tight">{formattedValue}</h3>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
            changeType === 'positive'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : changeType === 'negative'
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              : 'bg-slate-800 text-slate-300'
          }`}>
            {changeType === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      {subtext && <p className="text-[11px] text-slate-400 mt-2">{subtext}</p>}
    </div>
  );
};
