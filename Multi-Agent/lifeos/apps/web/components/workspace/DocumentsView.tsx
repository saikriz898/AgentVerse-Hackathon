'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  FileText,
  Download,
  Sparkles,
  RefreshCw,
  Eye,
  Printer,
  ShieldCheck,
  Cpu,
  Globe,
  Server,
  Zap,
  Lock,
  ListChecks,
  BookOpen,
  CheckCircle2,
  FolderTree,
  Sliders,
  Filter,
  Plus,
  X,
} from 'lucide-react';
import { downloadPDF } from '@/lib/exportToPDF';

interface Tier1Document {
  id: string;
  num: string;
  title: string;
  category: string;
  purpose: string;
  priority: string;
  stars: string;
  content: string;
}

const INITIAL_DOC_SUITE: Tier1Document[] = [
  // 1. Product Documents
  { id: 'doc-01', num: '01', title: 'Vision Document (VD)', category: 'Product', purpose: 'Product vision, long-term mission & strategic goals', priority: 'P0', stars: 'P0', content: `LIFEOS VISION DOCUMENT (VD) v1.0\n\n1. EXECUTIVE SUMMARY\nLifeOS is an autonomous multi-agent operating system empowering software teams to achieve 10x developer velocity through self-healing, zero-defect microservices orchestration.\n\n2. CORE MISSION & STRATEGIC GOALS\n- Automate end-to-end SDLC from prompt intent to production build.\n- Enforce 100/100 QA compliance and zero OWASP vulnerabilities.\n- Deliver sub-10ms memory recall using 768-dim vector embeddings.` },
  { id: 'doc-02', num: '02', title: 'Business Requirements Document (BRD)', category: 'Product', purpose: 'High-level business & stakeholder requirements', priority: 'P0', stars: 'P0', content: `BUSINESS REQUIREMENTS DOCUMENT (BRD)\n\n1. BUSINESS OBJECTIVES\n- Reduce software delivery cycle time from weeks to hours.\n- Lower multi-cloud infrastructure expenditures by 18% via Vercel + Neon optimization.\n- Achieve 312.5% net financial ROI within 3.2 months payback period.` },
  { id: 'doc-03', num: '03', title: 'Product Requirements Document (PRD)', category: 'Product', purpose: 'Functional specifications & user stories', priority: 'P0', stars: 'P0', content: `PRODUCT REQUIREMENTS DOCUMENT (PRD)\n\n1. FEATURE SPECIFICATIONS\n- F-101: 10-Stage LangGraph Sequential Execution DAG Engine.\n- F-102: Real-time Multi-Cloud Infrastructure Price Comparator.\n- F-103: OWASP Top-10 Security Scanner & Secret Detector.` },
  { id: 'doc-04', num: '04', title: 'Market Requirements Document (MRD)', category: 'Product', purpose: 'Market research, customer segments & competitors', priority: 'P1', stars: 'P1', content: `MARKET REQUIREMENTS DOCUMENT (MRD)\n\n1. COMPETITIVE LANDSCAPE\n- Comparison against Devin, GitHub Copilot Workspace, and AutoGen Enterprise.\n- Target Audience: Enterprise CTOs, Lead Architects, and DevOps Teams.` },
  { id: 'doc-05', num: '05', title: 'Product Roadmap Document', category: 'Product', purpose: 'Product phases, milestones & release timelines', priority: 'P1', stars: 'P1', content: `PRODUCT ROADMAP (Q1 - Q4)\n\n- Q1: Multi-Agent Microservices Core Gateway & pgvector Memory Ingest.\n- Q2: OWASP Security Audit Scanner & 14 Integration Test Cases Suite.\n- Q3: Automated 55 Tier-1 Document Suite Synthesizer.` },
  { id: 'doc-06', num: '06', title: 'Release Notes Document', category: 'Product', purpose: 'Version changes, fixes & feature additions', priority: 'P2', stars: 'P2', content: `RELEASE NOTES v1.5.0\n\n- ADDED: Prompt-Driven Tech Stack & Architecture Advisor.\n- ADDED: PDF Document Download Engine for 55 Enterprise Specifications.\n- FIXED: Clean single-line tab formatting and mobile layout adjustments.` },

  // 2. Technical Documents
  { id: 'doc-07', num: '07', title: 'Technical Requirements Document (TRD)', category: 'Technical', purpose: 'Technical architecture & API contracts', priority: 'P0', stars: 'P0', content: `TECHNICAL REQUIREMENTS DOCUMENT (TRD)\n\n1. SYSTEM ARCHITECTURE\n- Frontend: Next.js 15.1.7, React 19, TailwindCSS, Zustand Store.\n- Backend: Express REST API Server (:4001), TypeScript, Node.js v20+.\n- Vector Database: Neon PostgreSQL pgvector (768 dimensions).` },
  { id: 'doc-08', num: '08', title: 'System Design Document (SDD)', category: 'Technical', purpose: 'High-level & low-level component design', priority: 'P0', stars: 'P0', content: `SYSTEM DESIGN DOCUMENT (SDD)\n\n1. COMPONENT DESIGN\n- Chief of Staff Orchestration Gateway handles REST requests on port 4001.\n- Inter-Agent Event Bus coordinates Research, Planning, Review, Memory, Finance, and Communication agents.` },
  { id: 'doc-09', num: '09', title: 'Software Architecture Document (SAD)', category: 'Technical', purpose: 'Overall system patterns & topology', priority: 'P0', stars: 'P0', content: `SOFTWARE ARCHITECTURE DOCUMENT (SAD)\n\n1. ARCHITECTURAL PATTERNS\n- Microservices Architecture with decoupled REST endpoints.\n- Sequential DAG Execution Pattern driven by LangChain & LangGraph.` },
  { id: 'doc-10', num: '10', title: 'Database Design Document (DDD)', category: 'Technical', purpose: 'Database schema, pgvector tables & ERD', priority: 'P0', stars: 'P0', content: `DATABASE DESIGN DOCUMENT (DDD)\n\n1. NEON PGVECTOR SCHEMA\n- CREATE TABLE agent_memories (id UUID PRIMARY KEY, embedding vector(768), content TEXT, rrf_score FLOAT);\n- CREATE INDEX HNSW vector index for sub-10ms semantic query matching.` },
  { id: 'doc-11', num: '11', title: 'API Specification Document', category: 'Technical', purpose: 'OpenAPI v3 REST & WebSocket contracts', priority: 'P0', stars: 'P0', content: `OPENAPI V3 REST SPECIFICATION\n\n- POST /api/v1/agent/planning/plan\n- POST /api/v1/agent/finance/analyze\n- POST /api/v1/agent/memory/search\n- POST /api/v1/agent/review/verify` },
  { id: 'doc-12', num: '12', title: 'Integration Document', category: 'Technical', purpose: 'Third-party cloud & LLM provider integrations', priority: 'P1', stars: 'P1', content: `THIRD-PARTY INTEGRATION SPECIFICATION\n\n- LLM Gateway: Google Gemini 3.6 Flash/Pro, Anthropic Claude 3.5 Sonnet, OpenAI GPT-4o.\n- Cloud Providers: AWS, Azure, GCP, Vercel, DigitalOcean, Cloudflare Workers.` },

  // 3. AI Documents
  { id: 'doc-13', num: '13', title: 'AI Development Lifecycle (AIDLC)', category: 'AI Architecture', purpose: 'Complete AI workflow lifecycle specs', priority: 'P0', stars: 'P0', content: `AI DEVELOPMENT LIFECYCLE (AIDLC) PROTOCOL\n\n1. LIFECYCLE PHASES\n- Intent Analysis -> Intelligence Scraping -> LangGraph Planning -> Memory Ingestion -> Security Audit -> Deployment.` },
  { id: 'doc-14', num: '14', title: 'Chief of Staff Specification', category: 'AI Architecture', purpose: 'Executive AI orchestration gateway', priority: 'P0', stars: 'P0', content: `CHIEF OF STAFF MASTER AGENT SPECIFICATION\n\n- Orchestrates inter-agent communication, resolves intent ambiguity, enforces QA gates, and manages microservices routing on Port 4001.` },
  { id: 'doc-15', num: '15', title: 'Prompt Engineering Guide', category: 'AI Architecture', purpose: 'Zero-fabrication prompt framework', priority: 'P0', stars: 'P0', content: `PROMPT ENGINEERING FRAMEWORK\n\n- Strict JSON schema enforcement.\n- Zero-fabrication hallucination gate (0% allowed).\n- Dynamic system context injection.` },
  { id: 'doc-16', num: '16', title: 'Agent Architecture Document', category: 'AI Architecture', purpose: 'Internal multi-agent state machines', priority: 'P0', stars: 'P0', content: `AGENT ARCHITECTURE SPECIFICATION\n\n- Autonomous agent loops with tool usage, memory retrieval, and self-reflection error correction.` },
  { id: 'doc-17', num: '17', title: 'Memory Architecture Document', category: 'AI Architecture', purpose: '768-Dim vector memory & RRF reranking', priority: 'P0', stars: 'P0', content: `MEMORY ARCHITECTURE SPECIFICATION\n\n- BM25 keyword search combined with 768-dim dense embeddings using Reciprocal Rank Fusion (RRF score 0.985).` },
  { id: 'doc-18', num: '18', title: 'Workflow Engine Document', category: 'AI Architecture', purpose: 'LangGraph 10-stage sequential DAG', priority: 'P0', stars: 'P0', content: `WORKFLOW ENGINE SPECIFICATION\n\n- 10-stage sequential state machine with transition locks and subtask developer-hour estimates.` },
  { id: 'doc-19', num: '19', title: 'Knowledge Graph Design', category: 'AI Architecture', purpose: 'Knowledge topology & spatial nodes', priority: 'P1', stars: 'P1', content: `KNOWLEDGE GRAPH TOPOLOGY\n\n- Animated 2D spatial force-directed node graph visualizer mapping code entities and concept relations.` },
  { id: 'doc-20', num: '20', title: 'Model Provider Document', category: 'AI Architecture', purpose: 'Gemini, Claude & OpenAI interop gateway', priority: 'P1', stars: 'P1', content: `MODEL PROVIDER INTEROP SPECIFICATION\n\n- Dynamic load-balancing and fallback switching between Google Gemini 3.6, Claude 3.5, and GPT-4o.` },
];

