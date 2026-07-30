'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchApi } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import {
  Settings2,
  Save,
  Layers,
  HelpCircle,
  Shield,
  Key,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Download,
  Plus,
  MessageSquare,
  Search,
  BookOpen,
  FileCode,
  Sliders,
  Check,
  Server,
  Lock,
  Globe,
  Database,
  Send,
} from 'lucide-react';

interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'disconnected' | 'warning';
  healthScore: number;
  lastSync: string;
  apiKeyMasked: string;
}

interface SupportTicket {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
}

function SettingsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'settings' | 'integrations' | 'support'>('settings');

  useEffect(() => {
    if (tabParam === 'integrations' || tabParam === 'support' || tabParam === 'settings') {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Settings State
  const [embeddingModel, setEmbeddingModel] = useState('Google Gemini text-embedding-004 (768 dimensions)');
  const [rrfConstant, setRrfConstant] = useState(60);
  const [vectorThreshold, setVectorThreshold] = useState(0.75);
  const [retentionDays, setRetentionDays] = useState(90);

  // Support Ticket Form State
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState('General');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [ticketDescription, setTicketDescription] = useState('');

  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: 't-101', title: 'pgvector Cosine Distance Query Optimization', category: 'Database', priority: 'high', status: 'in-progress', createdAt: '2 hours ago' },
    { id: 't-102', title: 'BullMQ Worker Heartbeat Monitoring Alert', category: 'Queue', priority: 'medium', status: 'open', createdAt: 'Yesterday' },
  ]);

  const [integrations] = useState<IntegrationItem[]>([
    { id: 'int-1', name: 'Google Gemini API', category: 'AI Provider', status: 'connected', healthScore: 100, lastSync: 'Just now', apiKeyMasked: 'AIzaSy...492x' },
    { id: 'int-2', name: 'PostgreSQL pgvector', category: 'Database', status: 'connected', healthScore: 100, lastSync: 'Just now', apiKeyMasked: 'postgres://...neon.tech' },
    { id: 'int-3', name: 'Redis Cache Cluster', category: 'Cache', status: 'connected', healthScore: 98, lastSync: 'Just now', apiKeyMasked: 'redis://...17942' },
    { id: 'int-4', name: 'GitHub Workspace Sync', category: 'Developer Tools', status: 'connected', healthScore: 96, lastSync: '10m ago', apiKeyMasked: 'ghp_8f9...402a' },
    { id: 'int-5', name: 'OpenAI API Compatibility', category: 'AI Provider', status: 'disconnected', healthScore: 0, lastSync: 'Never', apiKeyMasked: 'Not configured' },
    { id: 'int-6', name: 'Anthropic Claude API', category: 'AI Provider', status: 'disconnected', healthScore: 0, lastSync: 'Never', apiKeyMasked: 'Not configured' },
  ]);

  const handleSaveSettings = () => {
    setFeedbackMsg('Workspace settings saved successfully.');
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    const newTicket: SupportTicket = {
      id: `t-${Date.now()}`,
      title: ticketTitle,
      category: ticketCategory,
      priority: ticketPriority,
      status: 'open',
      createdAt: 'Just now',
    };

    setTickets([newTicket, ...tickets]);
    setTicketTitle('');
    setTicketDescription('');
    setFeedbackMsg('Support ticket created successfully.');
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const exportDiagnostics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      workspace: 'Development Workspace',
      settings: { embeddingModel, rrfConstant, vectorThreshold, retentionDays },
      integrationsCount: integrations.filter((i) => i.status === 'connected').length,
      ticketsCount: tickets.length,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-diagnostics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
          breadcrumb={['Workspace', 'Platform Management']}
          title="Settings & Workspace Operations"
          description="Centralized configuration management workspace for system settings, third-party integrations, and operational help desk."
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]"
        />

        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] p-1 rounded-xl shadow-sm dark:shadow-none w-full sm:w-auto">
            {[
              { id: 'settings', label: 'Platform Settings', icon: Settings2 },
              { id: 'integrations', label: 'Integrations Manager', icon: Layers },
              { id: 'support', label: 'Help & Support Desk', icon: HelpCircle },
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

          <button
            onClick={exportDiagnostics}
            className="h-[30px] px-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04] text-[#111827] dark:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Diagnostics</span>
          </button>
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
        {/* Module 1: Settings Workspace */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Model & Search Parameters */}
            <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-none">
              <h2 className="text-sm font-bold text-[#111827] dark:text-white flex items-center gap-2 border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
                <Sliders className="w-4 h-4 text-[#2563EB]" />
                Embedding & Model Parameters
              </h2>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Embedding Model</label>
                  <input
                    type="text"
                    disabled
                    value={embeddingModel}
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl p-2.5 text-[#111827] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">RRF Constant (k)</label>
                  <input
                    type="number"
                    value={rrfConstant}
                    onChange={(e) => setRrfConstant(parseInt(e.target.value))}
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl p-2.5 text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Vector Similarity Threshold</label>
                  <input
                    type="number"
                    step="0.05"
                    value={vectorThreshold}
                    onChange={(e) => setVectorThreshold(parseFloat(e.target.value))}
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl p-2.5 text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* Retention & Security */}
            <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-none">
              <h2 className="text-sm font-bold text-[#111827] dark:text-white flex items-center gap-2 border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
                <Shield className="w-4 h-4 text-purple-400" />
                Security & Data Retention Policies
              </h2>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Soft-Deleted Retention (Days)</label>
                  <input
                    type="number"
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl p-2.5 text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Workspace Security Isolation</label>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-bold">
                    JWT Auth & Workspace ID Scoping Active
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveSettings}
                    className="h-9 px-5 bg-[#2563EB] hover:bg-blue-600 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module 2: Integrations Manager Workspace */}
        {activeTab === 'integrations' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {integrations.map((item) => (
                <div key={item.id} className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-3 font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
                    <span className="font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-[#2563EB]" /> {item.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        item.status === 'connected'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-[11px] text-gray-400">
                    <p>Category: <strong className="text-white">{item.category}</strong></p>
                    <p>Last Sync: <strong className="text-cyan-400">{item.lastSync}</strong></p>
                    <p className="truncate">Key/URL: <span className="text-gray-300">{item.apiKeyMasked}</span></p>
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <button className="px-2.5 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg font-mono text-[10px]">
                      Test Health
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module 3: Help & Support Desk Workspace */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left: Create Support Ticket Form (5 cols) */}
            <div className="md:col-span-5 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-[#111827] dark:text-white flex items-center gap-2 border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Submit Support Ticket
              </h2>

              <form onSubmit={handleCreateTicket} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Issue Title</label>
                  <input
                    type="text"
                    required
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="Brief description of the issue..."
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl p-2.5 text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Category</label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl p-2 text-[#111827] dark:text-white focus:outline-none"
                    >
                      <option value="General">General</option>
                      <option value="Database">Database</option>
                      <option value="Queue">Queue & Worker</option>
                      <option value="API">API Gateway</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Priority</label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value as any)}
                      className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl p-2 text-[#111827] dark:text-white focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Provide details or steps to reproduce..."
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl p-2.5 text-[#111827] dark:text-white focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </form>
            </div>

            {/* Right: Active Support Tickets List (7 cols) */}
            <div className="md:col-span-7 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-[#111827] dark:text-white flex items-center gap-2 border-b border-[#E5E7EB] dark:border-white/[0.06] pb-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Active Support Tickets & Knowledge Desk
              </h2>

              <div className="space-y-3 font-mono text-xs">
                {tickets.map((t) => (
                  <div key={t.id} className="p-3.5 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111827] dark:text-white">{t.title}</span>
                      <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-bold uppercase">{t.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>ID: {t.id} • Category: {t.category}</span>
                      <span className="text-cyan-400">{t.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Status Footer (shrink-0) */}
      <div className="shrink-0 flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-white/[0.06] text-xs text-[#6B7280] dark:text-neutral-400 font-mono bg-white dark:bg-[#090909] z-10">
        <span>Workspace Operations: ACTIVE</span>
        <span>Mode: {activeTab.toUpperCase()}</span>
      </div>
    </motion.div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs font-mono text-gray-400">Loading settings workspace...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
