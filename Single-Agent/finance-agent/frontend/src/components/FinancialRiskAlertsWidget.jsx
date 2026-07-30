import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const FinancialRiskAlertsWidget = ({ risks = [] }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Financial Risk Assessment</h3>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
          3 Active Alerts
        </span>
      </div>

      <div className="space-y-3">
        {risks.map((item, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-3">
            <ShieldAlert className={`w-4 h-4 mt-0.5 shrink-0 ${
              item.severity === 'High' ? 'text-rose-400' : item.severity === 'Medium' ? 'text-amber-400' : 'text-cyan-400'
            }`} />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">{item.risk}</span>
                <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded uppercase ${
                  item.severity === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {item.severity}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">{item.mitigation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
