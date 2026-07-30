'use client';

import React from 'react';
import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  CheckSquare,
  BookOpen,
  FileText,
  Zap,
  BarChart3,
  Cpu,
  Bell,
  Search,
  Layers,
  Settings,
  User,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/useUIStore';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ai-workspace', label: 'AI Workspace', icon: Bot, badge: 'Fleet' },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

const SECONDARY_NAV_ITEMS: NavItem[] = [
  { id: 'ai-models', label: 'AI Models', icon: Cpu },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'integrations', label: 'Integrations', icon: Layers },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User },
];

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar, activeNavId, setActiveNavId } = useUIStore();

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-border bg-surface p-3 transition-luxury z-30 select-none shrink-0',
        isSidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-primary text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-text-primary">
                LifeOS
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                AI Operating System
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-xl text-text-secondary hover:bg-surface-secondary transition-luxury"
          title="Toggle Sidebar"
        >
          <ChevronLeft className={cn('h-4 w-4 transition-transform duration-200', !isSidebarOpen && 'rotate-180')} />
        </button>
      </div>

      {/* Navigation Group 1 */}
      <div className="flex-1 space-y-1 overflow-y-auto">
        <div className="px-3 py-1">
          {isSidebarOpen && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Core Platform
            </span>
          )}
        </div>
        {PRIMARY_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNavId(item.id)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-luxury',
                isActive
                  ? 'bg-accent-light text-accent-primary font-semibold'
                  : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-accent-primary' : 'text-text-muted group-hover:text-text-primary')} />
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
              {isSidebarOpen && item.badge && (
                <span className="ml-auto rounded-full bg-accent-primary px-2 py-0.5 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 py-1">
          {isSidebarOpen && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              System & Preferences
            </span>
          )}
        </div>
        {SECONDARY_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNavId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNavId(item.id)}
              className={cn(
                'group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-luxury',
                isActive
                  ? 'bg-accent-light text-accent-primary font-semibold'
                  : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-accent-primary' : 'text-text-muted group-hover:text-text-primary')} />
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="border-t border-border pt-3 mt-auto">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text-primary">
                Fleet Status: Online
              </span>
              <span className="text-[10px] text-text-muted">6 Agents Active</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
