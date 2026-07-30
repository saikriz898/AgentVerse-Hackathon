import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AiSuggestionsWidget = ({ suggestions = [] }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">AI Cost Optimization Levers</h3>
            <p className="text-[11px] text-slate-400">Intelligent savings recommendations for current stack</p>
          </div>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          5 Levers Found
        </span>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all flex items-start gap-3 group"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-300 flex-1 leading-relaxed">{suggestion}</p>
            <button className="text-xs text-emerald-400 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity hover:underline shrink-0">
              Apply <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
