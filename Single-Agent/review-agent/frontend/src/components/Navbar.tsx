import React from 'react';
import { ShieldCheck, LogOut, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-[#090d16]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white glow-indigo">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            LifeOS <span className="text-indigo-400 font-mono text-xs px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">REVIEW AGENT</span>
          </h1>
          <p className="text-[11px] text-slate-400">Quality Assurance & Verification Layer</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-slate-400">Ecosystem Engine:</span>
          <span className="text-emerald-400 font-medium">Active (Gemini 2.5)</span>
        </div>

        {user ? (
          <div className="flex items-center space-x-3">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-slate-200">{user.full_name || user.email}</p>
              <p className="text-[10px] text-indigo-400 capitalize">{user.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition glow-indigo"
          >
            Sign In
          </a>
        )}
      </div>
    </header>
  );
};
