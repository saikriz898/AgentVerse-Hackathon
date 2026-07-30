'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/useAuthStore';
import AccountCenterMenu from './AccountCenterMenu';
import { Search, Plus, Bell, ChevronDown, Home, Menu } from 'lucide-react';

import NotificationPopover from './NotificationPopover';

interface NavbarProps {
  isCollapsed?: boolean;
  onToggleMobileDrawer?: () => void;
}

export default function Navbar({ isCollapsed, onToggleMobileDrawer }: NavbarProps) {
  const { user } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const triggerCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <header
      className={`fixed top-0 right-0 h-[64px] md:h-[72px] bg-white dark:bg-[#101010] border-b border-[#E5E7EB] dark:border-white/[0.05] px-4 md:px-6 flex items-center justify-between z-30 select-none transition-all duration-200 ease-in-out ${
        isCollapsed ? 'md:left-[72px]' : 'md:left-[280px]'
      } left-0`}
    >
      {/* Left: Mobile Menu Button + Workspace Breadcrumb */}
      <div className="flex items-center gap-3 text-xs font-medium text-[#6B7280] dark:text-neutral-400">
        {onToggleMobileDrawer && (
          <button
            onClick={onToggleMobileDrawer}
            className="md:hidden p-2 rounded-xl bg-[#F6F7F9] dark:bg-white/[0.03] border border-[#E5E7EB] dark:border-white/[0.05] text-[#111827] dark:text-neutral-300 hover:text-black dark:hover:text-white"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="hidden sm:flex items-center gap-2">
          <Home className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-neutral-500" />
          <span className="text-[#9CA3AF] dark:text-neutral-500">/</span>
          <span className="text-[#6B7280] dark:text-neutral-300">Workspace</span>
          <span className="text-[#9CA3AF] dark:text-neutral-500">/</span>
          <span className="text-[#111827] dark:text-white font-semibold">Dashboard</span>
        </div>

        <div className="sm:hidden flex items-center gap-2">
          <span className="text-[#111827] dark:text-white font-bold text-sm">Memory Agent</span>
        </div>
      </div>

      {/* Center: Global Search Bar Field */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6">
        <button
          onClick={triggerCommandPalette}
          className="w-full h-[36px] px-3.5 bg-[#F6F7F9] dark:bg-white/[0.03] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] border border-[#E5E7EB] dark:border-white/[0.05] rounded-lg flex items-center justify-between text-xs text-[#6B7280] dark:text-neutral-400 transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-[#6B7280] dark:text-neutral-400 group-hover:text-[#2563EB] transition-colors" />
            <span className="truncate">Search memories, docs, graph...</span>
          </div>
          <kbd className="bg-white dark:bg-white/[0.06] text-[#6B7280] dark:text-neutral-300 font-mono text-[10px] px-1.5 py-0.2 rounded border border-[#E5E7EB] dark:border-white/[0.06]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 md:gap-3">
        {/* Primary Solid Blue Action Button */}
        <Link
          href="/memory"
          className="h-[42px] px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-none"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Memory</span>
        </Link>

        <div className="hidden sm:block h-5 w-px bg-[#E5E7EB] dark:bg-white/[0.05]"></div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            title="Notifications"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="w-9 h-9 bg-[#F6F7F9] dark:bg-white/[0.03] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] border border-[#E5E7EB] dark:border-white/[0.05] rounded-lg flex items-center justify-center text-[#6B7280] dark:text-neutral-300 hover:text-[#111827] dark:hover:text-white transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#2563EB] text-white text-[9px] font-bold font-mono rounded-full">
              4
            </span>
          </button>

          <NotificationPopover isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* Enterprise Account Center Control Panel Menu V6.0 */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-label="User Account Menu"
            className="flex items-center gap-1.5 p-1 hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] rounded-lg text-xs text-[#111827] dark:text-neutral-300 transition-all border border-transparent group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] border border-blue-400/30 flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:scale-105 transition-transform">
              {user?.fullName?.[0] || 'A'}
            </div>
            <ChevronDown
              className={`hidden sm:block w-3.5 h-3.5 text-[#6B7280] dark:text-neutral-400 transition-transform duration-180 ${
                dropdownOpen ? 'rotate-180 text-[#111827] dark:text-white' : ''
              }`}
            />
          </button>

          <AccountCenterMenu isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
        </div>
      </div>
    </header>
  );
}
