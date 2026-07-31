'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Command,
  PanelRight,
  Check,
  User,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useUIStore } from '@/lib/stores/useUIStore';
import { useCommandPaletteStore } from '@/lib/stores/useCommandPaletteStore';
import { useAuthStore } from '@/lib/stores/useAuthStore';

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Personal AI Operating System' },
  'ai-workspace': { title: 'AI Workspace', subtitle: 'Autonomous Specialist Agent Fleet' },
  projects: { title: 'Projects', subtitle: 'Workspace Execution & Repositories' },
  tasks: { title: 'Tasks', subtitle: 'Sprint Milestones & Task Trees' },
  knowledge: { title: 'Knowledge', subtitle: 'Vector Memory & Document Guidelines' },
  documents: { title: 'Documents', subtitle: 'Executive Reports & Synthesis' },
  automation: { title: 'Automation', subtitle: 'Trigger Workflows & Pipelines' },
  analytics: { title: 'Analytics', subtitle: 'Performance & Cost Metrics' },
  'ai-models': { title: 'AI Models', subtitle: 'LLM Gateway & Provider Specs' },
  search: { title: 'Search', subtitle: 'RRF Vector & Keyword Engine' },
  integrations: { title: 'Integrations', subtitle: 'Connected Services & Webhooks' },
  notifications: { title: 'Notifications', subtitle: 'System Activity & Audit Logs' },
  settings: { title: 'Settings', subtitle: 'Workspace & Security Preferences' },
  profile: { title: 'Profile', subtitle: 'Account & Identity Management' },
  admin: { title: 'Control Center', subtitle: 'Agent Fleet & Health Dashboard' },
};

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { activeNavId, setActiveNavId, toggleRightPanel } = useUIStore();
  const openCommandPalette = useCommandPaletteStore((s) => s.open);
  const user = useAuthStore((s) => s.user);

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const [notificationsList, setNotificationsList] = useState([
    { id: 'n1', title: '18-Stage Execution Complete', desc: 'School ERP task passed 14/14 integration tests.', time: '2m ago', unread: true },
    { id: 'n2', title: 'OWASP QA Compliance Verified', desc: 'Score 98/100 (0 security vulnerabilities detected).', time: '10m ago', unread: true },
    { id: 'n3', title: 'Neon pgvector Index Synced', desc: '768-dim dense embedding index loaded with RRF 0.985.', time: '1h ago', unread: true },
  ]);

  const currentPage = PAGE_META[activeNavId] || {
    title: 'Dashboard',
    subtitle: 'Personal AI Operating System',
  };

  const handleMarkAllRead = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, unread: false })));
    setUnreadCount(0);
  };

  return (
    <header className="sticky top-0 z-20 flex h-[76px] w-full items-center justify-between border-b border-border bg-surface px-6 md:px-8 transition-all duration-200 select-none shrink-0 font-sans">
      {/* Left: Active Page Title & Subtitle */}
      <div className="flex flex-col justify-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
          {currentPage.title}
        </h1>
        <p className="hidden sm:block text-xs md:text-sm font-medium text-text-secondary">
          {currentPage.subtitle}
        </p>
      </div>

      {/* Center: Global Search & Command Palette Trigger */}
      <div className="hidden md:flex items-center max-w-md w-full mx-6">
        <button
          onClick={openCommandPalette}
          className="flex h-11 w-full items-center justify-between rounded-2xl border border-border bg-surface-secondary px-4 text-sm text-text-muted hover:border-accent-primary hover:text-text-primary transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 stroke-[1.75] text-text-muted" />
            <span className="truncate font-medium text-xs">Search documents, tasks, or commands...</span>
          </div>
          <kbd className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-2.5 py-1 text-[11px] font-semibold text-text-secondary shadow-2xs">
            <Command className="h-3 w-3 stroke-[1.75]" /> K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Notifications, Theme Toggle, Profile & Context Inspector */}
      <div className="flex items-center gap-2.5 relative">
        {/* Quick Search Button for Mobile */}
        <button
          onClick={openCommandPalette}
          className="flex md:hidden h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface-secondary text-text-secondary hover:text-text-primary transition-all duration-200"
          title="Search (⌘K)"
        >
          <Search className="h-4 w-4 stroke-[1.75]" />
        </button>

        {/* Notifications Button with Live Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-all duration-200"
            title="Notifications"
          >
            <Bell className="h-4 w-4 stroke-[1.75]" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent-primary animate-pulse" />
            )}
          </button>

          {/* Notifications Popover Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-surface-1 p-4 shadow-xl z-50 space-y-3 font-sans animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-bold text-text-primary">System Activity & Alerts</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-accent-primary hover:underline font-bold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notificationsList.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      setShowNotifications(false);
                      setActiveNavId('notifications');
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-luxury space-y-1 ${
                      notif.unread ? 'bg-accent-light/10 border-accent-primary/40' : 'bg-surface-2 border-border/60'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-text-primary text-[11px]">
                      <span>{notif.title}</span>
                      <span className="text-[10px] font-mono text-text-muted">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary line-clamp-2">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-all duration-200"
          title="Toggle Theme"
        >
          <Sun className="h-4 w-4 stroke-[1.75] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 stroke-[1.75] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* Context Inspector Panel Trigger */}
        <button
          onClick={toggleRightPanel}
          className="hidden lg:flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-all duration-200"
          title="Toggle Context Panel"
        >
          <PanelRight className="h-4 w-4 stroke-[1.75]" />
        </button>

        {/* User Profile Avatar (Navigates to Profile) */}
        <div className="ml-1.5 flex items-center border-l border-border/60 pl-3.5">
          <button
            onClick={() => setActiveNavId('profile')}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-surface-secondary font-bold text-sm text-text-primary shadow-xs transition-transform duration-200 hover:scale-105 hover:border-accent-primary"
            title={user?.name || 'User Profile & Settings'}
          >
            {user?.name?.[0] || 'E'}
          </button>
        </div>
      </div>
    </header>
  );
};
