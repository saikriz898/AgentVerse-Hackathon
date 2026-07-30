import React, { useEffect, useState } from 'react';
import { TransformationResult } from '../types/communication';
import { api } from '../services/api';
import {
  FileSpreadsheet,
  Search,
  Plus,
  RefreshCw,
  Globe,
  Trash2
} from 'lucide-react';
import { OutputPreview } from './OutputPreview';
import { ConfirmModal } from './ConfirmModal';

interface ReportsViewProps {
  onSelectDocument: (doc: TransformationResult) => void;
  onOpenStudio: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onSelectDocument, onOpenStudio, onShowToast }) => {
  const [reports, setReports] = useState<TransformationResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  const [selectedDoc, setSelectedDoc] = useState<TransformationResult | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const records = await api.getHistory({
        source_agent: selectedAgent || undefined,
        document_type: selectedType || undefined,
        limit: 50
      });
      setReports(records);
      if (records.length > 0 && !selectedDoc) {
        setSelectedDoc(records[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedAgent, selectedType]);

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.deleteRecord(deleteTargetId);
      setReports(reports.filter(r => r.id !== deleteTargetId));
      if (selectedDoc?.id === deleteTargetId) {
        setSelectedDoc(null);
      }
      if (onShowToast) onShowToast("Report Deleted", "The selected report was removed from the database.", "info");
    } catch (err) {
      console.error(err);
      if (onShowToast) onShowToast("Delete Failed", "Could not remove report record.", "error");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const filtered = reports.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.content.toLowerCase().includes(search.toLowerCase()) ||
    r.input_agent.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Action Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <FileSpreadsheet className="h-5 w-5 text-sky-400" />
          <div>
            <h2 className="text-lg font-semibold text-white">Reports Manager</h2>
            <p className="text-xs text-slate-400">View, manage, export, and duplicate generated agent reports.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input text-xs rounded-xl pl-9 pr-3 py-2 w-44 sm:w-56 focus:outline-none"
            />
          </div>

          <button
            onClick={fetchReports}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={onOpenStudio}
            className="py-2 px-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center space-x-1.5 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>

      </div>

      {/* Main Grid: Data Table + Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Reports Table (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-slate-400 font-mono text-xs">Loading reports database...</div>
          ) : filtered.length === 0 ? (
            <div className="glass-panel p-8 text-center text-slate-400 rounded-2xl border border-slate-800 text-xs">
              No reports match current filters.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedDoc(item);
                  onSelectDocument(item);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                  selectedDoc?.id === item.id
                    ? 'bg-sky-500/10 border-sky-500/40 shadow-lg shadow-sky-500/10'
                    : 'glass-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-white truncate pr-2">{item.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-mono shrink-0">
                    {item.document_type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                      {item.input_agent}
                    </span>
                    <span>➔</span>
                    <span>{item.output_destination}</span>
                  </div>
                  <span className="font-mono text-[10px]">
                    {item.generated_at ? new Date(item.generated_at).toLocaleDateString() : item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary || item.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                    <Globe className="h-3 w-3" />
                    <span>{item.language}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTargetId(item.id);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Delete Report"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Document Preview (6 Cols) */}
        <div className="lg:col-span-6">
          <OutputPreview result={selectedDoc} loading={false} />
        </div>

      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        title="Delete Report Record?"
        message="Are you sure you want to permanently delete this report from the database?"
        confirmText="Delete Report"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

    </div>
  );
};
