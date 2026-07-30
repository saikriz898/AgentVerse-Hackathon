import React, { useState } from 'react';
import { ShieldCheck, Cpu, Server } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [geminiModel, setGeminiModel] = useState<string>('gemini-2.5-flash');
  const [minThreshold, setMinThreshold] = useState<number>(80);
  const [apiKey, setApiKey] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">System Settings & Engine Config</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage AI model defaults, quality approval thresholds, and database connection settings.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
          ✓ System configuration saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 border space-y-6">
        {/* Gemini Integration */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            Gemini AI Integration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Active AI Model</label>
              <select
                value={geminiModel}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGeminiModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Gemini API Key</label>
              <input
                type="password"
                placeholder="AIzaSy... (leave blank to use env)"
                value={apiKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Global QA Approval Policy */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Global Approval Policy
          </h3>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Global Quality Threshold for Approval</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="50"
                max="95"
                value={minThreshold}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinThreshold(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-sm font-mono font-bold text-indigo-400">{minThreshold} / 100</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Outputs scoring below {minThreshold} are flagged as REJECTED. Outputs scoring &ge; {minThreshold} are APPROVED.
            </p>
          </div>
        </div>

        {/* System Services Status */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-400" />
            Active Infrastructure Services
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Database Engine</span>
              <span className="font-mono text-emerald-400 font-semibold">PostgreSQL 16 / Async SQLAlchemy</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Cache / Message Queue</span>
              <span className="font-mono text-emerald-400 font-semibold">Redis Cache Active</span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition glow-indigo"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
