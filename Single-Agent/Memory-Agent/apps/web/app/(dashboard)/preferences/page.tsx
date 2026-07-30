'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '../../../lib/api';
import { useTheme } from '../../../components/ThemeProvider';
import PageHeader from '../../../components/PageHeader';
import { Sun, Moon, Laptop, Check, Settings2, Sliders } from 'lucide-react';

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme();
  const { data, isLoading } = useQuery({
    queryKey: ['preferences'],
    queryFn: () => fetchApi('/preferences'),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace & System Preferences"
        description="Configure appearance theme, agent behavioral preferences, and memory context settings"
      />

      {/* Appearance Theme Selector Section */}
      <div className="enterprise-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Settings2 className="w-5 h-5 text-[#2563EB]" />
          <div>
            <h2 className="text-base font-semibold text-white">Appearance & Theme</h2>
            <p className="text-xs text-neutral-400">Select your preferred interface appearance mode</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-4 transition-all ${
              theme === 'light'
                ? 'bg-[#2563EB]/10 border-[#2563EB] text-white shadow-md'
                : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <Sun className="w-6 h-6 text-amber-400" />
              {theme === 'light' && <Check className="w-5 h-5 text-[#2563EB]" />}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">☀ Light Theme</h3>
              <p className="text-xs text-neutral-400">Clean light enterprise UI surface</p>
            </div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-4 transition-all ${
              theme === 'dark'
                ? 'bg-[#2563EB]/10 border-[#2563EB] text-white shadow-md'
                : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <Moon className="w-6 h-6 text-blue-400" />
              {theme === 'dark' && <Check className="w-5 h-5 text-[#2563EB]" />}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">🌙 Dark Theme</h3>
              <p className="text-xs text-neutral-400">Ultra-dark obsidian theme layout</p>
            </div>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-4 transition-all ${
              theme === 'system'
                ? 'bg-[#2563EB]/10 border-[#2563EB] text-white shadow-md'
                : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06] text-neutral-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <Laptop className="w-6 h-6 text-purple-400" />
              {theme === 'system' && <Check className="w-5 h-5 text-[#2563EB]" />}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">💻 System Preference</h3>
              <p className="text-xs text-neutral-400">Automatically sync with operating system</p>
            </div>
          </button>
        </div>
      </div>

      {/* Preferences Parameters */}
      <div className="enterprise-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Sliders className="w-5 h-5 text-[#2563EB]" />
          <div>
            <h2 className="text-base font-semibold text-white">Agent Behavioral Config</h2>
            <p className="text-xs text-neutral-400">Context windows, memory extraction thresholds, and retention policies</p>
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse h-20 bg-white/[0.03] rounded-xl"></div>
        ) : (
          <div className="space-y-2">
            {data?.data?.map((p: any) => (
              <div
                key={p.id}
                className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.04] flex items-center justify-between font-mono text-xs"
              >
                <span className="text-blue-400 font-semibold">{p.key}</span>
                <span className="text-neutral-300">{p.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
