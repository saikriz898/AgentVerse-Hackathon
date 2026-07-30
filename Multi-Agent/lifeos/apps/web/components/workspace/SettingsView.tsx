'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Settings,
  Sun,
  Moon,
  Key,
  Database,
  Shield,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useTheme } from 'next-themes';

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [apiKey, setApiKey] = useState('sk-gemini-live-768-dim-key-v1');
  const [memoryPartition, setMemoryPartition] = useState('768-dim RRF Hybrid');

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-none">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="flex items-center gap-1.5">
              <Settings className="h-3 w-3 stroke-[2]" /> System Preferences
            </Badge>
            <Badge variant="outline">Global Configuration</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Workspace Settings & Security
          </h1>
          <p className="text-sm text-text-secondary">
            Manage visual theme, API keys, memory partition thresholds, and security parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RotateCcw className="mr-2 h-4 w-4 stroke-[1.75]" /> Reset Defaults
          </Button>
          <Button variant="primary" size="sm">
            <Save className="mr-2 h-4 w-4 stroke-[2]" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="max-w-4xl space-y-6">
        {/* Section 1: Visual Theme */}
        <Card className="bg-surface-1 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Sun className="h-5 w-5 text-accent-primary" />
            <div>
              <h3 className="text-base font-bold text-text-primary">Appearance & Visual Theme</h3>
              <p className="text-xs text-text-muted">Choose between quiet luxury Light and Dark modes</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-left transition-luxury ${
                theme === 'light'
                  ? 'border-accent-primary bg-accent-light text-accent-primary font-bold'
                  : 'border-border bg-surface-2 text-text-secondary'
              }`}
            >
              <Sun className="h-5 w-5 mb-2" />
              <span className="text-xs block">Light Mode (#F8F9FA)</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-left transition-luxury ${
                theme === 'dark'
                  ? 'border-accent-primary bg-accent-light text-accent-primary font-bold'
                  : 'border-border bg-surface-2 text-text-secondary'
              }`}
            >
              <Moon className="h-5 w-5 mb-2" />
              <span className="text-xs block">Dark Mode (#0B0D12)</span>
            </button>
          </div>
        </Card>

        {/* Section 2: Security Keys */}
        <Card className="bg-surface-1 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Key className="h-5 w-5 text-accent-primary" />
            <div>
              <h3 className="text-base font-bold text-text-primary">API Keys & Provider Credentials</h3>
              <p className="text-xs text-text-muted">Configure API keys for Gemini, OpenAI, and Tavily</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <label className="block text-text-muted mb-1 font-semibold">GEMINI_API_KEY</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-surface-2 px-3 text-xs text-text-primary focus:outline-none focus:border-accent-primary font-mono"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
