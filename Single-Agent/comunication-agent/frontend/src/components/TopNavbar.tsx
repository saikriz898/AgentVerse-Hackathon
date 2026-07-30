import React from 'react';
import { Search, Sun, Moon, Sparkles, Activity, Globe, User } from 'lucide-react';
import { LanguageType } from '../types/communication';

interface TopNavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  currentLanguage: LanguageType;
  setCurrentLanguage: (lang: LanguageType) => void;
  systemStatus: any;
  onOpenStudio: () => void;
  onOpenAuth: () => void;
  user: any;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode,
  currentLanguage,
  setCurrentLanguage,
  systemStatus,
  onOpenStudio,
  onOpenAuth,
  user
}) => {
  const languages: LanguageType[] = [
    "English", "Tamil", "Hindi", "Spanish", "French", "German", "Japanese", "Korean", "Chinese"
  ];

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-800 dark:border-slate-800 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
      
      {/* Global Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Global Search (documents, templates, agent logs)..."
          className="w-full glass-input text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        
        {/* LLM Engine Status Indicator */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono">
          <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-300">
            {systemStatus?.mode || "Gemini 2.5 Active"}
          </span>
        </div>

        {/* Global Target Language Selector */}
        <div className="flex items-center space-x-1 glass-input rounded-xl px-2 py-1 text-xs">
          <Globe className="h-3.5 w-3.5 text-sky-400 shrink-0" />
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value as LanguageType)}
            className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang} className="bg-slate-900 text-white">
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
          title="Toggle Dark / Light Mode"
        >
          {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
        </button>

        {/* Quick Transform CTA */}
        <button
          onClick={onOpenStudio}
          className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-xs shadow-md shadow-sky-500/20 flex items-center space-x-1.5 transition active:scale-98"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Transform</span>
        </button>

      </div>

    </header>
  );
};
