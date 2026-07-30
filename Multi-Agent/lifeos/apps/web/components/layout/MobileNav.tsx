'use client';

import React from 'react';
import { LayoutDashboard, Bot, FolderKanban, BookOpen, Settings } from 'lucide-react';
import { useUIStore } from '@/lib/stores/useUIStore';

export const MobileNav: React.FC = () => {
  const { activeNavId, setActiveNavId } = useUIStore();

  const MOBILE_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-workspace', label: 'AI Fleet', icon: Bot },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'knowledge', label: 'Memory', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 justify-around items-center transition-luxury">
      {MOBILE_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeNavId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveNavId(item.id)}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-luxury ${
              isActive ? 'text-[hsl(var(--accent-primary))]' : 'text-[hsl(var(--text-muted))]'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
