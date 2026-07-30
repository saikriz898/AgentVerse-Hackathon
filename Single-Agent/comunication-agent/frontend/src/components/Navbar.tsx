import React from 'react';
import { Sparkles, MessageSquareCode, History, LayoutTemplate, BarChart3, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'history' | 'templates' | 'stats';
  setActiveTab: (tab: 'studio' | 'history' | 'templates' | 'stats') => void;
  systemStatus: { status: string; llm_key_configured: boolean; mode: string } | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemStatus }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Ecosystem Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('studio')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <MessageSquareCode className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">LifeOS</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-mono border border-sky-500/20">
                  Communication Agent
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Final Presentation Layer for Multi-Agent Systems</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'studio'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'templates'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutTemplate className="h-4 w-4" />
              <span>Templates</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'stats'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* AI Engine Status Badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-mono">
              {systemStatus?.mode || "Gemini 2.5 Active"}
            </span>
          </div>

        </div>
      </div>
    </header>
  );
};
