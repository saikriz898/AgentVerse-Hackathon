import React, { useEffect, useState, useCallback } from 'react';
import { reviewService } from '../services/reviewService';
import { ReviewRecord } from '../types/review';
import { ScoreBadge } from '../components/ScoreBadge';
import { ReviewDetailModal } from '../components/ReviewDetailModal';
import {
  RefreshCw,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const ReviewHistoryPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter state
  const [agentFilter, setAgentFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [page, setPage] = useState<number>(0);

  // Active detail modal
  const [activeReview, setActiveReview] = useState<ReviewRecord | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await reviewService.getHistory({
        agent_name: agentFilter || undefined,
        status: statusFilter || undefined,
        review_type: typeFilter || undefined,
        skip: page * 20,
        limit: 20
      });
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [agentFilter, statusFilter, typeFilter, page]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await reviewService.getHistory({
          agent_name: agentFilter || undefined,
          status: statusFilter || undefined,
          review_type: typeFilter || undefined,
          skip: page * 20,
          limit: 20
        });
        if (isMounted) {
          setItems(data.items || []);
          setTotal(data.total || 0);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [agentFilter, statusFilter, typeFilter, page]);

  const handleInspect = async (id: string) => {
    try {
      const details = await reviewService.getReviewById(id);
      setActiveReview(details);
    } catch (err) {
      console.error('Failed to fetch review detail:', err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this review audit record?')) {
      try {
        await reviewService.deleteReview(id);
        fetchHistory();
      } catch (err) {
        console.error('Failed to delete review:', err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Review Audit History</h2>
          <p className="text-xs text-slate-400 mt-1">
            Searchable log of all QA verification executions across the LifeOS Multi-Agent System.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition flex items-center space-x-2 text-xs font-semibold self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Filter by Agent</label>
          <input
            type="text"
            placeholder="Agent name..."
            value={agentFilter}
            onChange={(e) => { setAgentFilter(e.target.value); setPage(0); }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Approval Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">Review Type</label>
          <input
            type="text"
            placeholder="Code, JSON, Document..."
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Datatable */}
      <div className="glass-card rounded-2xl border overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No review history matching current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-border uppercase font-mono tracking-wider">
                <tr>
                  <th className="px-6 py-3">Agent</th>
                  <th className="px-6 py-3">Review Type</th>
                  <th className="px-6 py-3">Quality Score</th>
                  <th className="px-6 py-3">Issues</th>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {items.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => handleInspect(r.id)}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-indigo-300">{r.agent_name}</td>
                    <td className="px-6 py-4 text-slate-400">{r.review_type}</td>
                    <td className="px-6 py-4">
                      <ScoreBadge score={r.quality_score} status={r.status} />
                    </td>
                    <td className="px-6 py-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${r.issues_count > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {r.issues_count} issue(s)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleInspect(r.id); }}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-indigo-400 border border-slate-800 transition"
                        title="Inspect Review"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(r.id, e)}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800 transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-border bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="text-slate-200 font-bold">{items.length}</span> of <span className="text-slate-200 font-bold">{total}</span> records
          </div>
          <div className="flex items-center space-x-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono">Page {page + 1}</span>
            <button
              disabled={(page + 1) * 20 >= total}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <ReviewDetailModal
        review={activeReview}
        onClose={() => setActiveReview(null)}
      />
    </div>
  );
};
