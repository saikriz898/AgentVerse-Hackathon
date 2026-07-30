import React, { useState } from 'react';
import { ReviewRecord } from '../types/review';
import { ScoreBadge } from './ScoreBadge';
import { IssueList } from './IssueList';
import { X } from 'lucide-react';

interface ReviewDetailModalProps {
  review: ReviewRecord | null;
  onClose: () => void;
}

export const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ review, onClose }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'issues' | 'scores' | 'json'>('summary');

  if (!review) return null;

  const result = review.review_result || {};
  const breakdown = result.score_breakdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="glass-card rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {review.agent_name}
              </span>
              <span className="text-xs text-slate-400 font-mono">• {review.review_type}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 font-mono">Review Details #{review.id.substring(0, 8)}</h3>
          </div>

          <div className="flex items-center space-x-4">
            <ScoreBadge score={review.quality_score} status={review.status} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Summary & Overview
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'issues'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Issues & Suggestions</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {(review.issues || []).length}
            </span>
          </button>
          {breakdown && (
            <button
              onClick={() => setActiveTab('scores')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 transition ${
                activeTab === 'scores'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Criteria Breakdown
            </button>
          )}
          <button
            onClick={() => setActiveTab('json')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'json'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw JSON Output
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Executive QA Summary</h4>
                <p className="text-slate-300 leading-relaxed text-sm">{result.summary || 'QA analysis completed successfully.'}</p>
              </div>

              {/* Payload Preview */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Input Payload Preview</h4>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-48">
                  {JSON.stringify(review.input_data, null, 2)}
                </pre>
              </div>

              {/* Confidence Indicator */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Review Engine Confidence</p>
                  <p className="text-lg font-bold font-mono text-emerald-400">{(((review.confidence ?? 0.95) * 100)).toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Reviewed Timestamp</p>
                  <p className="text-xs font-mono text-slate-300">{new Date(review.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <IssueList
              issues={review.issues || []}
              warnings={review.warnings || []}
              suggestions={review.suggestions || []}
            />
          )}

          {activeTab === 'scores' && breakdown && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(breakdown).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{key}</p>
                  <p className="text-lg font-bold font-mono text-indigo-300">{Number(val).toFixed(1)} / 100</p>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${Number(val) >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, Math.max(0, Number(val)))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'json' && (
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto max-h-[400px]">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
