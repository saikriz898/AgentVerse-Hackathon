'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchApi } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import {
  Building2,
  Users,
  Shield,
  Bell,
  Activity,
  UserPlus,
  Check,
  X,
  Mail,
  Lock,
  Globe,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Filter,
  Send,
  Sparkles,
} from 'lucide-react';

interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Administrator' | 'Developer' | 'Member' | 'Viewer';
  status: 'active' | 'invited' | 'suspended';
  joinedAt: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  actor: string;
  module: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  module: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'audit' | 'notifications'>('overview');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Workspace Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Owner' | 'Administrator' | 'Developer' | 'Member' | 'Viewer'>('Developer');

  // Members State
  const [members, setMembers] = useState<WorkspaceMember[]>([
    { id: 'm-1', name: 'System Operator', email: 'operator@memoryagent.ai', role: 'Owner', status: 'active', joinedAt: '2 months ago' },
    { id: 'm-2', name: 'Alex Rivera', email: 'alex@memoryagent.ai', role: 'Administrator', status: 'active', joinedAt: '1 month ago' },
    { id: 'm-3', name: 'Sarah Chen', email: 'sarah@memoryagent.ai', role: 'Developer', status: 'active', joinedAt: '2 weeks ago' },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    { id: 'n-1', title: 'Background Embedding Job Completed', message: '768d vector batch stored for Development Workspace', module: 'Embedding Worker', type: 'success', isRead: false, createdAt: '10m ago' },
    { id: 'n-2', title: 'Relationship Topology Refreshed', message: 'Force-directed graph layout re-calculated', module: 'Graph Engine', type: 'info', isRead: false, createdAt: '25m ago' },
    { id: 'n-3', title: 'Trash Vault Purge Performed', message: 'Soft-deleted entries permanently purged by Administrator', module: 'Trash Vault', type: 'warning', isRead: true, createdAt: '1h ago' },
  ]);

  const auditLogs: AuditLogItem[] = [
    { id: 'aud-101', action: 'Workspace Member Joined', actor: 'Sarah Chen', module: 'Members', timestamp: '2 weeks ago', status: 'success' },
    { id: 'aud-102', action: 'Vector Distance Threshold Updated', actor: 'System Operator', module: 'Settings', timestamp: '1 day ago', status: 'success' },
    { id: 'aud-103', action: 'Permanent Purge Executed', actor: 'Alex Rivera', module: 'Trash Vault', timestamp: '1 hour ago', status: 'warning' },
  ];

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: WorkspaceMember = {
      id: `m-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'invited',
      joinedAt: 'Just now',
    };

    setMembers([...members, newMember]);
    setInviteEmail('');
    setFeedbackMsg(`Invitation sent to ${inviteEmail}.`);
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    setFeedbackMsg('All notifications marked as read.');
    setTimeout(() => setFeedbackMsg(''), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="h-full flex flex-col justify-between relative select-none font-sans text-[#111827] dark:text-neutral-100 overflow-hidden"
    >
      {/* Fixed Top Header (shrink-0) */}
      <div className="shrink-0 space-y-3 pb-1">
        <PageHeader
          breadcrumb={['Workspace', 'Multi-Tenant Management']}
          title="Workspace Management & Notification Center"
          description="Tenant boundary control, role-based access enforcement, team collaboration, and platform event notification engine."
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]"
        />

        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] p-1 rounded-xl shadow-sm dark:shadow-none w-full sm:w-auto">
            {[
              { id: 'overview', label: 'Workspace Overview', icon: Building2 },
              { id: 'members', label: 'Members & Roles', icon: Users },
              { id: 'audit', label: 'Audit Logs & Activity', icon: Activity },
              { id: 'notifications', label: 'Notification Center', icon: Bell },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`h-[30px] px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[#2563EB]/15 text-[#2563EB] dark:text-blue-300 border border-[#2563EB]/30'
                      : 'text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === 'notifications' && (
            <button
              onClick={markAllRead}
              className="h-[30px] px-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04] text-[#111827] dark:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Main Content Viewport (ONLY THIS SCROLLS) */}
      <div className="flex-1 my-1.5 overflow-y-auto pr-1 space-y-4 font-sans text-xs">
        {/* Tab 1: Overview & Isolation Status */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#111827] dark:text-white">Active Workspace: Development Workspace</h2>
                  <p className="text-xs text-[#6B7280] dark:text-neutral-400">Strict multi-tenant workspace isolation active across repository & vector search layers</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs pt-2">
                <div className="p-3.5 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl space-y-1">
                  <span className="text-gray-500 text-[10px] font-bold uppercase">Total Workspace Memories</span>
                  <p className="text-lg font-bold text-[#2563EB]">1,284</p>
                </div>
                <div className="p-3.5 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl space-y-1">
                  <span className="text-gray-500 text-[10px] font-bold uppercase">Active Team Members</span>
                  <p className="text-lg font-bold text-emerald-400">{members.length}</p>
                </div>
                <div className="p-3.5 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl space-y-1">
                  <span className="text-gray-500 text-[10px] font-bold uppercase">Isolation Status</span>
                  <p className="text-lg font-bold text-purple-400">Strict Scoped</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Members & Roles */}
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left: Invite Member Form (5 cols) */}
            <div className="md:col-span-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-[#111827] dark:text-white flex items-center gap-2 border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
                <UserPlus className="w-4 h-4 text-[#2563EB]" />
                Invite Workspace Member
              </h2>

              <form onSubmit={handleInviteMember} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@organization.com"
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl p-2.5 text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Assign Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl p-2 text-[#111827] dark:text-white focus:outline-none"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Developer">Developer</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invitation</span>
                </button>
              </form>
            </div>

            {/* Right: Members List (7 cols) */}
            <div className="md:col-span-7 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-[#111827] dark:text-white flex items-center gap-2 border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
                <Users className="w-4 h-4 text-purple-400" />
                Active Members ({members.length})
              </h2>

              <div className="space-y-3 font-mono text-xs">
                {members.map((m) => (
                  <div key={m.id} className="p-3.5 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#111827] dark:text-white">{m.name}</h3>
                      <p className="text-[11px] text-gray-400">{m.email} • Joined {m.joinedAt}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-[#2563EB]/15 text-[#2563EB] dark:text-blue-300 rounded-lg text-[11px] font-bold border border-[#2563EB]/30">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-5 space-y-4 font-mono text-xs">
            <h2 className="text-sm font-bold text-[#111827] dark:text-white flex items-center gap-2 border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Workspace Audit Logs & Activity Stream
            </h2>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#111827] dark:text-white">{log.action}</span>
                    <span className="text-gray-400">Actor: {log.actor}</span>
                    <span className="text-purple-400">{log.module}</span>
                  </div>
                  <span className="text-gray-500">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Notification Center */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
              <h2 className="text-sm font-bold text-[#111827] dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                Real-Time Notification Stream
              </h2>
              <span className="text-[10px] text-gray-500">{notifications.filter((n) => !n.isRead).length} Unread</span>
            </div>

            <div className="space-y-2.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    !n.isRead
                      ? 'bg-[#2563EB]/10 border-[#2563EB]/30'
                      : 'bg-[#F6F7F9] dark:bg-[#111111] border-[#E5E7EB] dark:border-white/[0.06]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111827] dark:text-white">{n.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold uppercase">
                        {n.module}
                      </span>
                    </div>
                    <p className="text-[#6B7280] dark:text-neutral-300">{n.message}</p>
                  </div>
                  <span className="text-gray-500 text-[10px] shrink-0">{n.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Status Footer (shrink-0) */}
      <div className="shrink-0 flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-white/[0.06] text-xs text-[#6B7280] dark:text-neutral-400 font-mono bg-white dark:bg-[#090909] z-10">
        <span>Workspace System: OPERATIONAL</span>
        <span>Mode: {activeTab.toUpperCase()}</span>
      </div>
    </motion.div>
  );
}
