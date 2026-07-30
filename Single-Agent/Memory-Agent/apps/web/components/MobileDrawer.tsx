'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Database,
  BookOpen,
  FolderKanban,
  Search,
  Network,
  Cpu,
  Sparkles,
  Sliders,
  ChartColumn,
  HardDrive,
  Layers,
  Settings2,
  CircleHelp,
  X,
  ChevronDown,
  Check,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const [selectedWorkspace, setSelectedWorkspace] = useState('Development Workspace');
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const navSections = [
    {
      id: 'main',
      label: 'MAIN',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Memory', icon: Database, href: '/memory' },
        { label: 'Knowledge Base', icon: BookOpen, href: '/knowledge' },
        { label: 'Projects', icon: FolderKanban, href: '/projects' },
        { label: 'Search', icon: Search, href: '/search' },
        { label: 'Graph Topology', icon: Network, href: '/graph' },
      ],
    },
    {
      id: 'ai-context',
      label: 'TOOLS & ANALYTICS',
      items: [
        { label: 'Console', icon: Cpu, href: '/context' },
        { label: 'Context Builder', icon: Sparkles, href: '/context' },
        { label: 'Prompt Studio', icon: Sliders, href: '/context' },
        { label: 'Analytics', icon: ChartColumn, href: '/analytics' },
      ],
    },
    {
      id: 'system',
      label: 'SYSTEM',
      items: [
        { label: 'Storage & Embeddings', icon: HardDrive, href: '/storage' },
        { label: 'Integrations', icon: Layers, href: '/settings' },
        { label: 'Settings', icon: Settings2, href: '/settings' },
        { label: 'Help & Support', icon: CircleHelp, href: '/settings' },
      ],
    },
  ];

  return (
    <div className="md:hidden fixed inset-0 z-50 flex bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-[280px] h-full bg-white dark:bg-[#0C0D10] border-r border-[#E5E7EB] dark:border-white/[0.05] flex flex-col justify-between p-3 z-10 shadow-2xl animate-in slide-in-from-left duration-200 overflow-hidden select-none">
        {/* Top Section */}
        <div className="flex flex-col space-y-3">
          {/* Header & Workspace Switcher */}
          <div className="relative">
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04] transition-colors">
              <button
                onClick={() => setIsWorkspaceDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 overflow-hidden text-left flex-1 min-w-0"
              >
                <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                  M
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-semibold text-xs text-[#111827] dark:text-neutral-100 truncate">
                    {selectedWorkspace}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#6B7280] dark:text-neutral-400 transition-transform duration-200 ${
                      isWorkspaceDropdownOpen ? 'rotate-180 text-[#111827] dark:text-white' : ''
                    }`}
                  />
                </div>
              </button>

              <button
                onClick={onClose}
                className="p-1 rounded-md text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isWorkspaceDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#141519] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl shadow-xl p-1.5 z-50 text-xs text-[#111827] dark:text-neutral-300 space-y-1 animate-in fade-in duration-150">
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-[#6B7280] dark:text-neutral-500 tracking-wider">
                  CURRENT WORKSPACE
                </div>
                <div className="flex items-center justify-between h-[36px] px-2.5 bg-[#2563EB]/10 dark:bg-[#2563EB]/15 border border-[#2563EB]/30 rounded-lg text-[#111827] dark:text-white font-medium">
                  <span className="truncate">{selectedWorkspace}</span>
                  <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                </div>

                <div className="h-px bg-[#E5E7EB] dark:bg-white/[0.06] my-1"></div>

                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-[#6B7280] dark:text-neutral-500 tracking-wider">
                  WORKSPACES
                </div>
                {['Personal Workspace', 'Research Workspace', 'Client Workspace'].map((ws) => (
                  <button
                    key={ws}
                    onClick={() => {
                      setSelectedWorkspace(ws);
                      setIsWorkspaceDropdownOpen(false);
                    }}
                    className="w-full h-[36px] px-2.5 text-left rounded-lg flex items-center gap-2 hover:bg-[#F3F4F6] dark:hover:bg-white/[0.05] text-[#111827] dark:text-neutral-300 transition-colors"
                  >
                    <span className="truncate">{ws}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <div className="w-full h-[36px] px-3 bg-[#F6F7F9] dark:bg-white/[0.03] border border-[#E5E7EB] dark:border-white/[0.05] rounded-lg flex items-center gap-2 text-xs text-[#6B7280] dark:text-neutral-400">
            <Search className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="truncate">Search...</span>
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto space-y-3 pt-1 pr-0.5 max-h-[calc(100vh-160px)]">
            {navSections.map((section) => (
              <div key={section.id} className="space-y-0.5">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-[#6B7280] dark:text-neutral-500 tracking-wider">
                  {section.label}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center h-[36px] px-2.5 gap-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                        isActive
                          ? 'bg-[#F3F4F6] dark:bg-[#2563EB]/15 text-[#111827] dark:text-white font-semibold border-l-2 border-[#2563EB]'
                          : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-neutral-100 hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-[#6B7280] dark:text-neutral-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Compact Footer Row */}
        <div className="h-[36px] px-2.5 bg-[#F6F7F9] dark:bg-white/[0.02] border border-[#E5E7EB] dark:border-white/[0.05] rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="font-medium text-[#111827] dark:text-neutral-300 text-xs truncate">Development</span>
          </div>
          <span className="text-[10px] font-mono text-[#6B7280] dark:text-neutral-400">1,284 memories</span>
        </div>
      </div>
    </div>
  );
}
