import React, { useState } from 'react';
import { financeApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { Sparkles, Calculator, ShieldCheck } from 'lucide-react';

const TEMPLATES = [
  {
    name: 'SaaS AI Platform',
    icon: '🤖',
    inputs: {
      projectName: 'Enterprise AI Agent Workspace',
      projectDescription: 'Autonomous AI co-workers with document RAG search, vector indexing, and automated workflows.',
      projectType: 'SaaS Platform',
      industry: 'Enterprise Software',
      expectedUsers: 50000,
      expectedTimelineMonths: 6,
      technologyStack: ['React', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
      features: ['Multi-tenant Auth', 'Vector Search', 'AI Workflows', 'Dashboard Analytics', 'API Keys'],
      authType: 'OAuth2 + JWT + RBAC',
      paymentGateway: 'Stripe',
      cloudProvider: 'AWS',
      databaseType: 'PostgreSQL + pgvector',
      aiFeatures: ['RAG Search', 'Document Embeddings', 'LLM Summarization'],
      deploymentPreference: 'Kubernetes (EKS)',
      securityRequirements: 'SOC2 Type II + GDPR',
      scalabilityRequirements: 'High (Auto-scaling)',
      integrations: ['SendGrid', 'HubSpot', 'Slack', 'Zapier']
    }
  },
  {
    name: 'E-Commerce Enterprise',
    icon: '🛒',
    inputs: {
      projectName: 'Global Omnichannel Marketplace',
      projectDescription: 'High-scale multi-vendor marketplace with inventory syncing, live streaming, and multi-currency checkout.',
      projectType: 'E-Commerce Enterprise',
      industry: 'Retail & E-Commerce',
      expectedUsers: 250000,
      expectedTimelineMonths: 8,
      technologyStack: ['Next.js', 'Node.js', 'MongoDB Atlas', 'Redis', 'Kubernetes'],
      features: ['Product Catalog', 'Shopping Cart', 'Multi-currency Checkout', 'Vendor Portal', 'Order Tracking'],
      authType: 'Auth0 + Social Login',
      paymentGateway: 'Stripe + PayPal + Klarna',
      cloudProvider: 'GCP',
      databaseType: 'MongoDB Atlas + Redis',
      aiFeatures: ['Personalized Recommendations', 'Visual Product Search'],
      deploymentPreference: 'Google Cloud Run',
      securityRequirements: 'PCI-DSS Level 1 + SSL',
      scalabilityRequirements: 'Ultra-High (Peak Load Spikes)',
      integrations: ['ShipStation', 'Salesforce', 'Klaviyo']
    }
  },
  {
    name: 'Healthcare Mobile App',
    icon: '🏥',
    inputs: {
      projectName: 'Telehealth Patient Portal',
      projectDescription: 'HIPAA-compliant telehealth app featuring video consultations, EHR integration, and prescriptions.',
      projectType: 'Mobile & Web App',
      industry: 'Healthcare & Life Sciences',
      expectedUsers: 30000,
      expectedTimelineMonths: 7,
      technologyStack: ['React Native', 'FastAPI', 'PostgreSQL', 'Twilio WebRTC'],
      features: ['HD Video Call', 'Patient EHR Sync', 'Doctor Scheduling', 'Prescription Management', 'Secure Messaging'],
      authType: 'Biometric + OAuth2 + MFA',
      paymentGateway: 'Stripe Healthcare',
      cloudProvider: 'AWS (HIPAA Compliant)',
      databaseType: 'PostgreSQL (Encrypted)',
      aiFeatures: ['Symptom Checker Chatbot', 'OCR Medical Records'],
      deploymentPreference: 'AWS ECS Fargate',
      securityRequirements: 'HIPAA + SOC2 + End-to-End Encryption',
      scalabilityRequirements: 'Medium (High Reliability)',
      integrations: ['Epic EHR', 'Cerner', 'Twilio']
    }
  },
  {
    name: 'FinTech API Gateway',
    icon: '💳',
    inputs: {
      projectName: 'Neobank Open Banking API',
      projectDescription: 'Low-latency core banking API handling ACH transfers, fraud detection, and virtual card issuance.',
      projectType: 'FinTech API Gateway',
      industry: 'FinTech & Banking',
      expectedUsers: 100000,
      expectedTimelineMonths: 9,
      technologyStack: ['Go', 'FastAPI', 'PostgreSQL', 'Kafka', 'Redis'],
      features: ['ACH Transfers', 'Virtual Cards', 'Real-time Fraud Alerting', 'Transaction Ledger', 'Developer Portal'],
      authType: 'OAuth2 + mTLS + API Keys',
      paymentGateway: 'Plaid + Stripe Treasury',
      cloudProvider: 'AWS',
      databaseType: 'PostgreSQL + CockroachDB',
      aiFeatures: ['AI Transaction Categorization', 'Anomaly Fraud Detection'],
      deploymentPreference: 'Kubernetes on-prem + AWS',
      securityRequirements: 'SOC2 + PCI-DSS + ISO 27001',
      scalabilityRequirements: 'Ultra-High (99.999% SLA)',
      integrations: ['Plaid', 'Alloy', 'Persona', 'Unit']
    }
  }
];

export const CostEstimatorView = ({
  currentEstimate,
  onEstimateGenerated,
  currency = 'USD',
}) => {
  const [formInputs, setFormInputs] = useState(TEMPLATES[0].inputs);
  const [loading, setLoading] = useState(false);
  const [activeEstimate, setActiveEstimate] = useState(currentEstimate);

  const handleSelectTemplate = (templateInputs) => {
    setFormInputs(templateInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await financeApi.generateEstimate(formInputs);
      setActiveEstimate(result);
      if (onEstimateGenerated) onEstimateGenerated(result);
    } catch (err) {
      console.error('Failed to generate estimate:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Quick Selection */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Start Templates</h3>
          <span className="text-[11px] text-slate-400">Select pre-configured enterprise architecture presets</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectTemplate(tmpl.inputs)}
              className={`p-3 rounded-xl border text-left transition-all ${
                formInputs.projectName === tmpl.inputs.projectName
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xl mb-1">{tmpl.icon}</div>
              <div className="text-xs font-bold text-slate-100">{tmpl.name}</div>
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{tmpl.inputs.projectDescription}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">Software Project Parameters</h3>
            </div>
            <span className="text-[11px] text-slate-400">AI Financial Architect Input Suite</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
              <input
                type="text"
                value={formInputs.projectName}
                onChange={(e) => setFormInputs({ ...formInputs, projectName: e.target.value })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Project Type</label>
              <select
                value={formInputs.projectType}
                onChange={(e) => setFormInputs({ ...formInputs, projectType: e.target.value })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="SaaS Platform">SaaS Platform</option>
                <option value="Mobile & Web App">Mobile & Web App</option>
                <option value="E-Commerce Enterprise">E-Commerce Enterprise</option>
                <option value="FinTech API Gateway">FinTech API Gateway</option>
                <option value="Internal AI Tool">Internal AI Tool</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description</label>
            <textarea
              rows={2}
              value={formInputs.projectDescription}
              onChange={(e) => setFormInputs({ ...formInputs, projectDescription: e.target.value })}
              className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Industry</label>
              <input
                type="text"
                value={formInputs.industry}
                onChange={(e) => setFormInputs({ ...formInputs, industry: e.target.value })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Monthly Active Users</label>
              <input
                type="number"
                value={formInputs.expectedUsers}
                onChange={(e) => setFormInputs({ ...formInputs, expectedUsers: Number(e.target.value) })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Timeline (Months)</label>
              <input
                type="number"
                value={formInputs.expectedTimelineMonths}
                onChange={(e) => setFormInputs({ ...formInputs, expectedTimelineMonths: Number(e.target.value) })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cloud Provider Preference</label>
              <select
                value={formInputs.cloudProvider}
                onChange={(e) => setFormInputs({ ...formInputs, cloudProvider: e.target.value })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="AWS">AWS (Amazon Web Services)</option>
                <option value="GCP">Google Cloud Platform (GCP)</option>
                <option value="Azure">Microsoft Azure</option>
                <option value="DigitalOcean">DigitalOcean</option>
                <option value="Vercel + Supabase">Vercel + Supabase Stack</option>
                <option value="Neon + Railway">Neon + Railway Stack</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Gateway</label>
              <select
                value={formInputs.paymentGateway}
                onChange={(e) => setFormInputs({ ...formInputs, paymentGateway: e.target.value })}
                className="w-full bg-slate-950/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Stripe">Stripe</option>
                <option value="PayPal">PayPal</option>
                <option value="Adyen">Adyen</option>
                <option value="None">None / Internal Billing</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating AI Financial Architecture...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Estimate Complete Project Financials</span>
              </>
            )}
          </button>
        </form>

        {/* Total Cost Estimation Result Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">AI ESTIMATE RESULT</span>
                <h3 className="text-base font-bold text-slate-100">{activeEstimate.project_name}</h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{activeEstimate.confidence_score}% Confidence</span>
              </div>
            </div>

            {/* Main Total Cost Box */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 shadow-xl shadow-emerald-500/10">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">TOTAL ESTIMATED PROJECT COST</span>
              <div className="text-4xl font-extrabold text-emerald-400 tracking-tight mt-2 font-mono">
                {formatCurrency(activeEstimate.total_estimated_cost, currency)}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300 mt-4 pt-3 border-t border-slate-800/80">
                <span>Monthly Run-Rate: <strong className="text-emerald-400 font-mono">{formatCurrency(activeEstimate.monthly_operating_cost, currency)}</strong></span>
                <span>Annual Run-Rate: <strong className="text-emerald-400 font-mono">{formatCurrency(activeEstimate.annual_operating_cost, currency)}</strong></span>
              </div>
            </div>

            {/* AI Reasoning Summary */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-2">
              <span className="font-bold text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Financial Rationale Summary
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">{activeEstimate.reasoning}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
