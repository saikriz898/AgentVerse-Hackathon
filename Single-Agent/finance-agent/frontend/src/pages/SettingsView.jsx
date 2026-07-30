import React, { useState, useEffect } from 'react';
import { financeApi } from '../services/api';
import { Settings as SettingsIcon, Save, Check } from 'lucide-react';

export const SettingsView = ({ currency = 'USD', setCurrency }) => {
  const [settings, setSettingsData] = useState({
    id: 'default',
    currency: currency,
    default_dev_hourly_rate: 85,
    default_cloud_provider: 'AWS',
    ai_provider: 'OpenAI',
    api_key_configured: 'No',
    risk_threshold: 15,
    custom_rates: { Frontend: 85, Backend: 95, DevOps: 110, 'AI Architect': 125, QA: 65 }
  });
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const s = await financeApi.getSettings();
        setSettingsData(s);
      } catch (err) {
        console.error(err);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await financeApi.updateSettings(settings);
      if (setCurrency) setCurrency(settings.currency);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-emerald-400" />
              <span>Platform & AI Financial Settings</span>
            </h3>
            <p className="text-[11px] text-slate-400">Configure global rates, currencies, cloud defaults, and AI API keys</p>
          </div>
          {savedMessage && (
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Settings Saved Successfully</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Display Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettingsData({ ...settings, currency: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="USD">USD ($ United States Dollar)</option>
              <option value="EUR">EUR (€ Euro)</option>
              <option value="GBP">GBP (£ British Pound)</option>
              <option value="INR">INR (₹ Indian Rupee)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Default Hourly Engineering Rate ($/hr)</label>
            <input
              type="number"
              value={settings.default_dev_hourly_rate}
              onChange={(e) => setSettingsData({ ...settings, default_dev_hourly_rate: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Default Cloud Provider Preference</label>
            <select
              value={settings.default_cloud_provider}
              onChange={(e) => setSettingsData({ ...settings, default_cloud_provider: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="AWS">AWS (Amazon Web Services)</option>
              <option value="GCP">Google Cloud Platform (GCP)</option>
              <option value="Azure">Microsoft Azure</option>
              <option value="DigitalOcean">DigitalOcean</option>
              <option value="Vercel + Supabase">Vercel + Supabase Stack</option>
              <option value="Neon + Railway">Neon + Railway Stack</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">AI Financial Architect Provider</label>
            <select
              value={settings.ai_provider}
              onChange={(e) => setSettingsData({ ...settings, ai_provider: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="OpenAI">OpenAI (gpt-4o)</option>
              <option value="Gemini">Google Gemini 1.5 Pro</option>
              <option value="Anthropic">Anthropic Claude 3.5 Sonnet</option>
              <option value="Local Heuristic">Local Heuristic Financial Engine (Zero Key Needed)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Custom Role Hourly Rates ($/hr)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.entries(settings.custom_rates || {}).map(([role, rate]) => (
              <div key={role} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">{role}</span>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) =>
                    setSettingsData({
                      ...settings,
                      custom_rates: { ...settings.custom_rates, [role]: Number(e.target.value) }
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-emerald-400 font-mono font-bold mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preference Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
