import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils/formatters';
import { CheckCircle2, Plus, Trash2, X, Sparkles } from 'lucide-react';

export const CostBreakdownView = ({ estimate, currency = 'USD' }) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState('development');
  const [breakdownData, setBreakdownData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding a new sub-system / line item
  const [newItemName, setNewItemName] = useState('');
  const [newUpfrontCost, setNewUpfrontCost] = useState(15000);
  const [newMonthlyCost, setNewMonthlyCost] = useState(0);
  const [newAnnualCost, setNewAnnualCost] = useState(0);
  const [newSuggestion, setNewSuggestion] = useState('');

  const categories = [
    { id: 'development', label: 'Development (Frontend & Backend)' },
    { id: 'infrastructure', label: 'Infrastructure & Hosting' },
    { id: 'ai_services', label: 'AI LLM & API Token Costs' },
    { id: 'devops_and_qa', label: 'DevOps & QA Testing' },
    { id: 'operations_maintenance', label: 'Maintenance & Support' },
  ];

  // AI Agent automated risk prediction logic based on technical scope and expenditure thresholds
  const predictRiskLevel = (name, upfrontCost, monthlyCost) => {
    const text = (name || '').toLowerCase();
    const cost = Number(upfrontCost) || 0;
    const moCost = Number(monthlyCost) || 0;

    if (
      text.includes('ai') ||
      text.includes('llm') ||
      text.includes('vector') ||
      text.includes('crypto') ||
      text.includes('blockchain') ||
      text.includes('payment') ||
      text.includes('security') ||
      text.includes('compliance') ||
      text.includes('soc2') ||
      cost >= 45000 ||
      moCost >= 2500
    ) {
      return 'High';
    }

    if (
      text.includes('backend') ||
      text.includes('database') ||
      text.includes('cloud') ||
      text.includes('auth') ||
      text.includes('realtime') ||
      text.includes('api') ||
      cost >= 18000 ||
      moCost >= 800
    ) {
      return 'Medium';
    }

    return 'Low';
  };

  const currentPredictedRisk = predictRiskLevel(newItemName, newUpfrontCost, newMonthlyCost);

  useEffect(() => {
    if (estimate && estimate.cost_breakdown) {
      setBreakdownData(JSON.parse(JSON.stringify(estimate.cost_breakdown)));
    } else {
      setBreakdownData({
        development: {
          frontend: { estimated_cost: 32000, monthly_cost: 0, annual_cost: 0, percentage: 13.4, risk_level: 'Low', suggestions: ['Use Tailwind CSS component tokens to reduce QA cycles.'] },
          backend: { estimated_cost: 44000, monthly_cost: 0, annual_cost: 0, percentage: 18.5, risk_level: 'Medium', suggestions: ['Leverage async SQLAlchemy to handle high concurrent requests.'] },
          database_dev: { estimated_cost: 16000, monthly_cost: 0, annual_cost: 0, percentage: 6.7, risk_level: 'Low', suggestions: ['Use Alembic auto-migrations.'] },
          api_development: { estimated_cost: 21000, monthly_cost: 0, annual_cost: 0, percentage: 8.8, risk_level: 'Low', suggestions: ['Enforce OpenAPI schemas.'] },
          authentication: { estimated_cost: 9500, monthly_cost: 0, annual_cost: 0, percentage: 4.0, risk_level: 'Low', suggestions: ['Integrate OAuth2 / JWT standards.'] },
          ui_ux_design: { estimated_cost: 14600, monthly_cost: 0, annual_cost: 0, percentage: 6.1, risk_level: 'Low', suggestions: ['Establish Figma design tokens early.'] }
        },
        infrastructure: {
          cloud_compute: { estimated_cost: 21600, monthly_cost: 1800, annual_cost: 21600, percentage: 9.1, risk_level: 'Medium', suggestions: ['Opt for 1-Year AWS Savings Plans to cut costs by 35%.'] },
          database_hosting: { estimated_cost: 14400, monthly_cost: 1200, annual_cost: 14400, percentage: 6.0, risk_level: 'Low', suggestions: ['Enable Neon serverless database branching for dev environments.'] },
          storage_bandwidth: { estimated_cost: 7200, monthly_cost: 600, annual_cost: 7200, percentage: 3.0, risk_level: 'Low', suggestions: ['Enable Cloudflare CDN caching to decrease egress fees.'] },
          monitoring_logging: { estimated_cost: 4800, monthly_cost: 400, annual_cost: 4800, percentage: 2.0, risk_level: 'Low', suggestions: ['Set log retention policies to 30 days.'] }
        },
        ai_services: {
          llm_api_costs: { estimated_cost: 24000, monthly_cost: 2000, annual_cost: 24000, percentage: 10.1, risk_level: 'High', suggestions: ['Implement Redis semantic prompt caching to cut token usage by 35%.'] },
          embeddings_vision: { estimated_cost: 8400, monthly_cost: 700, annual_cost: 8400, percentage: 3.5, risk_level: 'Low', suggestions: ['Batch vector indexing during off-peak hours.'] }
        },
        devops_and_qa: {
          qa_testing: { estimated_cost: 16500, monthly_cost: 0, annual_cost: 0, percentage: 6.9, risk_level: 'Low', suggestions: ['Automate Playwright E2E suites.'] },
          devops_ci_cd: { estimated_cost: 11200, monthly_cost: 0, annual_cost: 0, percentage: 4.7, risk_level: 'Low', suggestions: ['Use GitHub Actions cache keys.'] }
        },
        operations_maintenance: {
          software_maintenance: { estimated_cost: 9800, monthly_cost: 816, annual_cost: 9800, percentage: 4.1, risk_level: 'Low', suggestions: ['Perform bi-weekly security vulnerability patches.'] }
        }
      });
    }
  }, [estimate]);

  const currentCategoryData = breakdownData[activeCategoryTab] || {};

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const formattedKey = newItemName.trim().toLowerCase().replace(/\s+/g, '_');
    const totalTco = estimate?.total_estimated_cost || 200000;
    const pct = Math.round((newUpfrontCost / totalTco) * 100 * 10) / 10;
    const predictedRisk = predictRiskLevel(newItemName, newUpfrontCost, newMonthlyCost);

    const newItem = {
      estimated_cost: Number(newUpfrontCost),
      monthly_cost: Number(newMonthlyCost),
      annual_cost: Number(newAnnualCost),
      percentage: pct || 2.5,
      risk_level: predictedRisk,
      suggestions: newSuggestion.trim() ? [newSuggestion.trim()] : ['Monitored in AI financial audit suite.']
    };

    setBreakdownData((prev) => ({
      ...prev,
      [activeCategoryTab]: {
        ...prev[activeCategoryTab],
        [formattedKey]: newItem
      }
    }));

    setNewItemName('');
    setNewUpfrontCost(15000);
    setNewMonthlyCost(0);
    setNewAnnualCost(0);
    setNewSuggestion('');
    setShowAddModal(false);
  };

  const handleDeleteItem = (keyToDelete) => {
    setBreakdownData((prev) => {
      const updatedCategory = { ...prev[activeCategoryTab] };
      delete updatedCategory[keyToDelete];
      return {
        ...prev,
        [activeCategoryTab]: updatedCategory
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryTab(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategoryTab === cat.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Audit Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              {categories.find((c) => c.id === activeCategoryTab)?.label} Detailed Audit
            </h3>
            <p className="text-[11px] text-slate-400">Add, edit, or remove sub-system line items with AI Risk Prediction</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-xs font-mono text-emerald-400 border border-slate-800">
              {Object.keys(currentCategoryData).length} Active Line Items
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sub-System</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">Line Item / Sub-system</th>
                <th className="pb-3 text-right">Upfront Cost</th>
                <th className="pb-3 text-right">Monthly Cost</th>
                <th className="pb-3 text-right">Annual Cost</th>
                <th className="pb-3 text-center">% of TCO</th>
                <th className="pb-3 text-center">AI Predicted Risk</th>
                <th className="pb-3">Optimization Levers</th>
                <th className="pb-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {Object.entries(currentCategoryData).map(([key, item]) => (
                <tr key={key} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="py-3.5 font-bold text-slate-100 capitalize">
                    {key.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3.5 text-right font-mono text-emerald-400 font-semibold">
                    {formatCurrency(item.estimated_cost, currency)}
                  </td>
                  <td className="py-3.5 text-right font-mono text-slate-300">
                    {item.monthly_cost > 0 ? formatCurrency(item.monthly_cost, currency) : '—'}
                  </td>
                  <td className="py-3.5 text-right font-mono text-slate-300">
                    {item.annual_cost > 0 ? formatCurrency(item.annual_cost, currency) : '—'}
                  </td>
                  <td className="py-3.5 text-center font-semibold text-slate-400 font-mono">
                    {item.percentage}%
                  </td>
                  <td className="py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.risk_level === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : item.risk_level === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {item.risk_level}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="space-y-1">
                      {(item.suggestions || []).map((s, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 text-center">
                    <button
                      onClick={() => handleDeleteItem(key)}
                      title="Delete Line Item"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {Object.keys(currentCategoryData).length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No active line items in this category. Click "+ Add Sub-System" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sub-System Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddItem} className="glass-panel p-6 rounded-2xl border border-slate-700 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Sub-System / Line Item</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Sub-system / Line Item Name</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="e.g. Payment Gateway Integration, Redis Caching Cluster"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Upfront Cost ($)</label>
                <input
                  type="number"
                  value={newUpfrontCost}
                  onChange={(e) => setNewUpfrontCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Monthly Cost ($)</label>
                <input
                  type="number"
                  value={newMonthlyCost}
                  onChange={(e) => setNewMonthlyCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Annual Cost ($)</label>
                <input
                  type="number"
                  value={newAnnualCost}
                  onChange={(e) => setNewAnnualCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* AI Automated Risk Prediction Preview */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-100">AI Risk Assessment Prediction</span>
                  <p className="text-[10px] text-slate-400">Automated evaluation based on scope & expenditure</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                currentPredictedRisk === 'High'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : currentPredictedRisk === 'Medium'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {currentPredictedRisk} Risk
              </span>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Optimization Lever / Recommendation</label>
              <input
                type="text"
                value={newSuggestion}
                onChange={(e) => setNewSuggestion(e.target.value)}
                placeholder="e.g. Use pre-built Stripe SDK component templates"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold shadow-md shadow-emerald-500/20"
              >
                Save Line Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
