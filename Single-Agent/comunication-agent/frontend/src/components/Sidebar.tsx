import React from 'react';
import {
  Sparkles,
  FileText,
  Mail,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquareCode,
  CheckCircle2
} from 'lucide-react';

export type TabType =
  | 'simplifier'
  | 'report'
  | 'email'
  | 'history'
  | 'settings'
  | 'dashboard'
  | 'queue'
  | 'studio'
  | 'drafts'
  | 'scheduled'
  | 'audience'
  | 'channels'
  | 'notifications'
  | 'analytics';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  user: any;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  user,
  onOpenAuth,
  onLogout
}) => {
  const menuItems: { id: TabType; label: string; icon: React.FC<any>; badge?: string }[] = [
    { id: 'simplifier', label: 'AI Text Simplifier', icon: Sparkles, badge: 'Core AI' },
    { id: 'report', label: 'Generate Report', icon: FileText, badge: 'AI Report' },
    { id: 'email', label: 'Generate Email', icon: Mail, badge: 'AI Email' },
    { id: 'history', label: 'History', icon: History, badge: 'Log' },
    { id: 'settings', label: 'Settings & Preferences', icon: Settings },
  ];

  return (
    <aside
      className={`relative z-40 transition-all duration-300 ease-in-out glass-panel border-r border-slate-800 dark:border-slate-800 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header Logo */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center space-x-3 cursor-pointer overflow-hidden" onClick={() => setActiveTab('simplifier')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
              <MessageSquareCode className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-bold text-base text-white tracking-tight">LifeOS</span>
                <span className="text-[10px] block text-sky-400 font-mono">Communication Agent</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition hidden md:block"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-md shadow-sky-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  {!collapsed && <span className="truncate font-semibold">{item.label}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-[10px] font-mono border border-sky-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Status / Login Block */}
      <div className="p-3 border-t border-slate-800/80">
        {user ? (
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                {user.username?.[0]?.toUpperCase() || 'U'}
              </div>
              {!collapsed && (
                <div className="truncate">
                  <span className="text-xs font-semibold text-white block truncate">{user.username}</span>
                  <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    <span>Executive Authorized</span>
                  </span>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-2"
          >
            <span>{collapsed ? 'Login' : 'Sign In / Register'}</span>
          </button>
        )}
      </div>
    </aside>
  );
};
