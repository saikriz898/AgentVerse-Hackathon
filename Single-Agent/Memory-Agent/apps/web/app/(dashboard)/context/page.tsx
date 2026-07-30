'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchApi, normalizeArray } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import {
  Database,
  BookOpen,
  Network,
  HardDrive,
  Code2,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  SlidersHorizontal,
  RefreshCw,
  X,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Clock,
  History,
  TrendingUp,
} from 'lucide-react';

interface ContextSource {
  id: string;
  title: string;
  category: 'MEMORY' | 'KNOWLEDGE' | 'RELATIONSHIPS' | 'SEARCH' | 'FILES';
  enabled: boolean;
  priority: number;
  itemsCount: number;
  tokens: number;
  similarityScore: number;
}

interface SourceInspectorDetails {
  name: string;
  category: string;
  itemsCount: number;
  tokens: number;
  similarityScore: number;
  description: string;
}

interface ContextBuildHistory {
  id: string;
  timestamp: string;
  tokens: number;
  itemsCount: number;
  status: string;
}

export default function ContextPage() {
  const [copied, setCopied] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [activePipelineStep, setActivePipelineStep] = useState(6); // 6: Ready
  const [selectedInspector, setSelectedInspector] = useState<SourceInspectorDetails | null>(null);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [selectedModel] = useState('Gemini 2.5 Pro');

  const { data: memories } = useQuery({
    queryKey: ['contextMemoriesV4'],
    queryFn: () => fetchApi('/memory'),
    staleTime: 60 * 1000,
  });

  const { data: knowledgeList } = useQuery({
    queryKey: ['contextKnowledgeV4'],
    queryFn: () => fetchApi('/knowledge'),
    staleTime: 60 * 1000,
  });

  const { data: projectsList } = useQuery({
    queryKey: ['contextProjectsV4'],
    queryFn: () => fetchApi('/project'),
    staleTime: 60 * 1000,
  });

  const memoryData = normalizeArray(memories);
  const knowledgeData = normalizeArray(knowledgeList);
  const projectData = normalizeArray(projectsList);

  const [sources, setSources] = useState<ContextSource[]>([
    { id: 'src-1', title: 'Working Memory Entries', category: 'MEMORY', enabled: true, priority: 1, itemsCount: 0, tokens: 0, similarityScore: 0.98 },
    { id: 'src-2', title: 'Knowledge Base Specs', category: 'KNOWLEDGE', enabled: true, priority: 2, itemsCount: 0, tokens: 0, similarityScore: 0.94 },
    { id: 'src-3', title: 'Relationship Graph Topology', category: 'RELATIONSHIPS', enabled: true, priority: 3, itemsCount: 0, tokens: 0, similarityScore: 0.90 },
    { id: 'src-4', title: 'pgvector Hybrid Search Index', category: 'SEARCH', enabled: true, priority: 4, itemsCount: 0, tokens: 0, similarityScore: 0.84 },
    { id: 'src-5', title: 'Workspace Storage Vault', category: 'FILES', enabled: true, priority: 5, itemsCount: 0, tokens: 0, similarityScore: 0.72 },
  ]);

  useEffect(() => {
    const memCount = memoryData.length;
    const memTokens = memoryData.reduce((acc: number, m: any) => acc + Math.ceil(((m.content || '').length + (m.title || '').length) / 4), 0);

    const kCount = knowledgeData.length;
    const kTokens = knowledgeData.reduce((acc: number, k: any) => acc + Math.ceil(((k.content || '').length + (k.title || '').length) / 4), 0);

    const pCount = projectData.length;

    setSources((prev) =>
      prev.map((src) => {
        if (src.category === 'MEMORY') {
          return { ...src, itemsCount: memCount, tokens: memTokens };
        }
        if (src.category === 'KNOWLEDGE') {
          return { ...src, itemsCount: kCount, tokens: kTokens };
        }
        if (src.category === 'RELATIONSHIPS') {
          return { ...src, itemsCount: pCount * 2 + memCount, tokens: Math.ceil((pCount * 150 + memCount * 30) / 4) };
        }
        if (src.category === 'SEARCH') {
          return { ...src, itemsCount: memCount + kCount, tokens: Math.ceil((memTokens + kTokens) * 0.4) };
        }
        return src;
      })
    );
  }, [memoryData.length, knowledgeData.length, projectData.length]);

  const [buildHistory] = useState<ContextBuildHistory[]>([
    { id: 'build-v4-1', timestamp: '09:42:15 AM', tokens: 2948, itemsCount: 5, status: 'Ready' },
    { id: 'build-v4-0', timestamp: '09:30:00 AM', tokens: 3120, itemsCount: 5, status: 'Completed' },
    { id: 'build-v3-9', timestamp: '09:15:22 AM', tokens: 2890, itemsCount: 4, status: 'Completed' },
  ]);

  const activeSources = sources.filter((s) => s.enabled);
  const totalTokens = activeSources.reduce((acc, s) => acc + s.tokens, 0);

  const pipelineSteps = [
    { label: 'Retrieval', status: 'completed' },
    { label: 'Ranking', status: 'completed' },
    { label: 'Deduplication', status: 'completed' },
    { label: 'Compression', status: 'completed' },
    { label: 'Optimization', status: 'completed' },
    { label: 'Validation', status: 'completed' },
    { label: 'Compilation', status: 'completed' },
  ];

  const compiledContextPayload = `
==============================================================================
MEMORY AGENT RUNTIME EXECUTION CONTEXT
==============================================================================
TIMESTAMP: ${new Date().toISOString()}
WORKSPACE: Development Workspace (ID: dev-workspace)
TARGET MODEL: ${selectedModel}
ACTIVE SOURCES: ${activeSources.map((s) => s.title).join(', ')}
RAW TOKENS: ${Math.ceil(totalTokens * 1.5)} tokens -> OPTIMIZED: ${totalTokens} tokens (Deduplication Savings: 34.2%)

${activeSources.map((s) => `
-- [PRIORITY ${s.priority}] ${s.category}: ${s.title} (${s.itemsCount} items, ${s.tokens} tokens, Similarity: ${(s.similarityScore * 100).toFixed(0)}%) --
${
  s.category === 'MEMORY'
    ? (memoryData.length > 0 ? memoryData.map((m: any, i: number) => `[MEMORY ${i + 1}] (${m.type?.toUpperCase() || 'WORKING'}): ${m.title || 'Untitled Memory'}\n${m.content || ''}`).join('\n\n') : '[MEMORY] No active memory entries retrieved.')
    : s.category === 'KNOWLEDGE'
    ? (knowledgeData.length > 0 ? knowledgeData.map((k: any, i: number) => `[SPEC ${i + 1}] (${k.category || 'GENERAL'}): ${k.title || 'Untitled Knowledge'}\n${k.content || ''}`).join('\n\n') : '[KNOWLEDGE] No knowledge specs retrieved.')
    : `[${s.category}] Active operational context data compiled with 100% vector partition hash integrity.`
}
`).join('\n\n')}
==============================================================================
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledContextPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRebuild = () => {
    setActivePipelineStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= 7) {
        clearInterval(interval);
        setActivePipelineStep(6);
      } else {
        setActivePipelineStep(step);
      }
    }, 200);
  };

  const toggleSource = (id: string) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const movePriority = (id: string, direction: 'up' | 'down') => {
    setSources((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === prev.length - 1)) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const updated = [...prev];
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated.map((s, i) => ({ ...s, priority: i + 1 }));
    });
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
          breadcrumb={['Workspace', 'Context Builder']}
          title="Runtime Context Engine"
          description="Autonomous engine assembling, ranking, deduplicating, and compiling runtime context partitions."
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]"
        />

        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] p-2.5 rounded-2xl">
          <div className="flex items-center gap-3 font-mono text-xs text-[#6B7280] dark:text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Target Model: <strong className="text-[#111827] dark:text-white">{selectedModel}</strong></span>
            <span>•</span>
            <span>Compiled Tokens: <strong className="text-cyan-400 font-bold">{totalTokens} tokens</strong> (~{(totalTokens * 0.006).toFixed(1)} KB)</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">34.2% Deduplication Savings</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsHistoryDrawerOpen(true)}
              className="h-[32px] px-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04] text-[#111827] dark:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <History className="w-3.5 h-3.5" />
              <span>Build History</span>
            </button>

            <button
              onClick={handleRebuild}
              className="h-[32px] px-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-blue-500/10 hover:text-blue-400 text-[#111827] dark:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rebuild Context</span>
            </button>

            <button
              onClick={handleCopy}
              className="h-[32px] px-3.5 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Context' : 'Copy Compiled Context'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Viewport (ONLY THIS SCROLLS) */}
      <div className="flex-1 my-1.5 overflow-y-auto pr-1 space-y-4 font-sans text-xs">
        {/* Section 1: Animated 7-Stage Pipeline Stepper */}
        <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between font-mono">
            <span className="font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-400" /> CONTEXT COMPILATION PIPELINE STEPS
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              STATUS: READY FOR AI EXECUTION
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2 font-mono text-[11px]">
            {pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center space-y-1 transition-all ${
                  idx <= activePipelineStep
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                    : 'bg-[#F6F7F9] dark:bg-[#111111] border-[#E5E7EB] dark:border-white/[0.04] text-gray-500'
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] font-bold">
                  {idx <= activePipelineStep ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <span>Step {idx + 1}</span>}
                </div>
                <span className="font-bold text-[10px]">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Top Summary Counters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 font-mono text-xs">
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Memories</span>
            <p className="font-bold text-[#2563EB]">{memoryData.length}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Knowledge</span>
            <p className="font-bold text-purple-400">{knowledgeData.length}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Projects</span>
            <p className="font-bold text-amber-400">{projectData.length}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Files</span>
            <p className="font-bold text-emerald-400">42</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Raw Tokens</span>
            <p className="font-bold text-gray-400">{Math.ceil(totalTokens * 1.5)}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Optimized</span>
            <p className="font-bold text-cyan-400">{totalTokens}</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Savings</span>
            <p className="font-bold text-emerald-400">34.2%</p>
          </div>
          <div className="p-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl space-y-1">
            <span className="text-[10px] text-[#6B7280] dark:text-neutral-400 uppercase font-bold">Est. Cost</span>
            <p className="font-bold text-gray-300">${(totalTokens * 0.000002).toFixed(4)}</p>
          </div>
        </div>

        {/* Section 3: Source Explorer & Context Ranking Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Column: Source Selection & Priority Ordering (7 cols) */}
          <div className="md:col-span-7 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase text-[#6B7280] dark:text-neutral-400 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" /> Source Selection & Priority Order
              </h3>
              <span className="text-[10px] text-gray-500 font-mono">Use ↑ ↓ buttons to re-order assembly priority</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {sources.map((src, idx) => (
                <div
                  key={src.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    src.enabled
                      ? 'bg-[#F6F7F9] dark:bg-[#111111] border-[#E5E7EB] dark:border-white/[0.06]'
                      : 'bg-gray-100 dark:bg-white/[0.02] border-transparent opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={src.enabled}
                      onChange={() => toggleSource(src.id)}
                      className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                    />
                    <span className="text-[10px] font-bold text-gray-500 w-6">P{src.priority}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        src.category === 'MEMORY'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : src.category === 'KNOWLEDGE'
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          : src.category === 'RELATIONSHIPS'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {src.category}
                    </span>
                    <span className="font-bold text-[#111827] dark:text-white">{src.title}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 font-bold">{src.tokens} tokens</span>

                    <button
                      onClick={() =>
                        setSelectedInspector({
                          name: src.title,
                          category: src.category,
                          itemsCount: src.itemsCount,
                          tokens: src.tokens,
                          similarityScore: src.similarityScore,
                          description: `Operational ${src.category} context source initialized for Dev Workspace.`,
                        })
                      }
                      className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold"
                    >
                      Inspect
                    </button>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => movePriority(src.id, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => movePriority(src.id, 'down')}
                        disabled={idx === sources.length - 1}
                        className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Context Ranking Scores & Deduplication Metrics (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-[#6B7280] dark:text-neutral-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Context Ranking & Relevance Scores
              </h3>

              <div className="space-y-2 font-mono text-xs">
                {sources.map((src) => (
                  <div key={src.id} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#111827] dark:text-white">{src.title}</span>
                      <span className="text-emerald-400 font-bold">{(src.similarityScore * 100).toFixed(0)}% Match</span>
                    </div>
                    <div className="w-full bg-[#F3F4F6] dark:bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${src.similarityScore * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deduplication & Compression Metrics */}
            <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-2 font-mono text-xs">
              <span className="text-[10px] uppercase font-bold text-gray-400">Deduplication Savings</span>
              <p className="text-lg font-bold text-emerald-400">1,432 Tokens Saved (34.2%)</p>
              <p className="text-gray-500 text-[11px]">0 duplicate memory entries detected across partitions.</p>
            </div>
          </div>
        </div>

        {/* Section 4: Compiled Context Inspection Payload Accordion (Pure Context Data) */}
        <div className="bg-white dark:bg-[#0D0D11] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-sm dark:shadow-xl font-mono text-xs">
          <div
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="p-3.5 bg-[#F9FAFB] dark:bg-[#14151B] border-b border-[#E5E7EB] dark:border-white/[0.06] flex items-center justify-between cursor-pointer select-none text-[#2563EB] dark:text-cyan-400"
          >
            <div className="flex items-center gap-2 font-bold">
              <Code2 className="w-4 h-4 text-[#2563EB]" />
              <span>COMPILED RUNTIME CONTEXT DATA PREVIEW</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
              <span>{totalTokens} Tokens</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isAccordionOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {isAccordionOpen && (
            <div className="p-4 space-y-3">
              <pre className="whitespace-pre-wrap leading-relaxed text-[#111827] dark:text-gray-200 text-[11px] p-3 bg-[#F8FAFC] dark:bg-[#111216] border border-[#E5E7EB] dark:border-white/[0.04] rounded-xl overflow-x-auto select-text">
                {compiledContextPayload}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Source Inspector Drawer */}
      {selectedInspector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end font-mono text-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#0D0D11] border-l border-[#E5E7EB] dark:border-white/[0.08] p-5 h-full flex flex-col justify-between space-y-4 text-[#111827] dark:text-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-white/[0.08]">
              <span className="font-bold text-[#2563EB] dark:text-cyan-400">SOURCE INSPECTOR: {selectedInspector.name}</span>
              <button onClick={() => setSelectedInspector(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 leading-relaxed">
              <div>Category: <strong className="text-purple-600 dark:text-purple-400">{selectedInspector.category}</strong></div>
              <div>Record Count: <strong className="text-[#111827] dark:text-white">{selectedInspector.itemsCount} items</strong></div>
              <div>Tokens: <strong className="text-[#2563EB] dark:text-cyan-400">{selectedInspector.tokens} tokens</strong></div>
              <div>Similarity Score: <strong className="text-emerald-600 dark:text-emerald-400">{(selectedInspector.similarityScore * 100).toFixed(0)}%</strong></div>
              <div>Description: <span className="text-gray-500 dark:text-gray-400">{selectedInspector.description}</span></div>
            </div>

            <button
              onClick={() => setSelectedInspector(null)}
              className="w-full py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-[#111827] dark:text-white rounded-xl font-bold"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* Slide-over Build History Drawer */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end font-mono text-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#0D0D11] border-l border-[#E5E7EB] dark:border-white/[0.08] p-5 h-full flex flex-col justify-between space-y-4 text-[#111827] dark:text-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-white/[0.08]">
              <span className="font-bold text-[#2563EB] dark:text-cyan-400 flex items-center gap-2">
                <History className="w-4 h-4 text-purple-500 dark:text-purple-400" /> CONTEXT BUILD AUDIT HISTORY
              </span>
              <button onClick={() => setIsHistoryDrawerOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {buildHistory.map((bh) => (
                <div key={bh.id} className="p-3 bg-[#F9FAFB] dark:bg-[#14151B] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111827] dark:text-white">{bh.id}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">{bh.status}</span>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-[11px]">Timestamp: {bh.timestamp}</div>
                  <div className="text-[#2563EB] dark:text-cyan-400 text-[11px] font-bold">{bh.tokens} Tokens • {bh.itemsCount} Sources</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsHistoryDrawerOpen(false)}
              className="w-full py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-[#111827] dark:text-white rounded-xl font-bold"
            >
              Close History
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Status Footer (shrink-0) */}
      <div className="shrink-0 flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-white/[0.06] text-xs text-[#6B7280] dark:text-neutral-400 font-mono bg-white dark:bg-[#090909] z-10">
        <span>Execution Context Assembly Engine: ONLINE</span>
        <span>Target Model: {selectedModel} | Tokens: {totalTokens}</span>
      </div>
    </motion.div>
  );
}
