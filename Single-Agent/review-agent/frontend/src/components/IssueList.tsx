import React from 'react';
import { IssueItem } from '../types/review';
import { ShieldAlert, AlertTriangle, Lightbulb } from 'lucide-react';

interface IssueListProps {
  issues: IssueItem[];
  warnings?: string[];
  suggestions?: string[];
}

export const IssueList: React.FC<IssueListProps> = ({ issues, warnings = [], suggestions = [] }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Low</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Issues */}
      <div>
        <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Detected Issues ({issues.length})
        </h4>
        {issues.length === 0 ? (
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300">
            ✓ No critical issues detected!
          </div>
        ) : (
          <div className="space-y-2">
            {issues.map((issue, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono text-slate-300">
                    <span className="font-bold text-indigo-400">{issue.code}</span>
                    {issue.field && <span className="text-slate-500">[{issue.field}]</span>}
                  </div>
                  {getSeverityBadge(issue.severity)}
                </div>
                <p className="text-slate-300 leading-relaxed">{issue.message}</p>
                {issue.suggestion && (
                  <p className="text-emerald-400/90 text-[11px] flex items-center gap-1 mt-1">
                    <Lightbulb className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="italic">Suggestion: {issue.suggestion}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Warnings ({warnings.length})
          </h4>
          <ul className="space-y-1.5 pl-2">
            {warnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-300/90 flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
            Recommendations ({suggestions.length})
          </h4>
          <ul className="space-y-1.5 pl-2">
            {suggestions.map((s, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-indigo-400 font-bold">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
