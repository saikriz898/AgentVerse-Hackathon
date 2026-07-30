import React from 'react';
import { FileText, Download } from 'lucide-react';

export const SavedReportsWidget = ({
  reports = [],
  onDownloadReport,
}) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/30">
            <FileText className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Saved Financial Reports</h3>
        </div>
        <span className="text-xs text-violet-400 font-semibold cursor-pointer hover:underline">All Reports</span>
      </div>

      <div className="space-y-3">
        {reports.slice(0, 4).map((rep) => (
          <div key={rep.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all">
            <div className="truncate mr-3">
              <h4 className="text-xs font-semibold text-slate-200 truncate">{rep.report_title}</h4>
              <p className="text-[10px] text-slate-400">{rep.report_type} • {rep.file_format}</p>
            </div>
            <button
              onClick={() => onDownloadReport && onDownloadReport(rep)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-violet-600 text-slate-300 hover:text-white transition-colors shrink-0"
              title="Download Report"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
