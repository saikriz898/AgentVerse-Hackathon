import React, { useEffect, useState } from 'react';
import { TransformationResult } from '../types/communication';
import { api } from '../services/api';
import { FileText, Search, Copy, Download, Share2, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { OutputPreview } from './OutputPreview';

export const ExecutiveSummariesView: React.FC = () => {
  const [summaries, setSummaries] = useState<TransformationResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDoc, setSelectedDoc] = useState<TransformationResult | null>(null);

  useEffect(() => {
    api.getHistory({ document_type: "Executive Summary", limit: 30 })
      .then((records) => {
        setSummaries(records);
        if (records.length > 0) setSelectedDoc(records[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-3">
        <FileText className="h-5 w-5 text-indigo-400" />
        <div>
          <h2 className="text-lg font-semibold text-white">Executive Summaries & Briefs</h2>
          <p className="text-xs text-slate-400">Condensed top-line updates formatted for Board Members, Executives, and Managers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Summaries List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-xs">Loading Executive Briefs...</div>
          ) : summaries.length === 0 ? (
            <div className="glass-panel p-8 text-center text-slate-400 rounded-2xl border border-slate-800 text-xs">
              No executive summaries generated yet. Launch Transformation Studio to generate one.
            </div>
          ) : (
            summaries.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  selectedDoc?.id === doc.id
                    ? 'bg-indigo-500/10 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'glass-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-white truncate">{doc.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                    {doc.input_agent}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {doc.summary || doc.content}
                </p>
                <div className="text-[10px] text-slate-500 font-mono pt-1">
                  Target: {doc.output_destination} • {doc.generated_at ? new Date(doc.generated_at).toLocaleDateString() : doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Today'}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Reader Preview (7 Cols) */}
        <div className="lg:col-span-7">
          <OutputPreview result={selectedDoc} loading={false} />
        </div>

      </div>

    </div>
  );
};
