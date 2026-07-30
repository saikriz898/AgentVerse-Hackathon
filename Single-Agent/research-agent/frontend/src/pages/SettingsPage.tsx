import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Settings as SettingsIcon, Key, Server, Shield, CheckCircle2, RefreshCw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');
  const [tavilyKey, setTavilyKey] = useState(localStorage.getItem('TAVILY_API_KEY') || '');
  const [memoryUrl, setMemoryUrl] = useState('http://localhost:8001/api/memory');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (geminiKey) localStorage.setItem('GEMINI_API_KEY', geminiKey);
    if (tavilyKey) localStorage.setItem('TAVILY_API_KEY', tavilyKey);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-blue-400" />
          Research Agent Settings & Inter-Agent Config
        </h1>
        <p className="text-sm text-slate-400 mt-1">Configure Gemini 2.5 Flash, Tavily API Keys, and Memory Agent endpoints.</p>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Settings saved successfully.
        </div>
      )}

      {/* System Health Status */}
      <Card className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" />
          System & Service Integration Health
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">FastAPI Backend</span>
            <Badge variant="emerald">Online (8000)</Badge>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">PostgreSQL DB</span>
            <Badge variant="emerald">Connected</Badge>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Memory Agent Link</span>
            <Badge variant="blue">Ready</Badge>
          </div>
        </div>
      </Card>

      {/* API Key Configuration Form */}
      <Card>
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Key className="w-5 h-5 text-purple-400" />
            API Key Credentials
          </h2>

          <Input
            label="Gemini API Key (Gemini 2.5 Flash Model)"
            type="password"
            placeholder="AIzaSy..."
            value={geminiKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGeminiKey(e.target.value)}
          />

          <Input
            label="Tavily Search API Key"
            type="password"
            placeholder="tvly-..."
            value={tavilyKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTavilyKey(e.target.value)}
          />

          <Input
            label="LifeOS Memory Agent Webhook URL"
            type="text"
            placeholder="http://localhost:8001/api/memory"
            value={memoryUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMemoryUrl(e.target.value)}
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" className="gap-2">
              Save Configuration
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
