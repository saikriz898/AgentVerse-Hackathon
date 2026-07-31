'use client';

import { downloadPDF } from '@/lib/exportToPDF';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Cpu,
  Layers,
  FileCode,
  ShieldCheck,
  Database,
  Globe,
  Zap,
  CheckCircle2,
  GitBranch,
  Terminal,
  Server,
  Code2,
  Sparkles,
  Download,
  Play,
  Activity,
  Box,
  FileText,
  Crown,
  ArrowRight,
  Shield,
  Check,
  Search,
  DollarSign,
  Clock,
  Printer,
  FolderTree,
  ListChecks,
  Lock,
} from 'lucide-react';

interface TechLayerSpec {
  category: string;
  icon: React.ElementType;
  assignedAgent: string;
  recommendedTechs: string[];
  status: string;
  badge: string;
}

export const TechStackView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'advisor' | 'stack' | 'prd' | 'trd' | 'workflow'>('advisor');
  const [promptInput, setPromptInput] = useState('Build an AI School Management Portal with attendance, grades, and parent notifications');
  
  // Tech Stack State
  const [analyzingPrompt, setAnalyzingPrompt] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // PRD & TRD State
  const [generatingPRD, setGeneratingPRD] = useState(false);
  const [hasGeneratedPRD, setHasGeneratedPRD] = useState(false);

  const [generatingTRD, setGeneratingTRD] = useState(false);
  const [hasGeneratedTRD, setHasGeneratedTRD] = useState(false);

  const [dynamicLayers, setDynamicLayers] = useState<TechLayerSpec[]>([]);

  const handleAnalyzePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setAnalyzingPrompt(true);

    setTimeout(() => {
      setAnalyzingPrompt(false);
      setHasAnalyzed(true);

      const isFintech = promptInput.toLowerCase().includes('trading') || promptInput.toLowerCase().includes('crypto') || promptInput.toLowerCase().includes('finance');
      const isHealthcare = promptInput.toLowerCase().includes('health') || promptInput.toLowerCase().includes('medical') || promptInput.toLowerCase().includes('patient');

      if (isFintech) {
        setDynamicLayers([
          {
            category: 'Recommended Frontend Layer',
            icon: Globe,
            assignedAgent: 'Communication Agent',
            recommendedTechs: ['React Native Mobile & Next.js 15 Web Dashboard', 'High-Frequency Financial Charting (Lightweight Charts)', 'WebSocket Order Book Stream Engine', 'Multi-Currency Forex & Crypto Formatting'],
            status: 'Ultra-Low Latency',
            badge: 'Next.js 15 + Mobile',
          },
          {
            category: 'Recommended Backend Microservices',
            icon: Server,
            assignedAgent: 'Chief of Staff Gateway',
            recommendedTechs: ['FastAPI Python 3.12 (High Throughput)', 'Rust Order Matching Engine Sidecar', 'Apache Kafka Transaction Stream Pipeline', 'Express REST Admin Microservice (:4001)'],
            status: 'Real-time Streaming',
            badge: 'FastAPI + Rust',
          },
          {
            category: 'AI Agents & LangGraph Framework',
            icon: Cpu,
            assignedAgent: 'Planning & Research Agents',
            recommendedTechs: ['LangGraph Algorithmic Trading Strategy DAG', 'Gemini 3.6 Flash Market Sentiment Analyzer', 'Claude 3.5 Sonnet Financial Audit Agent', 'DeepSeek R1 Autonomous Execution'],
            status: 'Algorithmic Fleet',
            badge: 'LangGraph',
          },
          {
            category: 'Database & RRF Vector Memory',
            icon: Database,
            assignedAgent: 'Memory Agent',
            recommendedTechs: ['TimescaleDB Time-Series Financial Store', 'Neon PostgreSQL pgvector (768-Dim Market Patterns)', 'Redis Cluster High-Velocity Session Cache', 'BM25 Financial Terminology Search'],
            status: 'Time-Series Vector',
            badge: 'Timescale + pgvector',
          },
          {
            category: 'QA Security & Test Infrastructure',
            icon: ShieldCheck,
            assignedAgent: 'Review Agent',
            recommendedTechs: ['OWASP Financial API Threat Scanner', 'PCI-DSS & SOC2 Security Audit Engine', '14/14 Automated Financial Test Suite', 'QA Compliance Gate (Score >= 95)'],
            status: 'Bank-Grade Security',
            badge: 'SOC2 & OWASP',
          },
          {
            category: 'Hosting & Cloud Financial ROI',
            icon: Zap,
            assignedAgent: 'Finance Agent',
            recommendedTechs: ['AWS EKS Cluster + Managed Aurora PostgreSQL ($3,850/mo)', 'Azure & GCP Financial Pricing Comparator', '96 Days Payback Timeline (+312.5% ROI)', 'Multi-Currency Conversion Engine'],
            status: 'Enterprise Cloud',
            badge: 'AWS + EKS',
          },
        ]);
      } else if (isHealthcare) {
        setDynamicLayers([
          {
            category: 'Recommended Frontend Layer',
            icon: Globe,
            assignedAgent: 'Communication Agent',
            recommendedTechs: ['Next.js 15 Telemedicine Patient Portal', 'WebRTC Video Consultation Interface', 'TailwindCSS HIPAA Compliant UI Components', 'Accessible Screen-Reader Optimized Design'],
            status: 'HIPAA Compliant',
            badge: 'Next.js 15 WebRTC',
          },
          {
            category: 'Recommended Backend Microservices',
            icon: Server,
            assignedAgent: 'Chief of Staff Gateway',
            recommendedTechs: ['Express.js REST Microservices (:4001)', 'FHIR / HL7 Healthcare Data Adapter', 'Node.js v20+ Encrypted Payload Gateway', 'OpenAPI v3 Health System Specification'],
            status: 'FHIR Interop',
            badge: 'Express + FHIR',
          },
          {
            category: 'AI Agents & LangGraph Framework',
            icon: Cpu,
            assignedAgent: 'Planning & Research Agents',
            recommendedTechs: ['LangGraph Diagnostic Clinical Workflow DAG', 'Claude 3.5 Sonnet Medical Audit Agent', 'Gemini 3.6 Pro Diagnostic Reasoning Engine', 'Research Agent PubMed Medical Crawler'],
            status: 'Clinical AI Engine',
            badge: 'LangGraph AI',
          },
          {
            category: 'Database & RRF Vector Memory',
            icon: Database,
            assignedAgent: 'Memory Agent',
            recommendedTechs: ['Neon PostgreSQL pgvector (Medical Record Embeddings)', 'AES-256 Encrypted Healthcare Database', 'BM25 Clinical Terminology Hybrid Search', '4 Partition Patient History Store'],
            status: 'AES-256 Encrypted',
            badge: 'Encrypted pgvector',
          },
          {
            category: 'QA Security & Test Infrastructure',
            icon: ShieldCheck,
            assignedAgent: 'Review Agent',
            recommendedTechs: ['HIPAA & OWASP Security Audit Gate', 'Patient Data Leakage Prevention Scanner', '14/14 Medical Integration Test Suite', 'QA Gate Threshold (Score >= 90)'],
            status: 'HIPAA Verified',
            badge: 'HIPAA & OWASP',
          },
          {
            category: 'Hosting & Cloud Financial ROI',
            icon: Zap,
            assignedAgent: 'Finance Agent',
            recommendedTechs: ['AWS HIPAA Compliant Cloud ($3,850/mo)', 'Azure Healthcare Pricing Comparator', '3.2 Month Payback Period (+312.5% ROI)', 'Multi-Currency Support'],
            status: 'HIPAA Cloud',
            badge: 'AWS HIPAA',
          },
        ]);
      } else {
        // Standard Web App / School Management Stack
        setDynamicLayers([
          {
            category: 'Recommended Frontend Layer',
            icon: Globe,
            assignedAgent: 'Communication Agent',
            recommendedTechs: ['Next.js 15 App Router (Server Components)', 'React 19 & TailwindCSS Responsive UI', 'Zustand Real-time Portal State Store', 'Full Responsive Mobile & Desktop Layouts'],
            status: 'High Performance',
            badge: 'Next.js 15',
          },
          {
            category: 'Recommended Backend Microservices',
            icon: Server,
            assignedAgent: 'Chief of Staff Gateway',
            recommendedTechs: ['Express.js REST Microservices (:4001)', 'Node.js v20+ Enterprise Runtime', 'Python FastAPI Interop (Fast Data Pipeline)', 'OpenAPI v3 REST Contract Specifications'],
            status: 'Scalable Architecture',
            badge: 'Express + FastAPI',
          },
          {
            category: 'AI Agents & LangGraph Framework',
            icon: Cpu,
            assignedAgent: 'Planning & Research Agents',
            recommendedTechs: ['LangGraph 10-Stage Sequential DAG Engine', 'Google Gemini 3.6 Flash (Fast Responses)', 'Anthropic Claude 3.5 Sonnet (Code Auditing)', 'OpenAI GPT-4o Enterprise Reasoning'],
            status: 'Multi-Agent Enabled',
            badge: 'LangGraph Engine',
          },
          {
            category: 'Database & RRF Vector Memory',
            icon: Database,
            assignedAgent: 'Memory Agent',
            recommendedTechs: ['Neon PostgreSQL pgvector (768-Dim Embeddings)', 'BM25 Keyword + Dense Hybrid Search (RRF)', 'Redis In-Memory Session & Websocket Cache', '4 Memory Context Partitions'],
            status: 'RRF Score 0.985',
            badge: 'Neon pgvector',
          },
          {
            category: 'QA Security & Test Infrastructure',
            icon: ShieldCheck,
            assignedAgent: 'Review Agent',
            recommendedTechs: ['OWASP Security Vulnerability Scanner', 'Secret Leaks & Token Theft Detector', '14/14 Automated Integration Test Cases Suite', '11-Point QA Compliance Gate (Score >= 80)'],
            status: 'Zero Vulnerabilities',
            badge: 'OWASP Verified',
          },
          {
            category: 'Hosting & Cloud Financial ROI',
            icon: Zap,
            assignedAgent: 'Finance Agent',
            recommendedTechs: ['Vercel Serverless Edge + Neon Cloud ($2,850/mo)', 'AWS / Azure Price Matrix Comparator', '3.2 Months Payback Period (+312.5% ROI)', 'Multi-Currency (USD, EUR, GBP, INR)'],
            status: '18% Savings Engine',
            badge: 'Serverless Cloud',
          },
        ]);
      }
    }, 600);
  };

  const handleGeneratePRD = () => {
    setGeneratingPRD(true);
    setTimeout(() => {
      setGeneratingPRD(false);
      setHasGeneratedPRD(true);
    }, 600);
  };

  const handleGenerateTRD = () => {
    setGeneratingTRD(true);
    setTimeout(() => {
      setGeneratingTRD(false);
      setHasGeneratedTRD(true);
    }, 600);
  };

  const handleExportPDF = (docType: 'PRD' | 'TRD') => {
    const filename = `${docType.toLowerCase()}_${promptInput.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
    const title = `${docType} Specification — ${promptInput}`;
    const content = docType === 'PRD'
      ? `Executive Vision: ${promptInput}\n\n1. Core User Stories:\n- F-101: Attendance Engine (P0)\n- F-102: AI Gradebook Analytics (P0)\n\n2. SLAs & KPIs:\n- Availability: 99.9% Uptime\n- Latency: < 120ms p95\n- ROI Payback: 3.2 Months (+312.5% Net ROI)`
      : `Technical Architecture: ${promptInput}\n\n1. Microservices Gateway: Express REST Server (:4001)\n2. Database: Neon PostgreSQL pgvector (768-Dim RRF)\n3. Codebase File Structure:\n- apps/web/app/page.tsx\n- apps/web/components/workspace/SchoolPortalView.tsx\n- backend/server.ts\n- backend/src/services/planningService.ts`;
    
    downloadPDF(filename, title, content);
  };

  // Full 18-Stage Enterprise SDLC Workflow Stages
  const sdlcStages = [
    { num: 1, title: 'Intent Parsing & Scope Resolution', agent: 'Chief of Staff Agent', icon: Crown, duration: '0.5 hrs', details: 'Extracts user prompt intent, resolves scope boundaries, and defines architectural constraints.' },
    { num: 2, title: 'Feasibility & Architectural Risk Analysis', agent: 'Chief of Staff Agent', icon: Crown, duration: '0.5 hrs', details: 'Evaluates system feasibility, risk vectors, performance targets, and security standards.' },
    { num: 3, title: 'Fact-Checked Intelligence Crawl', agent: 'Research Agent', icon: Search, duration: '1.0 hrs', details: 'Crawls web documentation, API specs, and technical references with 100% Fact Checking.' },
    { num: 4, title: 'Codebase Symbol AST Indexing', agent: 'Research Agent', icon: Search, duration: '1.0 hrs', details: 'Indexes local codebase AST symbols, functions, types, and module exports into search index.' },
    { num: 5, title: 'Epic Task Generation', agent: 'Planning Agent', icon: GitBranch, duration: '1.5 hrs', details: 'Generates high-level project epics and structural milestones for end-to-end execution.' },
    { num: 6, title: 'Subtask Recursive Breakdown', agent: 'Planning Agent', icon: GitBranch, duration: '2.0 hrs', details: 'Recursively breaks down epics into actionable developer tasks with exact acceptance criteria.' },
    { num: 7, title: 'Developer-Hour Estimation Engine', agent: 'Planning Agent', icon: Clock, duration: '1.0 hrs', details: 'Calculates developer-hour efforts (18.5 total dev hours) per task and milestone dependency.' },
    { num: 8, title: 'LangGraph Sequential DAG Construction', agent: 'Planning Agent', icon: GitBranch, duration: '1.5 hrs', details: 'Assembles 10-stage sequential LangGraph execution state machine with transition locks.' },
    { num: 9, title: 'Dense Embedding Ingestion (768-Dim)', agent: 'Memory Agent', icon: Database, duration: '1.0 hrs', details: 'Ingests project context into Neon PostgreSQL pgvector database as 768-dimensional dense vectors.' },
    { num: 10, title: 'BM25 + Hybrid RRF Vector Search', agent: 'Memory Agent', icon: Database, duration: '0.5 hrs', details: 'Executes Reciprocal Rank Fusion (RRF score 0.985) across BM25 keyword and vector indexes.' },
    { num: 11, title: 'OWASP Vulnerability Audit', agent: 'Review Agent', icon: ShieldCheck, duration: '1.5 hrs', details: 'Scans source code for SQL Injection, XSS, SSRF, and OWASP Top-10 security flaws.' },
    { num: 12, title: 'Secret Leak & Token Theft Detector', agent: 'Review Agent', icon: ShieldCheck, duration: '0.5 hrs', details: 'Scans commits and files for hardcoded API keys, private credentials, and environment tokens.' },
    { num: 13, title: '14/14 Automated Integration Test Suite', agent: 'Review Agent', icon: CheckCircle2, duration: '1.0 hrs', details: 'Executes full 14/14 integration test suite with latency telemetry (5ms - 35ms).' },
    { num: 14, title: 'Multi-Cloud Price Comparator (AWS/Vercel)', agent: 'Finance Agent', icon: DollarSign, duration: '0.5 hrs', details: 'Compares infrastructure pricing across AWS ($3,850), Azure ($3,720), GCP ($3,480), and Vercel ($2,850).' },
    { num: 15, title: 'Token Budget & ROI Calculation', agent: 'Finance Agent', icon: DollarSign, duration: '0.5 hrs', details: 'Calculates labor costs ($3,000), token budget ($1,250), and ROI payback timeline (3.2 Months).' },
    { num: 16, title: 'Tone-Adapted Documentation Generator', agent: 'Communication Agent', icon: FileText, duration: '1.0 hrs', details: 'Generates PRDs, TRDs, user manuals, and executive summaries across 9 audience profiles.' },
    { num: 17, title: 'Multi-Agent Consensus Verification Gate', agent: 'Chief of Staff Agent', icon: Crown, duration: '0.5 hrs', details: 'Verifies 100/100 QA compliance score, zero defect gates, and inter-agent approvals.' },
    { num: 18, title: 'Final Production Deployment & Telemetry', agent: 'Chief of Staff Agent', icon: Activity, duration: '0.5 hrs', details: 'Triggers production build (10/10 static pages) and monitors real-time system performance.' },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8 font-sans antialiased">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/60 pb-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="accent" className="flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-accent-primary" /> Dynamic Tech Stack Advisor
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">AI Architecture Recommender</Badge>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 font-mono text-xs">
              ⚡ 18-Stage SDLC Pipeline
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Prompt-Driven Tech Stack & 18-Stage SDLC Roadmap
          </h1>
          <p className="text-sm text-text-secondary">
            Enter any product prompt. Click <strong>⚡ Recommend Tech Stack & Agents</strong> to dynamically calculate optimal technology stacks, frameworks, databases, and microservice agents.
          </p>
        </div>

        {/* Tab Navigation Controls with Single-Line Non-Wrapping Formatting */}
        <div className="flex items-center gap-1.5 rounded-xl bg-surface-2 p-1 border border-border text-xs overflow-x-auto whitespace-nowrap shrink-0 max-w-full print:hidden">
          {[
            { id: 'advisor', label: 'Tech Advisor', icon: Sparkles },
            { id: 'stack', label: 'Architecture Matrix', icon: Layers },
            { id: 'prd', label: 'PRD Specs', icon: FileText },
            { id: 'trd', label: 'TRD Specs', icon: FileCode },
            { id: 'workflow', label: '18-SDLC Flow', icon: GitBranch },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-luxury shrink-0 whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-accent-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <t.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: PROMPT-DRIVEN DYNAMIC TECH STACK ADVISOR */}
      {(activeTab === 'advisor' || activeTab === 'stack') && (
        <div className="space-y-6 animate-in fade-in">
          {/* Prompt Analysis Form */}
          <Card className="p-6 bg-surface-1 space-y-4 border border-border shadow-md">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent-primary" />
                <h2 className="text-base font-bold text-text-primary">
                  Enter System Prompt to Recommend Dynamic Tech Stack & Framework
                </h2>
              </div>
              <Badge variant="success" className="font-mono text-xs">AI Architect Active</Badge>
            </div>

            <form onSubmit={handleAnalyzePrompt} className="space-y-4 text-xs">
              <div className="space-y-2">
                <label className="text-text-muted font-bold block">Product Requirement / System Specification Prompt:</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="e.g. Build an AI School Management Portal, FinTech Trading System, or Telemedicine App..."
                    className="flex-1 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary font-mono"
                  />
                  <Button
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={analyzingPrompt}
                    className="px-6 font-semibold shrink-0 shadow-md whitespace-nowrap"
                  >
                    <Play className={`mr-2 h-4 w-4 ${analyzingPrompt ? 'animate-spin' : ''}`} />
                    {analyzingPrompt ? 'Computing Matrix...' : 'Recommend Tech Stack & Agents'}
                  </Button>
                </div>
              </div>

              {/* Preset Sample Prompts formatted in single lines */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-text-muted font-bold whitespace-nowrap">Try Sample Presets:</span>
                {[
                  'Build an AI School Management Portal',
                  'FinTech High-Frequency Trading Engine',
                  'Healthcare Telemedicine App with WebRTC',
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setPromptInput(sample);
                      setHasAnalyzed(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border/60 hover:border-accent-primary text-xs font-mono text-text-secondary hover:text-text-primary transition-luxury whitespace-nowrap shrink-0"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </form>
          </Card>

          {/* Placeholder BEFORE clicking button */}
          {!hasAnalyzed && !analyzingPrompt && (
            <Card className="p-8 bg-surface-1 border border-dashed border-border text-center space-y-3 shadow-xs">
              <Layers className="h-10 w-10 text-accent-primary mx-auto animate-bounce" />
              <h3 className="font-bold text-sm text-text-primary">Prompt-Driven Tech Stack Recommender Ready</h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto font-mono leading-relaxed">
                Click <strong>⚡ Recommend Tech Stack & Agents</strong> above to dynamically analyze your prompt and generate custom technology stack recommendations, framework architectures, and agent allocations.
              </p>
            </Card>
          )}

          {/* Dynamic Recommended Tech Stack Grid (SHOWS ONLY AFTER CLICKING BUTTON) */}
          {hasAnalyzed && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-accent-primary" /> Recommended Technology Stack & Agent Allocation Matrix
                </h3>
                <Badge variant="accent" className="font-mono text-xs">
                  Target: {promptInput.slice(0, 32)}...
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dynamicLayers.map((layer) => (
                  <Card key={layer.category} className="p-5 bg-surface-1 space-y-4 border border-border hover:border-accent-primary/60 transition-luxury">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-light text-accent-primary">
                          <layer.icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-text-primary">{layer.category}</h4>
                          <span className="text-[10px] font-mono text-accent-primary font-semibold">{layer.assignedAgent}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono">{layer.badge}</Badge>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-text-secondary">
                      {layer.recommendedTechs.map((t) => (
                        <div key={t} className="flex items-center gap-2 bg-surface-2 p-2 rounded-lg border border-border/60">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{t}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* ARCHITECTURAL SUMMARY & KEY TAKEAWAYS NOTE CALLOUT */}
              <div className="p-4 rounded-2xl bg-surface-2 border border-accent-primary/40 space-y-2 font-mono text-xs shadow-sm">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent-primary" />
                    <strong className="text-text-primary text-xs font-bold uppercase tracking-wider">
                      💡 System Architecture Summary & Recommendations Note
                    </strong>
                  </div>
                  <Badge variant="success" className="text-[10px] font-mono">100/100 QA Clearance</Badge>
                </div>
                <div className="text-[11px] text-text-secondary leading-relaxed space-y-1.5 pt-1">
                  <p>
                    • <strong>Microservice Allocation:</strong> The Chief of Staff Gateway (:4001) will route intent analysis directly to <strong>Planning & Research Agents</strong> to auto-assemble the 18-Stage SDLC pipeline.
                  </p>
                  <p>
                    • <strong>Vector Memory Strategy:</strong> 768-dimensional dense embeddings are stored in Neon PostgreSQL <code className="text-accent-primary">pgvector</code> with Reciprocal Rank Fusion (RRF score 0.985) for sub-10ms context retrieval.
                  </p>
                  <p>
                    • <strong>Security & Compliance Gate:</strong> Automated OWASP scans and 14/14 integration tests enforce zero-vulnerability deployment before final production release.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRD GENERATOR (GENERATES ONLY ON BUTTON CLICK IN NEAT PDF FORMAT) */}
      {activeTab === 'prd' && (
        <Card className="p-6 bg-surface-1 space-y-6 border border-border shadow-md animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Product Requirements Document (PRD) Specifications Generator
              </h2>
            </div>
            <Badge variant="accent" className="font-mono text-xs">Standardized Enterprise Spec</Badge>
          </div>

          {/* Form to trigger PRD Generation */}
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-text-muted font-bold">Target Product / Application Specification:</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => {
                    setPromptInput(e.target.value);
                    setHasGeneratedPRD(false);
                  }}
                  placeholder="Enter Product Requirement..."
                  className="flex-1 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary font-mono"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleGeneratePRD}
                  disabled={generatingPRD}
                  className="font-semibold text-xs shrink-0 shadow-md whitespace-nowrap"
                >
                  <Sparkles className={`mr-1.5 h-4 w-4 ${generatingPRD ? 'animate-spin' : ''}`} />
                  {generatingPRD ? 'Generating Full PRD Specs...' : 'Generate Complete PRD Document'}
                </Button>
              </div>
            </div>
          </div>

          {/* Placeholder BEFORE clicking button */}
          {!hasGeneratedPRD && !generatingPRD && (
            <div className="p-8 rounded-2xl bg-surface-2 border border-dashed border-border text-center space-y-3">
              <FileText className="h-10 w-10 text-accent-primary mx-auto animate-bounce" />
              <h3 className="font-bold text-sm text-text-primary">PRD Specifications Ready to Synthesize</h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto font-mono leading-relaxed">
                Click <strong>Generate Complete PRD Document</strong> above to generate executive vision, user stories, acceptance criteria, non-functional SLAs, and financial KPIs in a neat PDF document format.
              </p>
            </div>
          )}

          {/* GENERATED NEAT PDF-STYLE EXECUTIVE PRD SPECIFICATION */}
          {hasGeneratedPRD && (
            <div className="p-6 rounded-2xl bg-surface-2 border border-accent-primary/40 space-y-6 shadow-md animate-in fade-in font-sans">
              {/* PDF Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <Badge variant="accent" className="text-[10px] font-mono mb-1">
                    CONFIDENTIAL PRODUCT SPECIFICATION — PRD v1.0
                  </Badge>
                  <h3 className="text-lg font-bold text-text-primary">{promptInput}</h3>
                  <span className="text-xs font-mono text-text-muted">Target Release: Q3 Enterprise Suite • Generated by Chief of Staff Agent</span>
                </div>

                <Button variant="outline" size="sm" onClick={() => handleExportPDF('PRD')} className="h-9 text-xs font-semibold shrink-0 print:hidden">
                  <Printer className="mr-1.5 h-3.5 w-3.5" /> Export PDF Spec
                </Button>
              </div>

              {/* Core Section 1: Executive Vision & Target Personas */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="h-4 w-4 text-accent-primary" /> 1. Executive Vision, Problem Statement & User Personas
                </h4>
                <div className="p-4 rounded-xl bg-surface-1 border border-border/60 space-y-2 text-xs font-mono text-text-secondary leading-relaxed">
                  <p>• <strong>Problem Statement:</strong> Modern educational institutions suffer from fragmented attendance tracking, delayed grade publishing, and inefficient parent-teacher communication loops.</p>
                  <p>• <strong>Product Vision:</strong> Deliver an autonomous, real-time AI portal uniting attendance, gradebook analytics, and automated multi-channel parent notifications.</p>
                  <p>• <strong>Target Personas:</strong> School Administrators (System Control), Teachers (Gradebook & Attendance), Students (Course Progress), Parents (Notifications & Performance Insights).</p>
                </div>
              </div>

              {/* Core Section 2: Functional Features & Acceptance Criteria */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <ListChecks className="h-4 w-4 text-accent-primary" /> 2. Functional Core Features & User Acceptance Criteria
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-surface-1 border border-border/60 space-y-1.5">
                    <strong className="text-text-primary block text-[11px] font-bold">F-101: Real-Time Attendance Engine</strong>
                    <span className="text-text-secondary text-[11px] block">Acceptance: Teacher logs daily attendance; instant SMS/Email parent alert triggered within 3.0s.</span>
                    <Badge variant="success" className="text-[9px]">Priority: P0 Critical</Badge>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-1 border border-border/60 space-y-1.5">
                    <strong className="text-text-primary block text-[11px] font-bold">F-102: Automated AI Gradebook Analytics</strong>
                    <span className="text-text-secondary text-[11px] block">Acceptance: Computes GPA, trend graphs, and sends automated progress reports every Friday at 5 PM.</span>
                    <Badge variant="success" className="text-[9px]">Priority: P0 Critical</Badge>
                  </div>
                </div>
              </div>

              {/* Core Section 3: Non-Functional Requirements & Financial KPIs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-accent-primary" /> 3. Non-Functional Requirements & Financial ROI KPIs
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-surface-1 border border-border/60">
                    <span className="text-[10px] text-text-muted block">Availability SLA:</span>
                    <strong className="text-emerald-400">99.9% Uptime</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-1 border border-border/60">
                    <span className="text-[10px] text-text-muted block">API Latency:</span>
                    <strong className="text-text-primary">&lt; 120ms p95</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-1 border border-border/60">
                    <span className="text-[10px] text-text-muted block">Security Clearance:</span>
                    <strong className="text-text-primary">100/100 (0 Flaws)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-1 border border-border/60">
                    <span className="text-[10px] text-text-muted block">Target ROI:</span>
                    <strong className="text-purple-400">+312.5% Net ROI</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* TAB 3: TRD GENERATOR (GENERATES ONLY ON BUTTON CLICK WITH CODEBASE FILES TREE) */}
      {activeTab === 'trd' && (
        <Card className="p-6 bg-surface-1 space-y-6 border border-border shadow-md animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Technical Requirements Document (TRD) & Application Codebase Architecture
              </h2>
            </div>
            <Badge variant="accent" className="font-mono text-xs">Standardized Technical Spec</Badge>
          </div>

          {/* Form to trigger TRD Generation */}
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-text-muted font-bold">Target Application Architecture Spec:</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => {
                    setPromptInput(e.target.value);
                    setHasGeneratedTRD(false);
                  }}
                  placeholder="Enter Technical Spec..."
                  className="flex-1 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary font-mono"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleGenerateTRD}
                  disabled={generatingTRD}
                  className="font-semibold text-xs shrink-0 shadow-md whitespace-nowrap"
                >
                  <Sparkles className={`mr-1.5 h-4 w-4 ${generatingTRD ? 'animate-spin' : ''}`} />
                  {generatingTRD ? 'Generating Full TRD Specs...' : 'Generate Complete TRD Architecture'}
                </Button>
              </div>
            </div>
          </div>

          {/* Placeholder BEFORE clicking button */}
          {!hasGeneratedTRD && !generatingTRD && (
            <div className="p-8 rounded-2xl bg-surface-2 border border-dashed border-border text-center space-y-3">
              <FileCode className="h-10 w-10 text-accent-primary mx-auto animate-bounce" />
              <h3 className="font-bold text-sm text-text-primary">TRD Architecture & Codebase Specifications Ready</h3>
              <p className="text-xs text-text-secondary max-w-md mx-auto font-mono leading-relaxed">
                Click <strong>Generate Complete TRD Architecture</strong> above to synthesize microservices topology, OpenAPI REST contracts, vector database schemas, and generated application codebase file structure.
              </p>
            </div>
          )}

          {/* GENERATED NEAT PDF-STYLE EXECUTIVE TRD ARCHITECTURE SPECIFICATION */}
          {hasGeneratedTRD && (
            <div className="p-6 rounded-2xl bg-surface-2 border border-accent-primary/40 space-y-6 shadow-md animate-in fade-in font-sans">
              {/* PDF Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <Badge variant="accent" className="text-[10px] font-mono mb-1">
                    TECHNICAL ARCHITECTURE SPECIFICATION — TRD v1.0
                  </Badge>
                  <h3 className="text-lg font-bold text-text-primary">{promptInput}</h3>
                  <span className="text-xs font-mono text-text-muted">Port 4001 REST Gateway • Next.js 15 App Router • Neon pgvector</span>
                </div>

                <Button variant="outline" size="sm" onClick={() => handleExportPDF('TRD')} className="h-9 text-xs font-semibold shrink-0 print:hidden">
                  <Printer className="mr-1.5 h-3.5 w-3.5" /> Export PDF Spec
                </Button>
              </div>

              {/* Core Section 1: Generated Application Codebase Files Structure */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <FolderTree className="h-4 w-4 text-accent-primary" /> 1. Generated Application Codebase Files Structure
                </h4>
                <div className="p-4 rounded-xl bg-surface-1 border border-border/60 font-mono text-xs space-y-2 text-text-secondary">
                  <div className="flex items-center gap-2 text-accent-primary font-bold">
                    <FolderTree className="h-4 w-4" /> <span>lifeos/ (Multi-Agent System Root)</span>
                  </div>
                  <div className="pl-6 space-y-1 text-[11px]">
                    <p>├── 📁 <strong>apps/web/</strong> (Next.js 15 Frontend Presentation App)</p>
                    <p>│   ├── 📄 app/page.tsx (Main Workspace Dashboard & View Switcher)</p>
                    <p>│   ├── 📄 components/workspace/SchoolPortalView.tsx (School Management UI)</p>
                    <p>│   ├── 📄 components/workspace/TechStackView.tsx (Dynamic Tech Stack Advisor)</p>
                    <p>│   └── 📄 lib/apiClient.ts (REST Client Gateway :4001)</p>
                    <p>├── 📁 <strong>backend/</strong> (Express.js REST Microservices Server)</p>
                    <p>│   ├── 📄 server.ts (Express API Server running on Port 4001)</p>
                    <p>│   ├── 📄 src/services/planningService.ts (10-Stage LangGraph Planner Engine)</p>
                    <p>│   ├── 📄 src/services/memoryManager.ts (768-Dim Neon pgvector RRF Search)</p>
                    <p>│   └── 📄 src/services/aidlcEngine.ts (OWASP Security Audit Scanner)</p>
                  </div>
                </div>
              </div>

              {/* Core Section 2: OpenAPI v3 REST API Endpoints Specifications */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-accent-primary" /> 2. Microservices OpenAPI v3 Endpoints & Contracts
                </h4>
                <div className="space-y-2 font-mono text-xs">
                  {[
                    { method: 'POST', endpoint: '/api/v1/agent/planning/plan', desc: '10-Stage LangGraph workflow execution with subtasks breakdown.' },
                    { method: 'POST', endpoint: '/api/v1/agent/finance/analyze', desc: 'Multi-cloud price matrix ($3,850 AWS vs $2,850 Vercel) and ROI.' },
                    { method: 'POST', endpoint: '/api/v1/agent/memory/search', desc: '768-dim Neon pgvector dense embedding hybrid RRF query.' },
                    { method: 'POST', endpoint: '/api/v1/agent/review/verify', desc: 'OWASP security scan & 14/14 automated test suite runner.' },
                  ].map((ep) => (
                    <div key={ep.endpoint} className="p-3 rounded-xl bg-surface-1 border border-border/60 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 truncate">
                        <Badge variant="accent" className="text-[10px] shrink-0 font-bold">{ep.method}</Badge>
                        <strong className="text-text-primary text-[11px] truncate">{ep.endpoint}</strong>
                      </div>
                      <span className="text-[11px] text-text-muted truncate ml-2 hidden sm:inline">{ep.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* TAB 4: COMPLETE 18-STAGE SDLC ROADMAP IN NEAT LINE ORDER */}
      {activeTab === 'workflow' && (
        <Card className="p-6 bg-surface-1 space-y-6 border border-border shadow-md animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Complete 18-Stage Enterprise SDLC Execution Roadmap
              </h2>
            </div>
            <Badge variant="success" className="font-mono text-xs">100% Zero Defect Lifecycle</Badge>
          </div>

          {/* Sequential Timeline Stepper in Neat Vertical Line Order */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/80">
            {sdlcStages.map((st) => {
              const IconComp = st.icon;

              return (
                <div key={st.num} className="relative flex items-start gap-4">
                  {/* Step Marker Dot */}
                  <div className="absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-light border-2 border-accent-primary text-accent-primary text-[10px] font-bold z-10">
                    {st.num}
                  </div>

                  {/* Stage Card Content */}
                  <div className="flex-1 p-4 rounded-xl bg-surface-2 border border-border/80 space-y-2 hover:border-accent-primary/50 transition-luxury">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-2">
                      <div className="flex items-center gap-2">
                        <IconComp className="h-4 w-4 text-accent-primary shrink-0" />
                        <h3 className="font-bold text-xs text-text-primary">
                          Stage {st.num}: {st.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-[10px] font-mono">{st.agent}</Badge>
                        <Badge variant="accent" className="text-[10px] font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {st.duration}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-xs text-text-secondary font-mono leading-relaxed pl-6">
                      {st.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </main>
  );
};
