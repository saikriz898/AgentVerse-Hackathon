'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/useAuthStore';
import { useTheme } from './ThemeProvider';
import {
  CircleUser,
  Building2,
  Settings2,
  Keyboard,
  SunMoon,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Check,
} from 'lucide-react';

interface AccountCenterMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountCenterMenu({ isOpen, onClose }: AccountCenterMenuProps) {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape key or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { label: 'Profile', icon: CircleUser, href: '/profile' },
    { label: 'Workspace', icon: Building2, href: '/workspace' },
    { label: 'Settings', icon: Settings2, href: '/settings' },
    { label: 'Shortcuts', icon: Keyboard, shortcut: '⌘K', href: '/preferences' },
  ];

  const handleSignOut = () => {
    logout();
    onClose();
    router.push('/login');
  };

  const triggerCommandPalette = () => {
    onClose();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-[320px] bg-white dark:bg-[#141518] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl shadow-xl p-2 z-50 text-[#111827] dark:text-neutral-200 select-none animate-in fade-in duration-150 font-sans"
    >
      {/* 1. Compact Header */}
      <div className="flex items-center gap-2.5 p-2 pb-2.5 border-b border-[#E5E7EB] dark:border-white/[0.06]">
        {/* 36px Avatar */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#2563EB] border border-blue-400/30 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {user?.fullName?.[0] || 'A'}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white dark:border-[#141518]"></span>
        </div>

        {/* User Info */}
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-semibold text-[#111827] dark:text-white truncate leading-tight">
            {user?.fullName || 'Admin User'}
          </span>
          <span className="text-[11px] text-[#6B7280] dark:text-neutral-400 font-mono truncate leading-tight">
            {user?.email || 'admin@antigravity.ai'}
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 font-medium truncate">Development Workspace</span>
          </div>
        </div>
      </div>

      {/* 2. Menu Action Items (36px Rows) */}
      <div className="py-1 space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          if (item.label === 'Shortcuts') {
            return (
              <button
                key={item.label}
                onClick={triggerCommandPalette}
                className="w-full flex items-center justify-between h-[36px] px-2.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] text-[13px] text-[#111827] dark:text-neutral-300 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#6B7280] dark:text-neutral-400 group-hover:text-[#2563EB] transition-colors shrink-0" />
                  <span>{item.label}</span>
                </div>
                <kbd className="bg-[#F6F7F9] dark:bg-white/[0.06] text-[#6B7280] dark:text-neutral-400 font-mono text-[9px] px-1.5 py-0.2 rounded border border-[#E5E7EB] dark:border-white/[0.08]">
                  ⌘K
                </kbd>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-center justify-between h-[36px] px-2.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] text-[13px] text-[#111827] dark:text-neutral-300 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-[#6B7280] dark:text-neutral-400 group-hover:text-[#2563EB] transition-colors shrink-0" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="h-px bg-[#E5E7EB] dark:bg-white/[0.06] my-1"></div>

      {/* 3. Theme Selector System (Light ☀ / Dark 🌙 / System 💻) */}
      <div className="p-1 space-y-1">
        <div className="px-2 py-0.5 text-[10px] font-semibold text-[#6B7280] dark:text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
          <SunMoon className="w-3.5 h-3.5 text-[#6B7280] dark:text-neutral-400" />
          <span>APPEARANCE</span>
        </div>
        <div className="grid grid-cols-3 gap-1 pt-0.5">
          <button
            onClick={() => setTheme('light')}
            className={`h-[32px] px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors border ${
              theme === 'light'
                ? 'bg-[#2563EB]/15 border-[#2563EB] text-[#2563EB] font-semibold'
                : 'bg-[#F6F7F9] dark:bg-white/[0.03] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] border-[#E5E7EB] dark:border-white/[0.05] text-[#6B7280] dark:text-neutral-400'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
            {theme === 'light' && <Check className="w-3 h-3 text-[#2563EB]" />}
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`h-[32px] px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors border ${
              theme === 'dark'
                ? 'bg-[#2563EB]/20 border-[#2563EB]/40 text-white font-semibold'
                : 'bg-[#F6F7F9] dark:bg-white/[0.03] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] border-[#E5E7EB] dark:border-white/[0.05] text-[#6B7280] dark:text-neutral-400'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
            {theme === 'dark' && <Check className="w-3 h-3 text-[#2563EB]" />}
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`h-[32px] px-2 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors border ${
              theme === 'system'
                ? 'bg-[#2563EB]/20 border-[#2563EB]/40 text-[#2563EB] dark:text-white font-semibold'
                : 'bg-[#F6F7F9] dark:bg-white/[0.03] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] border-[#E5E7EB] dark:border-white/[0.05] text-[#6B7280] dark:text-neutral-400'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>System</span>
            {theme === 'system' && <Check className="w-3 h-3 text-[#2563EB]" />}
          </button>
        </div>
      </div>

      <div className="h-px bg-[#E5E7EB] dark:bg-white/[0.06] my-1"></div>

      {/* 4. Sign Out (Red Text Only, Zero Red Background Fill) */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-between h-[36px] px-2.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] text-[#DC2626] dark:text-rose-400 text-[13px] font-medium transition-colors group"
      >
        <div className="flex items-center gap-2.5">
          <LogOut className="w-4 h-4 text-[#DC2626] dark:text-rose-400 shrink-0" />
          <span>Sign Out</span>
        </div>
      </button>
    </div>
  );
}
