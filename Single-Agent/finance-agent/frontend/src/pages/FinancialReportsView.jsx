import React, { useState, useEffect } from 'react';
import { financeApi } from '../services/api';
import { downloadCSV, downloadJSON, formatCurrency } from '../utils/formatters';
import { FileText, Download, Printer, Sparkles } from 'lucide-react';

export const FinancialReportsView = ({
  currentEstimate,
  currency = 'USD',
}) => {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    try {
      const list = await financeApi.getReports();
      setReports(list);
      if (list.length > 0) setActiveReport(list[0]);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async (type) => {
    setGenerating(true);
    try {
      const newRep = {
        id: `rep-${Date.now()}`,
        report_title: `${currentEstimate.project_name} - ${type}`,
        report_type: type,
        author: 'AI Financial Architect',
        summary: `Automated ${type} generated for ${currentEstimate.project_name}. Total TCO: ${formatCurrency(currentEstimate.total_estimated_cost, currency)}.`,
        report_data: currentEstimate,
        file_format: selectedFormat,
        created_at: new Date().toISOString(),
      };
      setReports([newRep, ...reports]);
      setActiveReport(newRep);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = () => {
    if (!currentEstimate) return;
    const csvLines = [
      'Category,Item,Upfront Cost,Monthly Cost,Annual Cost',
      `Engineering Dev,Frontend Build,${currentEstimate.dev_cost},0,0`,
      `Infrastructure,Cloud Hosting,${currentEstimate.infra_cost},${currentEstimate.infra_cost / 12},${currentEstimate.infra_cost}`,
      `AI Services,LLM API Tokens,${currentEstimate.ai_cost},${currentEstimate.ai_cost / 12},${currentEstimate.ai_cost}`,
      `DevOps,CI/CD Pipelines,${currentEstimate.devops_cost},0,0`,
      `Maintenance,Software Patches,${currentEstimate.maintenance_cost},${currentEstimate.maintenance_cost / 12},${currentEstimate.maintenance_cost}`,
      `TOTAL,Overall 1-Year TCO,${currentEstimate.total_estimated_cost},${currentEstimate.monthly_operating_cost},${currentEstimate.annual_operating_cost}`
    ].join('\n');

    downloadCSV(`${currentEstimate.project_name}_Cost_Report.csv`, csvLines);
  };

  const handleExportJSON = () => {
    downloadJSON(`${currentEstimate.project_name}_Financial_Model.json`, currentEstimate);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" />
              <span>Enterprise Financial Report Generator</span>
            </h3>
            <p className="text-[11px] text-slate-400">Generate executive financial audits, project budgets, and ROI export statements</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Export Format:</span>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-semibold focus:outline-none"
            >
              <option value="PDF">PDF Report</option>
              <option value="Excel">Excel (XLSX)</option>
              <option value="CSV">CSV Data Table</option>
              <option value="JSON">JSON Schema</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            'Executive Summary',
            'Project Cost Report',
            'Infrastructure Audit',
            'ROI Statement'
          ].map((type, idx) => (
            <button
              key={idx}
              onClick={() => handleGenerateReport(type)}
              disabled={generating}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-violet-500/50 hover:bg-violet-950/20 text-left transition-all group"
            >
              <div className="text-xs font-bold text-slate-100 group-hover:text-violet-300 flex items-center justify-between">
                <span>{type}</span>
                <Sparkles className="w-3.5 h-3.5 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Generate {type.toLowerCase()} report instantly</p>
            </button>
          ))}
        </div>
      </div>

      {activeReport && (
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold uppercase border border-violet-500/30">
                {activeReport.report_type}
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-1">{activeReport.report_title}</h2>
              <p className="text-xs text-slate-400">Author: {activeReport.author} • Generated: {new Date(activeReport.created_at || Date.now()).toLocaleDateString()}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
              <button
                onClick={handleExportJSON}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> JSON
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print PDF
              </button>
            </div>
          </div>

          <div className="space-y-6 text-slate-300 text-xs leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="font-bold text-slate-100 text-xs mb-1 uppercase tracking-wide">Executive Summary</h4>
              <p>{activeReport.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Estimated TCO</span>
                <div className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
                  {formatCurrency(currentEstimate.total_estimated_cost, currency)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Operating Run-Rate</span>
                <div className="text-xl font-extrabold text-slate-100 font-mono mt-1">
                  {formatCurrency(currentEstimate.monthly_operating_cost, currency)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">AI Confidence Rating</span>
                <div className="text-xl font-extrabold text-indigo-400 font-mono mt-1">
                  {currentEstimate.confidence_score}%
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-100 text-xs mb-2 uppercase tracking-wide">Financial Cost Distribution Table</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Cost Pillar</th>
                      <th className="p-3 text-right">Upfront Cost</th>
                      <th className="p-3 text-right">Monthly Run-Rate</th>
                      <th className="p-3 text-right">Annual Run-Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/40 text-slate-200">
                    <tr>
                      <td className="p-3 font-semibold">Engineering Development</td>
                      <td className="p-3 text-right font-mono text-emerald-400">{formatCurrency(currentEstimate.dev_cost, currency)}</td>
                      <td className="p-3 text-right font-mono text-slate-400">—</td>
                      <td className="p-3 text-right font-mono text-slate-400">—</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Cloud Infrastructure</td>
                      <td className="p-3 text-right font-mono text-slate-400">—</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(currentEstimate.infra_cost / 12, currency)}</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(currentEstimate.infra_cost, currency)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">AI Services & LLM Tokens</td>
                      <td className="p-3 text-right font-mono text-slate-400">—</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(currentEstimate.ai_cost / 12, currency)}</td>
                      <td className="p-3 text-right font-mono">{formatCurrency(currentEstimate.ai_cost, currency)}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">DevOps & Automated QA</td>
                      <td className="p-3 text-right font-mono text-emerald-400">{formatCurrency(currentEstimate.devops_cost, currency)}</td>
                      <td className="p-3 text-right font-mono text-slate-400">—</td>
                      <td className="p-3 text-right font-mono text-slate-400">—</td>
                    </tr>
                    <tr className="bg-slate-900/80 font-bold">
                      <td className="p-3">Total Project 1-Year TCO</td>
                      <td className="p-3 text-right font-mono text-emerald-400">{formatCurrency(currentEstimate.dev_cost + currentEstimate.devops_cost, currency)}</td>
                      <td className="p-3 text-right font-mono text-slate-100">{formatCurrency(currentEstimate.monthly_operating_cost, currency)}</td>
                      <td className="p-3 text-right font-mono text-slate-100">{formatCurrency(currentEstimate.total_estimated_cost, currency)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
