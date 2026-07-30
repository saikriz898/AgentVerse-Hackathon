'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import ManageWorkspacesModal from './ManageWorkspacesModal';
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
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Plus,
  Check,
  Building2,
  User,
  FlaskConical,
  Briefcase,
  Gift,
  Trash2,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isCollapsed: externalCollapsed, onToggleCollapse }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('Development Workspace');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Tooltip Hover State for Collapsed Mode
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);

  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed((prev) => !prev));
  const pathname = usePathname();

  const triggerCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  const workspaces = [
    { name: 'Personal Workspace', icon: User },
    { name: 'Research Workspace', icon: FlaskConical },
    { name: 'Client Workspace', icon: Briefcase },
    { name: 'Demo Workspace', icon: Gift },
  ];

  const navSections = [
    {
      id: 'main',
      label: 'MAIN',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Memory Engine', icon: Database, href: '/memory' },
        { label: 'Search Playground', icon: Search, href: '/search' },
        { label: 'Graph Topology', icon: Network, href: '/graph' },
      ],
    },
    {
      id: 'ai-context',
      label: 'TOOLS & ANALYTICS',
      items: [
        { label: 'Developer Console', icon: Cpu, href: '/system-health' },
        { label: 'Context Builder', icon: Sparkles, href: '/context' },
        { label: 'Prompt Studio', icon: Sliders, href: '/prompts' },
        { label: 'Analytics', icon: ChartColumn, href: '/analytics' },
      ],
    },
    {
      id: 'system',
      label: 'SYSTEM',
      items: [
        { label: 'Trash Vault', icon: Trash2, href: '/trash' },
        { label: 'Storage & Embeddings', icon: HardDrive, href: '/storage' },
        { label: 'Integrations', icon: Layers, href: '/settings?tab=integrations' },
        { label: 'Settings', icon: Settings2, href: '/settings?tab=settings' },
        { label: 'Help & Support', icon: CircleHelp, href: '/settings?tab=support' },
      ],
    },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 bottom-0 h-screen z-40 bg-white dark:bg-[#111111] border-r border-[#E5E7EB] dark:border-white/[0.05] flex flex-col justify-between overflow-hidden select-none transition-all duration-200 ease-in-out ${
          isCollapsed ? 'w-[72px]' : 'w-[280px]'
        }`}
      >
        {/* Top Container */}
        <div className="flex flex-col flex-1 overflow-hidden p-3 space-y-3">
          {/* Header & Workspace Switcher Row */}
          <div className="relative">
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04] transition-colors">
              {!isCollapsed ? (
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
              ) : (
                <div className="w-6 h-6 mx-auto rounded-md bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs">
                  M
                </div>
              )}

              {/* Collapse Button */}
              <button
                onClick={toggleCollapse}
                title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                className="p-1 rounded-md text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] transition-colors shrink-0"
              >
                {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
            </div>

            {/* Dropdown Menu */}
            {isWorkspaceDropdownOpen && !isCollapsed && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#141519] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl shadow-xl p-1.5 z-50 text-xs text-[#111827] dark:text-neutral-300 space-y-1 animate-in fade-in duration-150">
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-[#6B7280] dark:text-neutral-500 tracking-wider">
                  CURRENT WORKSPACE
                </div>
                <div className="flex items-center justify-between h-[36px] px-2.5 bg-[#2563EB]/10 dark:bg-[#2563EB]/15 border border-[#2563EB]/30 rounded-lg font-medium text-[#111827] dark:text-white">
                  <span className="truncate">{selectedWorkspace}</span>
                  <Check className="w-3.5 h-3.5 text-[#2563EB]" />
                </div>

                <div className="h-px bg-[#E5E7EB] dark:bg-white/[0.06] my-1"></div>

                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-[#6B7280] dark:text-neutral-500 tracking-wider">
                  WORKSPACES
                </div>
                {workspaces.map((ws) => {
                  const Icon = ws.icon;
                  return (
                    <button
                      key={ws.name}
                      onClick={() => {
                        setSelectedWorkspace(ws.name);
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className="w-full h-[36px] px-2.5 text-left rounded-lg flex items-center gap-2 hover:bg-[#F3F4F6] dark:hover:bg-white/[0.05] text-[#111827] dark:text-neutral-300 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-[#6B7280] dark:text-neutral-400" />
                      <span className="truncate">{ws.name}</span>
                    </button>
                  );
                })}

                <div className="h-px bg-[#E5E7EB] dark:bg-white/[0.06] my-1"></div>

                <button
                  onClick={() => {
                    setIsWorkspaceDropdownOpen(false);
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full h-[36px] px-2.5 text-left rounded-lg flex items-center gap-2 hover:bg-[#F3F4F6] dark:hover:bg-white/[0.05] text-[#111827] dark:text-neutral-300 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Create Workspace</span>
                </button>
                <button
                  onClick={() => {
                    setIsWorkspaceDropdownOpen(false);
                    setIsManageModalOpen(true);
                  }}
                  className="w-full h-[36px] px-2.5 text-left rounded-lg flex items-center gap-2 hover:bg-[#F3F4F6] dark:hover:bg-white/[0.05] text-[#111827] dark:text-neutral-300 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#6B7280] dark:text-neutral-400" />
                  <span>Manage Workspaces</span>
                </button>
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <div>
            {isCollapsed ? (
              <button
                onClick={triggerCommandPalette}
                onMouseEnter={() => setHoveredTooltip('Search')}
                onMouseLeave={() => setHoveredTooltip(null)}
                className="w-9 h-9 mx-auto bg-[#F6F7F9] dark:bg-white/[0.03] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] border border-[#E5E7EB] dark:border-white/[0.05] rounded-lg flex items-center justify-center text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white transition-all relative"
              >
                <Search className="w-4 h-4 text-[#2563EB]" />
                {hoveredTooltip === 'Search' && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-white dark:bg-[#141519] border border-[#E5E7EB] dark:border-white/[0.1] text-[#111827] dark:text-white text-xs rounded-lg shadow-xl z-50 whitespace-nowrap">
                    Search (⌘K)
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={triggerCommandPalette}
                className="w-full h-[36px] px-3 bg-[#F6F7F9] dark:bg-white/[0.03] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.06] border border-[#E5E7EB] dark:border-white/[0.05] rounded-lg flex items-center justify-between text-xs text-[#6B7280] dark:text-neutral-400 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-[#2563EB] group-hover:text-blue-500 transition-colors" />
                  <span className="truncate">Search...</span>
                </div>
                <kbd className="bg-white dark:bg-white/[0.06] text-[#6B7280] dark:text-neutral-300 font-mono text-[10px] px-1.5 py-0.2 rounded border border-[#E5E7EB] dark:border-white/[0.06]">
                  ⌘K
                </kbd>
              </button>
            )}
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto space-y-3 pt-1 pr-0.5">
            {navSections.map((section) => (
              <div key={section.id} className="space-y-0.5">
                {!isCollapsed && (
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-[#6B7280] dark:text-neutral-500 tracking-wider">
                    {section.label}
                  </div>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <div key={item.label} className="relative">
                      <Link
                        href={item.href}
                        onMouseEnter={() => isCollapsed && setHoveredTooltip(item.label)}
                        onMouseLeave={() => isCollapsed && setHoveredTooltip(null)}
                        className={`flex items-center h-[36px] px-2.5 gap-2.5 rounded-lg text-[13px] font-medium transition-colors group ${
                          isActive
                            ? 'bg-[#F3F4F6] dark:bg-[#2563EB]/15 text-[#111827] dark:text-white font-semibold border-l-2 border-[#2563EB]'
                            : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-neutral-100 hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04]'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-[#2563EB]' : 'text-[#6B7280] dark:text-neutral-400 group-hover:text-[#111827] dark:group-hover:text-neutral-200'
                          }`}
                        />

                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </Link>

                      {/* Collapsed Mode Hover Tooltip */}
                      {isCollapsed && hoveredTooltip === item.label && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-white dark:bg-[#141519] border border-[#E5E7EB] dark:border-white/[0.1] text-[#111827] dark:text-white text-xs rounded-lg shadow-xl z-50 whitespace-nowrap animate-in fade-in duration-150">
                          {item.label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Row */}
        <div className="p-3 border-t border-[#E5E7EB] dark:border-white/[0.05] bg-white dark:bg-[#111111]">
          {isCollapsed ? (
            <div className="flex justify-center" title="Development Workspace ● Online">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          ) : (
            <div className="h-[36px] px-2.5 bg-[#F6F7F9] dark:bg-white/[0.02] border border-[#E5E7EB] dark:border-white/[0.05] rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="font-medium text-[#111827] dark:text-neutral-300 text-xs truncate">Development</span>
              </div>
              <span className="text-[10px] font-mono text-[#6B7280] dark:text-neutral-400">1,284 memories</span>
            </div>
          )}
        </div>
      </aside>

      {/* Workspace Modals */}
      <CreateWorkspaceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <ManageWorkspacesModal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} />
    </>
  );
}
