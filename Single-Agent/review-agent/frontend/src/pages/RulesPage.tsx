import React, { useEffect, useState, useCallback } from 'react';
import { reviewService } from '../services/reviewService';
import { ReviewRule } from '../types/review';
import { Plus, Trash2 } from 'lucide-react';

export const RulesPage: React.FC = () => {
  const [rules, setRules] = useState<ReviewRule[]>([]);

  // Form modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [ruleName, setRuleName] = useState<string>('');
  const [targetAgent, setTargetAgent] = useState<string>('ALL');
  const [targetType, setTargetType] = useState<string>('ALL');
  const [minQualityThreshold, setMinQualityThreshold] = useState<number>(80);

  const fetchRules = useCallback(async () => {
    try {
      const data = await reviewService.getRules();
      setRules(data);
    } catch (err) {
      console.error('Failed to load rules:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await reviewService.getRules();
        if (isMounted) setRules(data);
      } catch (err) {
        console.error('Failed to load rules:', err);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reviewService.createRule({
        name: ruleName,
        agent_name: targetAgent,
        review_type: targetType,
        rule_config: { min_quality_threshold: minQualityThreshold }
      });
      setShowAddModal(false);
      setRuleName('');
      fetchRules();
    } catch (err) {
      console.error('Failed to create rule:', err);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (window.confirm('Delete this review rule configuration?')) {
      try {
        await reviewService.deleteRule(id);
        fetchRules();
      } catch (err) {
        console.error('Failed to delete rule:', err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Review Rules & Policy Engine</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure custom quality score thresholds and validation policy rules for agent outputs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-2 glow-indigo"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Rule</span>
        </button>
      </div>

      {/* Rules List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center text-slate-500 text-xs rounded-2xl">
            No custom rules configured yet. Standard system rule (Quality &ge; 80 for Approval) is active.
          </div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="glass-card rounded-xl p-5 border flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-200">{rule.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${rule.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                    {rule.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-mono space-y-0.5">
                  <p>Target Agent: <span className="text-indigo-300 font-bold">{rule.agent_name}</span></p>
                  <p>Review Type: <span className="text-slate-200">{rule.review_type}</span></p>
                  <p>Min Quality Threshold: <span className="text-emerald-400 font-bold">{rule.rule_config?.min_quality_threshold ?? 80} / 100</span></p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteRule(rule.id)}
                className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-800 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal for Adding Rule */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-2xl w-full max-w-md p-6 border space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Create Custom Review Rule</h3>
            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Strict Code Security Policy"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Target Agent</label>
                <select
                  value={targetAgent}
                  onChange={(e) => setTargetAgent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">ALL AGENTS</option>
                  <option value="Execution Agent">Execution Agent</option>
                  <option value="Research Agent">Research Agent</option>
                  <option value="Planning Agent">Planning Agent</option>
                  <option value="Memory Agent">Memory Agent</option>
                  <option value="Communication Agent">Communication Agent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Review Type Target</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">ALL TYPES</option>
                  <option value="Code Review">Code Review</option>
                  <option value="JSON Review">JSON Review</option>
                  <option value="Document Review">Document Review</option>
                  <option value="Research Review">Research Review</option>
                  <option value="Execution Review">Execution Review</option>
                  <option value="Planning Review">Planning Review</option>
                  <option value="Memory Review">Memory Review</option>
                  <option value="Communication Review">Communication Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Min Quality Score Threshold (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={minQualityThreshold}
                  onChange={(e) => setMinQualityThreshold(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold glow-indigo"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