export const DocumentsView: React.FC = () => {
  const [docSuite, setDocSuite] = useState<Tier1Document[]>(INITIAL_DOC_SUITE);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [generatingDocId, setGeneratingDocId] = useState<string | null>(null);

  // Manual document creation state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Product');
  const [customPurpose, setCustomPurpose] = useState('');
  const [customPriority, setCustomPriority] = useState('P0');
  const [customContent, setCustomContent] = useState('');

  const categories = [
    'All',
    'Product',
    'Technical',
    'AI Architecture',
    'Frontend',
    'Backend',
    'DevOps',
    'Security',
    'Testing',
    'Operations',
    'Project Management',
  ];

  const filteredDocs = selectedCategory === 'All'
    ? docSuite
    : docSuite.filter((d) => d.category === selectedCategory);

  const [selectedDoc, setSelectedDoc] = useState<Tier1Document>(docSuite[0]);

  const handleDownloadPDF = (doc: Tier1Document) => {
    setGeneratingDocId(doc.id);
    setTimeout(() => {
      setGeneratingDocId(null);
      const filename = `lifeos_${doc.num}_${doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
      downloadPDF(filename, doc.title, doc.content);
    }, 300);
  };

  const handleCreateCustomDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const nextNum = String(docSuite.length + 1).padStart(2, '0');
    const newDoc: Tier1Document = {
      id: `doc-${Date.now()}`,
      num: nextNum,
      title: customTitle,
      category: customCategory,
      purpose: customPurpose || 'Custom Enterprise Specification',
      priority: customPriority,
      stars: customPriority,
      content: customContent || `### ${customTitle.toUpperCase()}\n\n1. EXECUTIVE SPECIFICATION\n- Author: Enterprise Administrator\n- Domain: ${customCategory}\n- Priority: ${customPriority}\n\n${customPurpose}`,
    };

    setDocSuite([newDoc, ...docSuite]);
    setSelectedDoc(newDoc);
    setIsModalOpen(false);

    // Reset Form
    setCustomTitle('');
    setCustomPurpose('');
    setCustomContent('');
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8 font-sans antialiased">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="accent" className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-accent-primary" /> Tier-1 Enterprise Documentation Suite ({docSuite.length} Documents)
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">10 Enterprise Domains</Badge>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 font-mono text-xs">
              PDF Export Engine
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            LifeOS Documentation Suite ({docSuite.length} Specs)
          </h1>
          <p className="text-sm text-text-secondary">
            Standardized Tier-1 Enterprise Specifications covering Product, Technical, AI Architecture, Frontend, Backend, DevOps, Security, Testing, Operations, and Project Management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="font-semibold text-xs shadow-sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Custom Document
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleDownloadPDF(selectedDoc)} className="font-semibold text-xs shadow-md">
            <Download className="mr-1.5 h-3.5 w-3.5" /> Download Selected .pdf
          </Button>
        </div>
      </div>

      {/* Category Filter Pills (Single-Line Non-Wrapping) */}
      <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap p-1 bg-surface-2 rounded-xl border border-border text-xs shrink-0 max-w-full">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-luxury shrink-0 whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-accent-primary text-white shadow-xs'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {cat} {cat === 'All' ? `(${docSuite.length})` : ''}
          </button>
        ))}
      </div>

      {/* Main Grid: Document List & Live PDF Document Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 55 Documents List (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
          {filteredDocs.map((doc) => (
            <Card
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className={`p-3.5 cursor-pointer transition-luxury border space-y-2 ${
                selectedDoc.id === doc.id ? 'border-accent-primary bg-accent-light/10 shadow-xs' : 'bg-surface-1 border-border/80 hover:border-accent-primary/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-surface-2 text-[10px] font-bold font-mono text-accent-primary">
                    {doc.num}
                  </span>
                  <strong className="font-bold text-xs text-text-primary truncate">{doc.title}</strong>
                </div>
                <span className="text-[10px] text-accent-primary font-mono font-bold shrink-0">{doc.priority}</span>
              </div>

              <p className="text-[11px] text-text-secondary font-mono line-clamp-1">{doc.purpose}</p>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono">
                <Badge variant="outline" className="text-[9px]">{doc.category}</Badge>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadPDF(doc);
                  }}
                  className="text-accent-primary hover:underline font-bold flex items-center gap-1"
                >
                  <Download className="h-2.5 w-2.5" /> Download .pdf
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column: Live PDF Document Viewer (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="p-6 bg-surface-1 space-y-5 border border-border shadow-md font-sans">
            {/* Document Viewer Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="accent" className="font-mono text-[10px]">
                    DOC #{selectedDoc.num} • {selectedDoc.category.toUpperCase()}
                  </Badge>
                  <Badge variant="success" className="font-mono text-[10px]">
                    Tier-1 Enterprise Standard
                  </Badge>
                </div>
                <h2 className="mt-1 text-lg font-bold text-text-primary">{selectedDoc.title}</h2>
                <p className="text-xs font-mono text-text-secondary">{selectedDoc.purpose}</p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDownloadPDF(selectedDoc)}
                disabled={generatingDocId === selectedDoc.id}
                className="font-semibold text-xs shadow-md shrink-0"
              >
                <Download className={`mr-1.5 h-3.5 w-3.5 ${generatingDocId === selectedDoc.id ? 'animate-spin' : ''}`} />
                {generatingDocId === selectedDoc.id ? 'Exporting PDF...' : `Download ${selectedDoc.title.slice(0, 16)}.pdf`}
              </Button>
            </div>

            {/* Document Content View */}
            <div className="p-5 rounded-2xl bg-surface-2 border border-border/80 font-mono text-xs text-text-primary leading-relaxed space-y-4 max-h-[520px] overflow-y-auto shadow-inner">
              <div className="flex items-center justify-between border-b border-border/40 pb-2 text-[11px] text-text-muted">
                <span>Specification Priority: <strong>{selectedDoc.priority}</strong></span>
                <span>Author: <strong>Enterprise Chief Architect</strong></span>
              </div>

              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-text-secondary">
                {selectedDoc.content}
              </pre>
            </div>
          </Card>
        </div>
      </div>

      {/* CREATE CUSTOM DOCUMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in font-sans">
          <div className="bg-surface-1 border border-border/80 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <Plus className="h-4 w-4 text-accent-primary" /> Create Custom Enterprise Document
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomDoc} className="space-y-4 text-xs">
              <div>
                <label className="block text-text-secondary font-medium mb-1">Document Title</label>
                <Input
                  placeholder="e.g. Security Compliance & Access Control SLA"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-secondary font-medium mb-1">Domain Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-surface-2 px-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-text-secondary font-medium mb-1">Priority</label>
                  <select
                    value={customPriority}
                    onChange={(e) => setCustomPriority(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-surface-2 px-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                    <option value="P0">P0 (Critical)</option>
                    <option value="P1">P1 (High)</option>
                    <option value="P2">P2 (Normal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-text-secondary font-medium mb-1">Purpose / Summary</label>
                <Input
                  placeholder="e.g. Comprehensive security specifications for OWASP compliance"
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-text-secondary font-medium mb-1">Specifications Content (Markdown / Text)</label>
                <textarea
                  rows={6}
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Enter detailed document specifications here..."
                  className="w-full rounded-xl border border-border bg-surface-2 p-3 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="font-semibold shadow-md">
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Create Document
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
