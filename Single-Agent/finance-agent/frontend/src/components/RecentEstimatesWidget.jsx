import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { Calculator, ArrowUpRight } from 'lucide-react';

export const RecentEstimatesWidget = ({
  estimates = [],
  currency = 'USD',
  onSelectEstimate,
}) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Calculator className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Recent Project Estimates</h3>
        </div>
        <span className="text-xs text-indigo-400 hover:underline cursor-pointer">View All ({estimates.length})</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <th className="pb-2.5">Project</th>
              <th className="pb-2.5">Type</th>
              <th className="pb-2.5 text-right">Est. Cost</th>
              <th className="pb-2.5 text-right">Monthly Ops</th>
              <th className="pb-2.5 text-center">Confidence</th>
              <th className="pb-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {estimates.map((est) => (
              <tr key={est.id} className="hover:bg-slate-800/40 transition-colors group cursor-pointer" onClick={() => onSelectEstimate && onSelectEstimate(est)}>
                <td className="py-3 font-semibold text-slate-100">{est.project_name}</td>
                <td className="py-3 text-slate-400">{est.project_type}</td>
                <td className="py-3 text-right font-mono font-bold text-emerald-400">{formatCurrency(est.total_estimated_cost, currency)}</td>
                <td className="py-3 text-right font-mono text-slate-300">{formatCurrency(est.monthly_operating_cost, currency)}/mo</td>
                <td className="py-3 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {est.confidence_score}%
                  </span>
                </td>
                <td className="py-3 text-right">
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
