import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { Layers, Sparkles, RefreshCw, Cpu, Server, Bot, Shield, Wrench, CheckCircle2 } from 'lucide-react';

export const BudgetPlannerView = ({ estimate, currency = 'USD' }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedPillars, setOptimizedPillars] = useState(null);

  const activeEstimate = estimate || {
    project_name: 'Enterprise AI Agent Operating System',
    total_estimated_cost: 238500,
    monthly_operating_cost: 8450,
    annual_operating_cost: 101400,
    dev_cost: 137100,
    infra_cost: 48000,
    ai_cost: 32400,
    devops_cost: 11200,
    maintenance_cost: 9800,
    cloud_provider: 'AWS',
    expected_users: 50000
  };

  const totalTco = activeEstimate.total_estimated_cost || 1;

  const pillars = optimizedPillars || [
    {
      id: 'pillar-dev',
      name: 'Engineering Development Build',
      icon: Cpu,
      amount: activeEstimate.dev_cost,
      percentage: Math.round((activeEstimate.dev_cost / totalTco) * 100 * 10) / 10,
      badge: 'Build Phase',
      color: 'emerald',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      barColor: 'bg-emerald-500',
      items: [
        { name: 'Frontend React/Tailwind Interface', cost: Math.round(activeEstimate.dev_cost * 0.28) },
        { name: 'Backend FastAPI Microservices', cost: Math.round(activeEstimate.dev_cost * 0.38) },
        { name: 'Database Schemas & Alembic Migrations', cost: Math.round(activeEstimate.dev_cost * 0.16) },
        { name: 'OAuth2 / JWT Authentication & RBAC', cost: Math.round(activeEstimate.dev_cost * 0.18) },
      ],
      description: 'Upfront core engineering implementation, frontend UI design, backend business logic, and API schemas.'
    },
    {
      id: 'pillar-infra',
      name: 'Cloud Infrastructure & DB Hosting',
      icon: Server,
      amount: activeEstimate.infra_cost,
      percentage: Math.round((activeEstimate.infra_cost / totalTco) * 100 * 10) / 10,
      badge: `${activeEstimate.cloud_provider || 'AWS'} Run-Rate`,
      color: 'indigo',
      borderColor: 'border-indigo-500/30',
      textColor: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      barColor: 'bg-indigo-500',
      items: [
        { name: 'Managed Kubernetes / Container Cluster', cost: Math.round(activeEstimate.infra_cost * 0.45) },
        { name: 'PostgreSQL / Aurora Relational Database', cost: Math.round(activeEstimate.infra_cost * 0.30) },
        { name: 'Object Storage & Cloudflare CDN Egress', cost: Math.round(activeEstimate.infra_cost * 0.15) },
        { name: 'Datadog / Prometheus Monitoring', cost: Math.round(activeEstimate.infra_cost * 0.10) },
      ],
      description: 'Annual production cloud compute, database cluster hosting, storage buckets, and egress bandwidth.'
    },
    {
      id: 'pillar-ai',
      name: 'AI LLM Tokens & Vector Services',
      icon: Bot,
      amount: activeEstimate.ai_cost,
      percentage: Math.round((activeEstimate.ai_cost / totalTco) * 100 * 10) / 10,
      badge: 'AI Engine',
      color: 'violet',
      borderColor: 'border-violet-500/30',
      textColor: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      barColor: 'bg-violet-500',
      items: [
        { name: 'OpenAI / Claude LLM Inference Tokens', cost: Math.round(activeEstimate.ai_cost * 0.70) },
        { name: 'pgvector / Pinecone Vector Embedding DB', cost: Math.round(activeEstimate.ai_cost * 0.20) },
        { name: 'Document Parsing & OCR Pipeline', cost: Math.round(activeEstimate.ai_cost * 0.10) },
      ],
      description: 'API token consumption, semantic search embeddings, vector retrieval indexing, and prompt caching.'
    },
    {
      id: 'pillar-devops',
      name: 'DevOps, Security & QA Testing',
      icon: Shield,
      amount: activeEstimate.devops_cost,
      percentage: Math.round((activeEstimate.devops_cost / totalTco) * 100 * 10) / 10,
      badge: 'Security & QA',
      color: 'cyan',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      barColor: 'bg-cyan-500',
      items: [
        { name: 'Automated Playwright E2E Test Suite', cost: Math.round(activeEstimate.devops_cost * 0.55) },
        { name: 'GitHub Actions CI/CD Pipeline Runners', cost: Math.round(activeEstimate.devops_cost * 0.25) },
        { name: 'SOC2 / HIPAA Security Compliance Scan', cost: Math.round(activeEstimate.devops_cost * 0.20) },
      ],
      description: 'Continuous integration pipelines, automated end-to-end regression tests, and security audits.'
    },
    {
      id: 'pillar-maint',
      name: 'Software Maintenance & Support',
      icon: Wrench,
      amount: activeEstimate.maintenance_cost,
      percentage: Math.round((activeEstimate.maintenance_cost / totalTco) * 100 * 10) / 10,
      badge: 'Annual SLA',
      color: 'amber',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      barColor: 'bg-amber-500',
      items: [
        { name: 'Bi-Weekly Dependabot & Vulnerability Patches', cost: Math.round(activeEstimate.maintenance_cost * 0.50) },
        { name: 'Bug Fixes & Operational Escalations', cost: Math.round(activeEstimate.maintenance_cost * 0.35) },
        { name: 'SDK & Dependency Version Upgrades', cost: Math.round(activeEstimate.maintenance_cost * 0.15) },
      ],
      description: 'Ongoing code maintenance, dependency updates, security vulnerability fixes, and uptime support.'
    }
  ];

  const handleAiOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setOptimizedPillars(
        pillars.map((p) => {
          if (p.id === 'pillar-infra') return { ...p, amount: Math.round(p.amount * 0.88), percentage: Math.round((p.amount * 0.88 / totalTco) * 100 * 10) / 10 };
          if (p.id === 'pillar-ai') return { ...p, amount: Math.round(p.amount * 0.82), percentage: Math.round((p.amount * 0.82 / totalTco) * 100 * 10) / 10 };
          return p;
        })
      );
      setIsOptimizing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Active Project Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Project Financial Architecture
            </span>
            <h2 className="text-lg font-bold text-slate-100">{activeEstimate.project_name}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Total 1-Year TCO: <strong className="text-emerald-400 font-mono">{formatCurrency(activeEstimate.total_estimated_cost, currency)}</strong> • {activeEstimate.expected_users?.toLocaleString()} Users
          </p>
        </div>

        <button
          onClick={handleAiOptimize}
          disabled={isOptimizing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all shrink-0"
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AI Optimizing Budget...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>AI Auto-Optimize Budget</span>
            </>
          )}
        </button>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Project 1-Year TCO</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">{formatCurrency(activeEstimate.total_estimated_cost, currency)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Sum of all 5 financial pillars</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Monthly Operating Run-Rate</span>
          <div className="text-2xl font-extrabold text-slate-100 mt-1 font-mono">{formatCurrency(activeEstimate.monthly_operating_cost, currency)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Cloud + AI + Maintenance / month</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">Annual Operating Run-Rate</span>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1 font-mono">{formatCurrency(activeEstimate.annual_operating_cost, currency)}</div>
          <p className="text-[11px] text-slate-400 mt-1">Recurring annual cloud & AI costs</p>
        </div>
      </div>

      {/* PROMINENT FINANCIAL COST PILLARS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wide">Financial Cost Pillars</h3>
              <p className="text-xs text-slate-400">Complete enterprise budget distribution across 5 core software cost pillars</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono font-bold">
            5 Core Cost Pillars
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((pillar) => {
            const IconComp = pillar.icon;

            return (
              <div
                key={pillar.id}
                className={`glass-panel p-6 rounded-2xl border ${pillar.borderColor} ${pillar.bgColor} space-y-4 hover:border-slate-600 transition-all flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-xl bg-slate-950/80 border ${pillar.borderColor}`}>
                        <IconComp className={`w-5 h-5 ${pillar.textColor}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-100">{pillar.name}</h4>
                        <span className="text-[10px] text-slate-400">{pillar.badge}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${pillar.borderColor} ${pillar.textColor}`}>
                      {pillar.percentage}%
                    </span>
                  </div>

                  <div className="pt-2 pb-1 border-t border-slate-800/80">
                    <div className="text-xs text-slate-400 font-medium">Estimated Pillar Budget</div>
                    <div className={`text-3xl font-extrabold ${pillar.textColor} font-mono tracking-tight mt-0.5`}>
                      {formatCurrency(pillar.amount, currency)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className={`${pillar.barColor} h-full rounded-full`} style={{ width: `${Math.min(pillar.percentage * 2, 100)}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right font-mono">{pillar.percentage}% of Total TCO</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">{pillar.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Itemized Line Items</span>
                  <div className="space-y-1.5">
                    {pillar.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-900">
                        <span className="text-slate-300 text-[11px] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          {item.name}
                        </span>
                        <span className="font-mono font-bold text-slate-200 text-[11px] shrink-0 ml-2">
                          {formatCurrency(item.cost, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
