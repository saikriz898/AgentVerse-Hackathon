import React, { useEffect, useState } from 'react';
import { TransformationResult } from '../types/communication';
import { api } from '../services/api';
import { History, Search, RefreshCw, AlertTriangle } from 'lucide-react';
import { OutputPreview } from './OutputPreview';

export const HistoryViewer: React.FC = () => {
  const [history, setHistory] = useState<TransformationResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<TransformationResult | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const records = await api.getHistory({
        source_agent: selectedAgent || undefined,
        limit: 50
      });
      setHistory(records);
      if (records.length > 0 && !selectedRecord) {
        setSelectedRecord(records[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedAgent]);

  const filtered = history.filter(r => {
    const docType = (r.output_type || r.document_type || '').toString().toLowerCase();
    const contentText = (r.transformed_content || r.content || '').toLowerCase();
    const agentName = (r.input_agent || '').toLowerCase();
    const destName = (r.output_destination || '').toLowerCase();
    const query = search.toLowerCase();

    return docType.includes(query) || contentText.includes(query) || agentName.includes(query) || destName.includes(query);
  });

  return (
    <div className="space-y-6">
      
      {/* Header Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <History className="h-5 w-5 text-sky-400" />
          <h2 className="text-lg font-semibold text-white">Transformation Log History</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input text-xs rounded-xl pl-9 pr-3 py-2 w-48 sm:w-64 focus:outline-none"
            />
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchHistory}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
            title="Refresh logs"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Main History Table + Reader Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Log List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-xs">Loading records...</div>
          ) : filtered.length === 0 ? (
            <div className="glass-panel p-8 text-center text-slate-400 rounded-2xl border border-slate-800">
              No transformation history found.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedRecord(item)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedRecord?.id === item.id
                    ? 'bg-sky-500/10 border-sky-500/40 shadow-lg shadow-sky-500/10'
                    : 'glass-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-white">{item.title || item.output_type || item.document_type}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(item.generated_at || item.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs mb-2">
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-medium">
                    {item.input_agent}
                  </span>
                  <span className="text-slate-600">➔</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium">
                    {item.output_destination}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary || item.executive_summary || item.content || item.transformed_content}
                </p>

                {item.has_missing_info && (
                  <div className="mt-2 text-[10px] text-amber-400 flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Incomplete payload notice attached</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Preview Panel (7 Cols) */}
        <div className="lg:col-span-7">
          <OutputPreview result={selectedRecord} loading={false} />
        </div>

      </div>

    </div>
  );
};
