import React, { useState } from 'react';
import { reviewService } from '../services/reviewService';
import { StandardReviewOutput } from '../types/review';
import { ScoreBadge } from '../components/ScoreBadge';
import { IssueList } from '../components/IssueList';
import {
  Code2,
  Sparkles,
  Loader2,
  Play,
  Cpu,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const NewReviewPage: React.FC = () => {
  const selectedAgent = 'Execution Agent';
  const codeLang = 'python';
  const [codeContent, setCodeContent] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [reviewResult, setReviewResult] = useState<StandardReviewOutput | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeContent.trim()) {
      setErrorMessage("Please enter or paste your source code input first.");
      return;
    }

    setIsSubmitting(true);
    setReviewResult(null);
    setErrorMessage(null);

    try {
      const output = await reviewService.submitCodeReview({
        agent_name: selectedAgent,
        language: codeLang,
        code: codeContent
      });
      setReviewResult(output);
    } catch (err: any) {
      console.error('Review failed:', err);
      setErrorMessage(err.response?.data?.detail || err.message || 'Code review execution failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">Code QA Review Studio</h2>
            <p className="text-xs text-slate-400">
              Input user source code snippet for automated defect, security, and quality analysis.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>User Input Code Validation Active</span>
        </span>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
          ⚠️ {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Code Input Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Source Code Input Payload
              </label>
            </div>
            <textarea
              rows={16}
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              placeholder="Paste or type your source code input here to review..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 glow-indigo disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reviewing Code Input...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Execute Code Review</span>
              </>
            )}
          </button>
        </form>

        {/* Live QA Output Display Container */}
        <div className="glass-card rounded-2xl p-6 border space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Code Quality QA Results
            </h3>

            {!reviewResult ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-xl p-8">
                <Cpu className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-xs font-semibold text-slate-400">Awaiting Code Input</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Paste your code snippet on the left and click Execute to view defect detection, security scans, and quality score.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in">
                {/* Result Header Badge */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Evaluation Status</p>
                    <p className="text-sm font-bold text-slate-100 uppercase">{reviewResult.status}</p>
                  </div>
                  <ScoreBadge score={reviewResult.quality_score} status={reviewResult.status} />
                </div>

                {/* Executive Summary */}
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
                  <p className="font-semibold text-indigo-400 mb-1 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Review Summary:</span>
                  </p>
                  {reviewResult.summary}
                </div>

                {/* Issue List */}
                <IssueList
                  issues={reviewResult.issues || []}
                  warnings={reviewResult.warnings || []}
                  suggestions={reviewResult.suggestions || []}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
