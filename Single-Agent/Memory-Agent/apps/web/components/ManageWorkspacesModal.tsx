'use client';

import { Building2, User, FlaskConical, Briefcase, Gift, X, UserPlus, Settings, Archive } from 'lucide-react';

interface ManageWorkspacesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageWorkspacesModal({ isOpen, onClose }: ManageWorkspacesModalProps) {
  if (!isOpen) return null;

  const workspaces = [
    { name: 'Development Workspace', icon: Building2, role: 'Owner', roleColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/20', members: 12, status: 'Active' },
    { name: 'Personal Workspace', icon: User, role: 'Admin', roleColor: 'bg-[#2563EB]/10 text-[#2563EB] dark:text-blue-400 border-[#2563EB]/20', members: 1, status: 'Active' },
    { name: 'Research Workspace', icon: FlaskConical, role: 'Member', roleColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20', members: 4, status: 'Active' },
    { name: 'Client Workspace', icon: Briefcase, role: 'Admin', roleColor: 'bg-[#2563EB]/10 text-[#2563EB] dark:text-blue-400 border-[#2563EB]/20', members: 8, status: 'Active' },
    { name: 'Demo Workspace', icon: Gift, role: 'Viewer', roleColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20', members: 2, status: 'Active' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4 select-none">
      <div className="w-full max-w-xl bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 text-[#111827] dark:text-white">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111827] dark:text-white">Manage Workspaces</h2>
            <p className="text-xs text-[#6B7280] dark:text-neutral-400">View team roles, members, and workspace configurations</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspaces List / Table */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {workspaces.map((ws) => {
            const Icon = ws.icon;
            return (
              <div
                key={ws.name}
                className="p-3 bg-[#F6F7F9] dark:bg-[#111111] hover:bg-[#F3F4F6] dark:hover:bg-[#202020] border border-[#E5E7EB] dark:border-white/[0.04] rounded-xl flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] flex items-center justify-center text-[#2563EB] shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="font-semibold text-[#111827] dark:text-white truncate">{ws.name}</span>
                    <span className="text-[11px] text-[#6B7280] dark:text-neutral-400 font-mono">{ws.members} members</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${ws.roleColor}`}>
                    {ws.role}
                  </span>
                  <div className="flex items-center gap-1">
                    <button title="Settings" className="p-1.5 hover:bg-white dark:hover:bg-[#171717] rounded-lg text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button title="Archive" className="p-1.5 hover:bg-white dark:hover:bg-[#171717] rounded-lg text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white">
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB] dark:border-white/[0.06]">
          <button className="h-10 px-4 bg-[#2563EB]/10 hover:bg-[#2563EB]/20 border border-[#2563EB]/30 text-[#2563EB] dark:text-blue-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors">
            <UserPlus className="w-4 h-4" />
            <span>Invite Members</span>
          </button>

          <button
            onClick={onClose}
            className="h-10 px-5 bg-[#F6F7F9] dark:bg-[#111111] hover:bg-[#F3F4F6] dark:hover:bg-[#202020] border border-[#E5E7EB] dark:border-white/[0.06] text-[#111827] dark:text-neutral-300 rounded-xl text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
