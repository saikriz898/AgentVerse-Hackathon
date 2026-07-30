'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchApi } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import {
  Sliders,
  Play,
  Copy,
  Check,
  Sparkles,
  Save,
  Code2,
  Zap,
  Bot,
  Settings,
  History,
  FileCode,
  Layers,
  CheckCircle2,
  X,
  Search,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  promptText: string;
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
}

export default function PromptStudioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('tmpl-1');
  const [promptText, setPromptText] = useState(
    `You are an executive AI Memory Assistant. Synthesize the compiled workspace context below and answer the user query concisely with exact citations.\n\nWORKSPACE: {{workspace}}\nUSER ROLE: {{user_role}}\nUSER QUERY: {{user_query}}`
  );

  const [selectedModel, setSelectedModel] = useState('Gemini 2.5 Pro');
  const [temperature, setTemperature] = useState(0.2);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(4096);

  // Variables Manager state
  const [variables, setVariables] = useState<Record<string, string>>({
    workspace: 'Development Workspace',
    user_role: 'Lead Architect',
    user_query: 'How does the Relationship Graph recalculate force-directed layout?',
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [executionStats, setExecutionStats] = useState<{ tokens: number; latencyMs: number; cost: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Query Templates from backend Prompt API
  const { data: templatesList } = useQuery({
    queryKey: ['promptTemplates'],
    queryFn: () => fetchApi('/prompts'),
  });

  const templates: PromptTemplate[] = templatesList || [
    {
      id: 'tmpl-1',
      name: 'Executive Memory Synthesizer',
      category: 'Summarization',
      promptText: 'Synthesize the following active memory entries into a structured executive brief:\n\nWORKSPACE: {{workspace}}\nUSER QUERY: {{user_query}}',
      model: 'Gemini 2.5 Pro',
      temperature: 0.2,
      topP: 0.95,
      maxTokens: 4096,
    },
    {
      id: 'tmpl-2',
      name: 'Graph Entity & Edge Extractor',
      category: 'Analysis',
      promptText: 'Extract all primary entity nodes and directed relationship edges from the input text:\n\nUSER ROLE: {{user_role}}\nINPUT: {{user_query}}',
      model: 'Gemini 2.5 Pro',
      temperature: 0.1,
      topP: 0.9,
      maxTokens: 2048,
    },
    {
      id: 'tmpl-3',
      name: 'Semantic QA Assistant',
      category: 'Writing',
      promptText: 'Answer the user query accurately based on verified workspace context:\n\nUSER ROLE: {{user_role}}\nQUERY: {{user_query}}',
      model: 'Gemini 1.5 Flash',
      temperature: 0.3,
      topP: 0.95,
      maxTokens: 2048,
    },
  ];

  // Client-side prompt validation
  const validatePrompt = () => {
    const errs: string[] = [];
    const warns: string[] = [];

    const trimmed = promptText ? promptText.trim() : '';

    if (!trimmed) {
      errs.push('Prompt text cannot be empty or whitespace only.');
    }

    const lines = (promptText || '').split('\n');
    lines.forEach((line, idx) => {
      if ((line.match(/\{\{/g) || []).length > (line.match(/\}\}/g) || []).length) {
        errs.push(`Syntax Error (Line ${idx + 1}): Unclosed variable placeholder '{{'.`);
      }
    });

    const matches = Array.from(promptText.matchAll(/\{\{([^}]+)\}\}/g));
    const varsFound = Array.from(new Set(matches.map((m) => m[1].trim())));

    varsFound.forEach((v) => {
      if (!variables[v] || !variables[v].trim()) {
        errs.push(`Missing required variable value: {{${v}}}`);
      }
    });

    setValidationErrors(errs);
    setValidationWarnings(warns);

    return errs.length === 0;
  };

  // Test execution mutation
  const testMutation = useMutation({
    mutationFn: (body: any) =>
      fetchApi('/prompts/test', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: (data) => {
      if (data.status === 'error' || (data.errors && data.errors.length > 0)) {
        setValidationErrors(data.errors || ['Validation failed on server']);
        setTestResponse(`PROMPT VALIDATION FAILED\n\nErrors encountered:\n- ${(data.errors || []).join('\n- ')}`);
        setExecutionStats(null);
      } else {
        setValidationErrors([]);
        setTestResponse(data.output);
        setExecutionStats(data.stats);
      }
      setIsExecuting(false);
    },
    onError: (err: any) => {
      setIsExecuting(false);
      setTestResponse(`PROMPT EXECUTION FAILED\n\nError: ${err.message || 'Execution provider error'}`);
    },
  });

  const handleRunTest = () => {
    const isValid = validatePrompt();
    if (!isValid) {
      setTestResponse(`PROMPT VALIDATION FAILED\n\nPlease fix the validation errors before executing prompt.`);
      return;
    }

    setIsExecuting(true);
    setTestResponse(null);
    testMutation.mutate({
      promptText,
      variables,
      model: selectedModel,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const estimatedTokens = Math.ceil(promptText.length / 4);

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
          breadcrumb={['Workspace', 'Prompt Studio']}
          title="Prompt Engineering Studio"
          description="Workspace for authoring system instructions, tuning model parameters, and testing model responses."
          className="flex flex-col md:flex-row md:items-center justify-between gap-3 select-none pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]"
        />

        {/* Toolbar Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-xs text-[#6B7280] dark:text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span>Active Model: <strong className="text-white">{selectedModel}</strong></span>
            <span>•</span>
            <span>Est. Tokens: <strong className="text-cyan-400 font-bold">{estimatedTokens}</strong></span>
            <span>•</span>
            <span className={`px-2 py-0.5 rounded font-bold border ${validationErrors.length === 0 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
              {validationErrors.length === 0 ? 'Validation Passed' : `${validationErrors.length} Syntax Error(s)`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVersionDrawerOpen(true)}
              className="h-[32px] px-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04] text-[#111827] dark:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <History className="w-3.5 h-3.5" />
              <span>Versions</span>
            </button>

            <button
              onClick={handleCopy}
              className="h-[32px] px-3 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] hover:bg-[#F3F4F6] dark:hover:bg-white/[0.04] text-[#111827] dark:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
            </button>

            <button
              onClick={handleRunTest}
              disabled={isExecuting}
              className="h-[32px] px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? 'Running Test...' : 'Test Prompt'}</span>
            </button>
          </div>
        </div>

        {/* Validation Errors Banner */}
        {validationErrors.length > 0 && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-rose-500">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>PROMPT VALIDATION ERRORS DETECTED</span>
            </div>
            {validationErrors.map((err, idx) => (
              <p key={idx} className="pl-6 text-[11px]">• {err}</p>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Viewport (ONLY THIS SCROLLS) */}
      <div className="flex-1 my-1.5 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Templates Library Sidebar (3 cols) */}
        <div className="md:col-span-3 h-full overflow-y-auto space-y-3 pr-1 font-sans text-xs">
          <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-400" /> Prompt Templates
            </h3>

            <div className="space-y-2 font-mono text-xs">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    setSelectedTemplate(tmpl.id);
                    setPromptText(tmpl.promptText);
                    setSelectedModel(tmpl.model);
                    setTemperature(tmpl.temperature);
                    setValidationErrors([]);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                    selectedTemplate === tmpl.id
                      ? 'bg-[#2563EB]/10 border-[#2563EB]/40 text-[#111827] dark:text-white'
                      : 'bg-[#F6F7F9] dark:bg-[#111111] border-[#E5E7EB] dark:border-white/[0.06] hover:border-[#2563EB]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{tmpl.name}</span>
                    <span className="text-[9px] text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">{tmpl.category}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 truncate">{tmpl.promptText}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: System Instructions Editor & Output Viewer (6 cols) */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-3 overflow-hidden">
          {/* Prompt Editor Box */}
          <div className="flex-1 bg-white dark:bg-[#0D0D11] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl p-4 shadow-sm dark:shadow-xl flex flex-col justify-between font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-white/[0.06]">
              <span className="text-[#2563EB] dark:text-cyan-400 font-bold flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#2563EB]" /> SYSTEM INSTRUCTIONS EDITOR
              </span>
              <span className="text-[10px] text-[#6B7280] dark:text-gray-500">Variables: {'{{workspace}}'}, {'{{user_query}}'}</span>
            </div>

            <textarea
              value={promptText}
              onChange={(e) => {
                setPromptText(e.target.value);
                setValidationErrors([]);
              }}
              className="w-full flex-1 my-2 bg-transparent text-xs text-[#111827] dark:text-neutral-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none resize-none font-mono leading-relaxed select-text"
              placeholder="Write system instructions template..."
            />
          </div>

          {/* Test Response Console Output */}
          <div className="h-[200px] bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 shadow-sm flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-white/[0.06]">
              <span className="text-xs font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-400" /> Response Evaluation Console
              </span>
              {executionStats && (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {executionStats.tokens} Tokens • {executionStats.latencyMs}ms • {executionStats.cost}
                </span>
              )}
            </div>

            <div className="flex-1 my-2 overflow-y-auto font-mono text-xs leading-relaxed text-[#111827] dark:text-gray-300 select-text">
              {isExecuting ? (
                <div className="flex items-center gap-2 text-purple-400 animate-pulse pt-4">
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Executing prompt against {selectedModel} API...</span>
                </div>
              ) : testResponse ? (
                <pre className={`whitespace-pre-wrap ${validationErrors.length > 0 ? 'text-rose-400' : ''}`}>{testResponse}</pre>
              ) : (
                <p className="text-gray-500 italic pt-4">Click "Test Prompt" to validate system instructions and execute model evaluation.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Model Settings & Variable Manager (3 cols) */}
        <div className="md:col-span-3 h-full overflow-y-auto space-y-4 pr-1 font-sans text-xs">
          {/* Model Config Panel */}
          <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-[#2563EB]" /> Model Configuration
            </h3>

            <div className="space-y-2 font-mono text-xs">
              <div>
                <label className="text-[10px] text-gray-500 uppercase">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full mt-1 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl px-2.5 py-1.5 text-xs text-[#111827] dark:text-white focus:outline-none"
                >
                  <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
                  <option value="Gemini 1.5 Flash">Gemini 1.5 Flash</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <span>Temperature</span>
                  <span>{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Variable Manager */}
          <div className="bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#6B7280] dark:text-neutral-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" /> Variable Manager
            </h3>

            <div className="space-y-2 font-mono text-xs">
              {Object.entries(variables).map(([key, val]) => (
                <div key={key}>
                  <label className="text-[10px] text-gray-500 font-bold">{`{{${key}}}`}</label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => {
                      setVariables({ ...variables, [key]: e.target.value });
                      setValidationErrors([]);
                    }}
                    className="w-full mt-1 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl px-2.5 py-1.5 text-xs text-[#111827] dark:text-white focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Version Control Drawer */}
      {isVersionDrawerOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end font-mono text-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#0D0D11] border-l border-[#E5E7EB] dark:border-white/[0.08] p-5 h-full flex flex-col justify-between space-y-4 text-[#111827] dark:text-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-white/[0.08]">
              <span className="font-bold text-[#2563EB] dark:text-cyan-400 flex items-center gap-2">
                <History className="w-4 h-4 text-purple-500 dark:text-purple-400" /> PROMPT VERSION CONTROL
              </span>
              <button onClick={() => setIsVersionDrawerOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {[
                { version: 3, label: 'Published Revision', date: 'Just now', author: 'Lead Architect' },
                { version: 2, label: 'Variable Optimization', date: '2 hours ago', author: 'Lead Architect' },
                { version: 1, label: 'Initial Draft', date: 'Yesterday', author: 'System' },
              ].map((v) => (
                <div key={v.version} className="p-3 bg-[#F9FAFB] dark:bg-[#14151B] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[#111827] dark:text-white">{v.label}</span>
                    <button className="px-2 py-0.5 bg-blue-500/10 dark:bg-blue-500/20 text-[#2563EB] dark:text-blue-300 rounded text-[10px] font-semibold">Rollback</button>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-[10px]">{v.date} • {v.author}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsVersionDrawerOpen(false)}
              className="w-full py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-[#111827] dark:text-white rounded-xl font-bold"
            >
              Close Drawer
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Status Footer (shrink-0) */}
      <div className="shrink-0 flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-white/[0.06] text-xs text-[#6B7280] dark:text-neutral-400 font-mono bg-white dark:bg-[#090909] z-10">
        <span>Prompt Studio Engine: ACTIVE</span>
        <span>Model: {selectedModel} | Provider: Google AI</span>
      </div>
    </motion.div>
  );
}
