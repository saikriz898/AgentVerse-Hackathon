'use client';

import React, { useEffect } from 'react';
import {
  Home,
  Bot,
  FolderKanban,
  CheckSquare,
  BookOpen,
  FileText,
  Zap,
  BarChart3,
  Box,
  Search,
  Share2,
  Bell,
  Settings,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/stores/useUIStore';
import { Logo } from '@/components/layout/Logo';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    title: 'WORKSPACE',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'ai-workspace', label: 'AI Workspace', icon: Bot },
    ],
  },
  {
    title: 'WORK',
    items: [
      { id: 'projects', label: 'Projects', icon: FolderKanban },
      { id: 'tasks', label: 'Tasks', icon: CheckSquare },
      { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
      { id: 'documents', label: 'Documents', icon: FileText },
    ],
  },
  {
    title: 'AUTOMATION',
    items: [
      { id: 'automation', label: 'Automation', icon: Zap },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'PLATFORM',
    items: [
      { id: 'ai-models', label: 'AI Models', icon: Box },
      { id: 'search', label: 'Search', icon: Search },
      { id: 'integrations', label: 'Integrations', icon: Share2 },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'profile', label: 'Profile', icon: User },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar, activeNavId, setActiveNavId } = useUIStore();

  // Keyboard shortcut listener (Ctrl+[ or ⌘[ to toggle sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '[') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-border bg-[#13161B] p-4 transition-all duration-200 cubic-bezier(0.16,1,0.3,1) z-30 select-none shrink-0 h-screen',
        isSidebarOpen ? 'w-[312px]' : 'w-[72px] items-center px-2'
      )}
    >
      {/* 1. Header (72-80px Height Container) */}
      <div className="flex h-[76px] w-full items-center justify-between border-b border-border/60 pb-3 mb-4 shrink-0">
        <div className={cn('flex items-center gap-3', !isSidebarOpen && 'w-full justify-center')}>
          {/* Logo Badge Container */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-[#17191E] shadow-sm transition-transform duration-200 hover:scale-105 shrink-0">
            <Logo size={24} />
          </div>

          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#F8FAFC]">
                LifeOS
              </span>
              <span className="text-[11px] font-medium text-[#9AA4B2]">
                Personal Operating System
              </span>
            </div>
          )}
        </div>

        {isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[#9AA4B2] hover:bg-[#17191E] hover:text-[#F8FAFC] transition-all duration-200"
            title="Collapse Sidebar (⌘[)"
          >
            <PanelLeftClose className="h-4 w-4 stroke-[1.75]" />
          </button>
        )}
      </div>

      {/* Uncollapse Button when Collapsed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="mb-4 flex h-8 w-8 items-center justify-center rounded-xl text-[#9AA4B2] hover:bg-[#17191E] hover:text-[#F8FAFC] transition-all duration-200"
          title="Expand Sidebar (⌘[)"
        >
          <PanelLeftOpen className="h-4 w-4 stroke-[1.75]" />
        </button>
      )}

      {/* 2. Navigation Groups & Menu Items */}
      <div className="flex-1 w-full space-y-6 overflow-y-auto pr-1">
        {NAVIGATION_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {isSidebarOpen ? (
              <h3 className="px-3.5 text-[11px] font-semibold tracking-wider text-[#6B7280]">
                {group.title}
              </h3>
            ) : (
              <div className="my-2 h-[1px] w-full bg-border/40" />
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeNavId === item.id;

                return (
                  <div key={item.id} className="relative group">
                    <button
                      onClick={() => setActiveNavId(item.id)}
                      className={cn(
                        'relative flex h-[48px] w-full items-center rounded-2xl px-3.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-[rgba(31,111,95,0.15)] text-[#F8FAFC] font-semibold'
                          : 'text-[#9AA4B2] hover:bg-[#17191E] hover:text-[#F8FAFC]',
                        !isSidebarOpen && 'justify-center px-0'
                      )}
                    >
                      {/* 4px Left Accent Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-[4px] rounded-r-full bg-[#1F6F5F] shadow-[0_0_8px_rgba(31,111,95,0.6)]" />
                      )}

                      {/* Icon (20px, Stroke 1.75, Opacity 70% inactive, 100% active) */}
                      <Icon
                        className={cn(
                          'h-[20px] w-[20px] stroke-[1.75] shrink-0 transition-opacity duration-200',
                          isActive
                            ? 'text-[#1F6F5F] opacity-100'
                            : 'text-[#9AA4B2] opacity-70 group-hover:opacity-100 group-hover:text-[#F8FAFC]'
                        )}
                      />

                      {/* Item Label (Expanded) */}
                      {isSidebarOpen && (
                        <span className="ml-3.5 truncate text-sm tracking-tight">{item.label}</span>
                      )}
                    </button>

                    {/* Collapsed Mode Floating Tooltip */}
                    {!isSidebarOpen && (
                      <div className="absolute left-[76px] top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex items-center gap-1.5 rounded-xl border border-[#262B33] bg-[#17191E] px-3 py-1.5 text-xs font-semibold text-[#F8FAFC] shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-150">
                        <span>{item.label}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. System Status Card (Bottom) */}
      <div className="mt-auto pt-4 border-t border-border/60 w-full shrink-0">
        {isSidebarOpen ? (
          <div className="rounded-2xl border border-[#262B33] bg-[#17191E] p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#F8FAFC]">System Healthy</span>
              </div>
              <Activity className="h-3.5 w-3.5 text-[#6B7280]" />
            </div>

            <div className="space-y-1 text-[11px] text-[#9AA4B2] pt-1">
              <div className="flex items-center justify-between">
                <span>Chief of Staff</span>
                <span className="text-emerald-400 font-semibold">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Specialist Fleet</span>
                <span className="text-[#F8FAFC] font-medium">6 Agents Ready</span>
              </div>
            </div>

            <div className="pt-1 text-[10px] text-[#6B7280] border-t border-[#262B33]/60 flex items-center justify-between">
              <span>Last Sync</span>
              <span>2 sec ago</span>
            </div>
          </div>
        ) : (
          /* Collapsed Single Green Indicator Dot */
          <div className="flex justify-center py-2" title="System Status: Healthy (6 Agents Ready)">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
        )}
      </div>
    </aside>
  );
};
