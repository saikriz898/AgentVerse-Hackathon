import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  History,
  BarChart3,
  Sliders,
  Settings as SettingsIcon,
  ShieldAlert
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'New Review', path: '/new-review', icon: PlusCircle },
    { label: 'Review History', path: '/history', icon: History },
    { label: 'Quality Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Review Rules', path: '/rules', icon: Sliders },
    { label: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 border-r border-border bg-[#0d1322] flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          System Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="p-4 m-4 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
        <div className="flex items-center space-x-2 text-indigo-400 font-semibold mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Rule Enforcement</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Outputs scoring &ge; 80 are approved automatically. Lower scores are rejected.
        </p>
      </div>
    </aside>
  );
};
