import React from 'react';
import { Search, Bell, PlusCircle, Globe, Sun, Moon } from 'lucide-react';

export const Header = ({
  activeTabTitle,
  currency,
  setCurrency,
  onNewEstimate,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-100">{activeTabTitle}</h2>
        <p className="text-xs text-slate-400">Enterprise Financial Architect & Operational Cost Suite</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search estimates, reports, infrastructure..."
            className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-700/80 rounded-xl p-1 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {['USD', 'EUR', 'GBP', 'INR'].map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-2 py-0.5 rounded-lg font-semibold transition-colors ${
                currency === c
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c === 'USD' ? '$ USD' : c === 'EUR' ? '€ EUR' : c === 'GBP' ? '£ GBP' : '₹ INR'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl bg-slate-950/60 border border-slate-700/80 text-slate-400 hover:text-slate-100 transition-colors"
          title="Toggle theme mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        <button className="p-2 rounded-xl bg-slate-950/60 border border-slate-700/80 text-slate-400 hover:text-slate-100 relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>

        <button
          onClick={onNewEstimate}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Estimate</span>
        </button>
      </div>
    </header>
  );
};
