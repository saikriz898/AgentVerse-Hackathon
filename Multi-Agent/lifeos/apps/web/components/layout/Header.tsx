'use client';

import React from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Command,
  PanelRight,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useUIStore } from '@/lib/stores/useUIStore';
import { useCommandPaletteStore } from '@/lib/stores/useCommandPaletteStore';
import { useAuthStore } from '@/lib/stores/useAuthStore';

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { toggleRightPanel } = useUIStore();
  const openCommandPalette = useCommandPaletteStore((s) => s.open);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-surface px-4 md:px-6 transition-luxury select-none shrink-0">
      {/* Left: Workspace Dropdown Selector */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-2xl border border-border bg-surface-secondary px-3.5 py-1.5 text-sm font-semibold text-text-primary hover:border-accent-primary transition-luxury">
          <Sparkles className="h-4 w-4 text-accent-primary" />
          <span>LifeOS Main Workspace</span>
          <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
        </button>
      </div>

      {/* Center: Global Search & Command Palette Trigger */}
      <div className="hidden md:flex items-center max-w-md w-full mx-4">
        <button
          onClick={openCommandPalette}
          className="flex h-10 w-full items-center justify-between rounded-2xl border border-border bg-surface-secondary px-3.5 text-sm text-text-muted hover:border-accent-primary transition-luxury"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Search workspace or run command...</span>
          </div>
          <kbd className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
            <Command className="h-3 w-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right: Actions, Notifications, Theme Toggle, Profile & Context Panel */}
      <div className="flex items-center gap-2">
        {/* Quick Search Button for Mobile */}
        <button
          onClick={openCommandPalette}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-2xl border border-border text-text-secondary hover:bg-surface-secondary"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications Button */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-2xl border border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-luxury"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-primary" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-luxury"
          title="Toggle Theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* Context Panel Trigger */}
        <button
          onClick={toggleRightPanel}
          className="hidden lg:flex h-9 w-9 items-center justify-center rounded-2xl border border-border text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-luxury"
          title="Toggle Context Panel"
        >
          <PanelRight className="h-4 w-4" />
        </button>

        {/* User Profile Avatar */}
        <div className="ml-1 flex items-center gap-2 border-l border-border pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-accent-light font-semibold text-accent-primary">
            {user?.name?.[0] || 'E'}
          </div>
        </div>
      </div>
    </header>
  );
};
