'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Zap,
  Server,
  Cloud,
  Bot,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Sparkles,
  Layers,
  Crown,
  FileText,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const AccountManagerView: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('USD');
  const [upgradedAgents, setUpgradedAgents] = useState<string[]>(['chief-of-staff', 'memory-agent']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currencySymbol =
    selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : selectedCurrency === 'GBP' ? '£' : '₹';
  const exchangeRate =
    selectedCurrency === 'USD' ? 1 : selectedCurrency === 'EUR' ? 0.92 : selectedCurrency === 'GBP' ? 0.78 : 83.5;

  const formatAmount = (usd: number) => {
    const val = Math.round(usd * exchangeRate);
    return `${currencySymbol}${val.toLocaleString()}`;
  };

  const handleUpgradeAgent = (agentId: string, name: string) => {
    if (upgradedAgents.includes(agentId)) return;
    setUpgradedAgents((prev) => [...prev, agentId]);
    setToastMessage(`Upgraded ${name} to Enterprise Microservice Tier!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8 font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-2xl font-bold text-xs animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="accent" className="flex items-center gap-1">
              <CreditCard className="h-3.5 w-3.5 text-accent-primary" /> Account Manager & Financial Cockpit
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">Ported from Single-Agent/finance-agent</Badge>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 font-mono text-xs">
              ⚡ Live Cloud Billing Synced
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Account Manager, Billing & Financial Architect
          </h1>
          <p className="text-sm text-text-secondary">
            Manage multi-cloud infrastructure hosting costs (AWS, Azure, GCP, Vercel), token usage budgets, agent fleet subscriptions, and invoice exports.
          </p>
        </div>

        {/* Currency Selector & Quick Export */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl bg-surface-2 p-1 border border-border text-xs">
            {(['USD', 'EUR', 'GBP', 'INR'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setSelectedCurrency(curr)}
                className={`px-3 py-1 rounded-lg font-bold transition-luxury ${
                  selectedCurrency === curr
                    ? 'bg-accent-primary text-white shadow-xs'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="font-semibold text-xs">
            <Download className="mr-1.5 h-4 w-4" /> Export Invoices (PDF/CSV)
          </Button>
        </div>
      </div>

      {/* SECTION 1: TOP 4 ACCOUNT KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center justify-between bg-surface-1 p-4 border border-border">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase">Available Credit Balance</span>
            <p className="mt-1.5 text-xl font-bold text-text-primary">{formatAmount(4250)}</p>
            <span className="text-[11px] text-emerald-400 font-semibold">Auto-Recharge Active</span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
            <CreditCard className="h-5 w-5 stroke-[1.75]" />
          </div>
        </Card>

        <Card className="flex items-center justify-between bg-surface-1 p-4 border border-border">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase">Monthly Infra Hosting</span>
            <p className="mt-1.5 text-xl font-bold text-text-primary">{formatAmount(2850)}/mo</p>
            <span className="text-[11px] text-emerald-400 font-semibold">Vercel + Neon (18% Savings)</span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Cloud className="h-5 w-5 stroke-[1.75]" />
          </div>
        </Card>

        <Card className="flex items-center justify-between bg-surface-1 p-4 border border-border">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase">12-Month Net ROI</span>
            <p className="mt-1.5 text-xl font-bold text-text-primary">+312.5% Net ROI</p>
            <span className="text-[11px] text-purple-400 font-semibold">Payback: 3.2 Months</span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
            <TrendingUp className="h-5 w-5 stroke-[1.75]" />
          </div>
        </Card>

        <Card className="flex items-center justify-between bg-surface-1 p-4 border border-border">
          <div>
            <span className="text-xs font-semibold text-text-muted uppercase">Active Agent Subscriptions</span>
            <p className="mt-1.5 text-xl font-bold text-text-primary">7 Microservices</p>
            <span className="text-[11px] text-emerald-400 font-semibold">All Microservices Online</span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <Bot className="h-5 w-5 stroke-[1.75]" />
          </div>
        </Card>
      </div>

      {/* SECTION 2: MULTI-CLOUD INFRASTRUCTURE PRICE COMPARATOR MATRIX (AWS, Azure, GCP, Vercel, etc.) */}
      <Card className="p-6 bg-surface-1 space-y-5 border border-border shadow-md">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-accent-primary" />
            <h2 className="text-base font-bold text-text-primary">
              Multi-Cloud Infrastructure Price Comparator Matrix
            </h2>
          </div>
          <Badge variant="outline" className="font-mono text-xs text-emerald-400 border-emerald-500/30">
            6 Hosting Providers Analyzed
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'AWS Cloud (EC2 + RDS + EKS + CloudFront)',
              monthly: 3850,
              annual: 46200,
              badge: 'Enterprise Premium',
              variant: 'outline' as const,
              features: ['Auto-scaling EKS Cluster', 'Multi-AZ PostgreSQL RDS', 'Global CloudFront CDN'],
            },
            {
              name: 'Microsoft Azure (App Services + Azure SQL)',
              monthly: 3720,
              annual: 44640,
              badge: 'Standard',
              variant: 'outline' as const,
              features: ['Azure Kubernetes Service', 'Managed Azure SQL Server', 'Azure Front Door CDN'],
            },
            {
              name: 'Google Cloud Platform (GCP Cloud Run)',
              monthly: 3480,
              annual: 41760,
              badge: 'Standard',
              variant: 'outline' as const,
              features: ['Serverless Cloud Run Containers', 'Managed Cloud SQL Postgres', 'Cloud Armor Security'],
            },
            {
              name: 'Vercel + Neon pgvector + Supabase (Serverless Fleet)',
              monthly: 2850,
              annual: 34200,
              badge: 'Recommended (18% Savings)',
              variant: 'success' as const,
              features: ['Zero Cold-Start Next.js Edge', '768-Dim RRF Vector Search', 'Real-time WebSocket Gateway'],
              highlight: true,
            },
            {
              name: 'DigitalOcean (App Platform + Managed DB)',
              monthly: 3100,
              annual: 37200,
              badge: 'Standard',
              variant: 'outline' as const,
              features: ['Simple Container Deployments', 'Managed PostgreSQL Cluster', 'Spaces Object Storage'],
            },
            {
              name: 'Cloudflare Workers + D1 Vector Store',
              monthly: 2400,
              annual: 28800,
              badge: 'Recommended (18% Savings)',
              variant: 'success' as const,
              features: ['300+ Edge Locations', 'Vectorize Vector Index', 'D1 Serverless SQL'],
            },
          ].map((cloud) => (
            <div
              key={cloud.name}
              className={`p-4 rounded-2xl border transition-luxury flex flex-col justify-between space-y-3 ${
                cloud.highlight
                  ? 'bg-accent-light border-accent-primary shadow-md ring-2 ring-accent-primary/40'
                  : 'bg-surface-2 border-border/80 hover:border-accent-primary/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant={cloud.variant} className="text-[10px] font-mono">
                    {cloud.badge}
                  </Badge>
                  {cloud.highlight && <Sparkles className="h-4 w-4 text-amber-400" />}
                </div>

                <h3 className="font-bold text-xs text-text-primary mt-2">{cloud.name}</h3>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-text-primary">{formatAmount(cloud.monthly)}</span>
                  <span className="text-[11px] text-text-muted">/month</span>
                  <span className="text-[10px] text-text-muted font-mono ml-auto">
                    ({formatAmount(cloud.annual)}/yr)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/40 text-[11px] text-text-secondary">
                {cloud.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* SECTION 3: AGENT FLEET UPGRADE & LICENSING MANAGER */}
      <Card className="p-6 bg-surface-1 space-y-5 border border-border shadow-md">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-text-primary">
              Agent Fleet Upgrade & Licensing Manager
            </h2>
          </div>
          <Badge variant="accent" className="font-mono text-xs">
            7 Microservice Specialist Fleet
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'chief-of-staff', name: '👑 Chief of Staff', role: 'Master AI Orchestrator', tier: 'Enterprise Tier ($150/mo)', desc: '18-Stage SDLC engine, prompt gap analyzer & fleet routing.' },
            { id: 'research-agent', name: '🔬 Research Agent', role: 'Web & Symbol Scraper', tier: 'Pro Tier ($75/mo)', desc: '100% Fact Checking matrix & codebase symbol indexer.' },
            { id: 'planning-agent', name: '📅 Planning Agent', role: 'LangGraph DAG Engine', tier: 'Pro Tier ($75/mo)', desc: 'Task DAG trees, sprint scheduling & 10-stage milestones.' },
            { id: 'review-agent', name: '🛡️ Review Agent', role: 'OWASP & Test Runner', tier: 'Enterprise Tier ($150/mo)', desc: 'OWASP security scanner & 14/14 automated test verification.' },
            { id: 'finance-agent', name: '💰 Finance Agent', role: 'Token & Cloud ROI', tier: 'Pro Tier ($75/mo)', desc: 'Budget velocity, ROI payback timeline & cloud comparator.' },
            { id: 'comm-agent', name: '📧 Communication Agent', role: 'Presentation & Formats', tier: 'Pro Tier ($75/mo)', desc: '9 Audience Profiles & 19 Document Output Formats.' },
            { id: 'memory-agent', name: '🧠 Memory Agent', role: '768-Dim RRF Store', tier: 'Enterprise Tier ($150/mo)', desc: 'Neon pgvector dense embeddings + BM25 keyword RRF.' },
          ].map((agent) => {
            const isUpgraded = upgradedAgents.includes(agent.id);

            return (
              <div
                key={agent.id}
                className="p-4 rounded-2xl border bg-surface-2 border-border/80 flex flex-col justify-between space-y-3 hover:border-accent-primary/60 transition-luxury"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-text-primary">{agent.name}</h3>
                    <Badge variant={isUpgraded ? 'success' : 'outline'} className="text-[10px]">
                      {isUpgraded ? 'Enterprise Active' : 'Pro Plan'}
                    </Badge>
                  </div>
                  <span className="text-[10px] font-mono text-accent-primary font-semibold block mt-0.5">{agent.role}</span>
                  <p className="text-[11px] text-text-secondary mt-1.5 leading-relaxed">{agent.desc}</p>
                </div>

                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-text-muted">{agent.tier}</span>
                  <Button
                    variant={isUpgraded ? 'outline' : 'primary'}
                    size="sm"
                    disabled={isUpgraded}
                    onClick={() => handleUpgradeAgent(agent.id, agent.name)}
                    className="text-xs h-7 px-3"
                  >
                    {isUpgraded ? 'Upgraded' : 'Upgrade Tier'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </main>
  );
};
