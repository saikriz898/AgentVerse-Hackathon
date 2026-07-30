'use client';

import { useAuthStore } from '../../../stores/useAuthStore';
import { useRouter } from 'next/navigation';
import PageHeader from '../../../components/PageHeader';
import {
  User,
  SunMoon,
  Bell,
  ShieldCheck,
  Link2,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const menuSections = [
    {
      title: 'Preferences',
      items: [
        { label: 'Personal Settings', icon: User, href: '/settings' },
        { label: 'Appearance & Theme', value: 'Light / Dark / System', icon: SunMoon, href: '/preferences' },
        { label: 'Notifications', icon: Bell, href: '/preferences' },
      ],
    },
    {
      title: 'Account & Security',
      items: [
        { label: 'Security & Auth', icon: ShieldCheck, href: '/settings' },
        { label: 'Connected Accounts', icon: Link2, href: '/settings' },
      ],
    },
    {
      title: 'Support & System',
      items: [
        { label: 'Help & Support', icon: HelpCircle, href: '/settings' },
        { label: 'About Memory Agent', value: 'Platform Release', icon: Info, href: '/settings' },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-xl mx-auto select-none pb-12 font-sans text-[#111827] dark:text-neutral-100">
      <PageHeader breadcrumb={['Workspace', 'Profile']} title="Profile" description="Manage your account preferences and settings." />

      {/* User Header Profile Card */}
      <div className="p-6 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl flex flex-col items-center text-center space-y-3 shadow-sm dark:shadow-none">
        <div className="w-20 h-20 rounded-2xl bg-[#2563EB] border-2 border-blue-400/30 flex items-center justify-center text-white font-bold text-2xl shadow-md">
          {user?.fullName?.[0] || 'A'}
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#111827] dark:text-white">{user?.fullName || 'Lead Architect'}</h2>
          <p className="text-xs text-[#6B7280] dark:text-neutral-400 font-mono">{user?.email || 'alpha@memoryagent.io'}</p>
        </div>
        <span className="text-[11px] font-mono font-semibold text-[#2563EB] dark:text-blue-300 bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-1 rounded-full">
          Workspace Owner
        </span>
      </div>

      {/* Settings Menu Cards */}
      <div className="space-y-4">
        {menuSections.map((sec) => (
          <div key={sec.title} className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-2 space-y-1 shadow-sm dark:shadow-none">
            {sec.items.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  className="p-3.5 hover:bg-[#F3F4F6] dark:hover:bg-[#202020] rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.04] flex items-center justify-center text-[#6B7280] dark:text-neutral-400 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-[#111827] dark:text-neutral-200 group-hover:text-[#2563EB] dark:group-hover:text-white transition-colors">
                      {item.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.value && <span className="text-xs font-mono text-[#6B7280] dark:text-neutral-400">{item.value}</span>}
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] dark:text-neutral-500 group-hover:text-[#111827] dark:group-hover:text-neutral-300" />
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            router.push('/login');
          }}
          className="w-full p-4 bg-white dark:bg-[#171717] hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-[#E5E7EB] dark:border-white/[0.06] hover:border-rose-400/40 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold text-[#DC2626] dark:text-rose-400 transition-colors shadow-sm dark:shadow-none"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
