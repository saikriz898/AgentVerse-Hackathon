'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Brain, Plus, Search, User } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenBottomSheet: () => void;
}

export default function MobileBottomNav({ onOpenBottomSheet }: MobileBottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Memory', icon: Brain, href: '/memory' },
    { label: 'Create', isCenterButton: true },
    { label: 'Search', icon: Search, href: '/search' },
    { label: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-[#101010]/95 backdrop-blur-xl border-t border-white/[0.06] rounded-t-2xl px-3 flex items-center justify-around z-40 select-none shadow-2xl">
      {navItems.map((item, idx) => {
        if (item.isCenterButton) {
          return (
            <button
              key="center-fab"
              onClick={onOpenBottomSheet}
              aria-label="Quick Create"
              className="w-12 h-12 -mt-5 bg-gradient-to-tr from-[#7C3AED] to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-900/60 border-2 border-[#101010] active:scale-95 transition-transform"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          );
        }

        const Icon = item.icon!;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href!}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
              isActive ? 'text-[#7C3AED]' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
