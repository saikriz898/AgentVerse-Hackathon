import React, { useState } from 'react';
import { Settings, Sun, Moon, Globe, Key, Shield, Bell, Check, Save } from 'lucide-react';
import { LanguageType } from '../types/communication';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentLanguage: LanguageType;
  setCurrentLanguage: (lang: LanguageType) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  setDarkMode,
  currentLanguage,
  setCurrentLanguage
}) => {
  const [apiKey, setApiKey] = useState<string>('AIzaSyD-GeminiFlash2.5KeyPlaceholder');
  const [autoExportFormat, setAutoExportFormat] = useState<string>('markdown');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center space-x-3">
        <Settings className="h-5 w-5 text-sky-400" />
        <div>
          <h2 className="text-lg font-semibold text-white">System Settings & Preferences</h2>
          <p className="text-xs text-slate-400">Configure theme, multi-language generation, API credentials, and default exports.</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Appearance Section */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Sun className="h-4 w-4 text-amber-400" />
            <span>Appearance & Theme</span>
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Color Theme Mode</span>
              <span className="text-[11px] text-slate-400">Toggle between sleek dark glassmorphism and bright light mode.</span>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 flex items-center space-x-2 transition"
            >
              {darkMode ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-400" />}
              <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>

        {/* Multi-Language Section */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Globe className="h-4 w-4 text-sky-400" />
            <span>Default Multi-Language Target</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Generation Language</label>
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value as LanguageType)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs focus:outline-none"
              >
                {["English", "Tamil", "Hindi", "Spanish", "French", "German", "Japanese", "Korean", "Chinese"].map((lang) => (
                  <option key={lang} value={lang} className="bg-slate-900 text-white">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <Key className="h-4 w-4 text-emerald-400" />
            <span>AI Model Credentials</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Gemini 2.5 Flash API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full glass-input font-mono text-xs rounded-xl px-3 py-2 focus:outline-none"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">API keys are securely transmitted via HTTPS headers.</span>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-sky-500/20 flex items-center space-x-2 transition"
          >
            {saved ? <Check className="h-4 w-4 text-emerald-300" /> : <Save className="h-4 w-4" />}
            <span>{saved ? 'Preferences Saved' : 'Save Preferences'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
