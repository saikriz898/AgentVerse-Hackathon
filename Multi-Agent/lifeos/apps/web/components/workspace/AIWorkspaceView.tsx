'use client';

import React, { useRef, useEffect } from 'react';
import { WorkflowExecutionPanel } from '@/components/workspace/WorkflowExecutionPanel';
import { Composer } from '@/components/workspace/Composer';
import { ArtifactViewer } from '@/components/workspace/ArtifactViewer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  Bot,
  Plus,
  Bookmark,
  FileCode,
  LineChart,
  ShieldCheck,
  Loader2,
  Trash2,
  Pin,
  Folder,
  Layers,
  Activity,
  Cpu,
  Rocket,
  Zap,
  Terminal,
  Database,
  Search,
} from 'lucide-react';
import { useAIWorkspaceStore } from '@/lib/stores/useAIWorkspaceStore';

export const AIWorkspaceView: React.FC = () => {
  const {
    sessions,
    activeSessionId,
    isThinking,
    streamingPhase,
    setActiveSessionId,
    createNewSession,
    deleteSession,
    togglePinSession,
    sendPrompt,
  } = useAIWorkspaceStore();

  const [selectedModel, setSelectedModel] = React.useState('gemini-3.6-flash');
  const [showOptimizerDrawer, setShowOptimizerDrawer] = React.useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages?.length, isThinking, streamingPhase]);

  const parseInlineMarkdown = (content: string) => {
    // Helper to render bold **text** correctly
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-text-primary">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderFormattedMessageText = (rawText: string) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');

    return (
      <div className="space-y-2.5 text-sm text-text-primary leading-relaxed font-sans">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-0.5" />;

          // Divider Line (---)
          if (trimmed === '---') {
            return <div key={idx} className="my-3 border-b border-border/80" />;
          }

          // H1 Headings (# Heading)
          if (trimmed.startsWith('# ')) {
            return (
              <div key={idx} className="flex items-center gap-2 pt-3 border-b border-border/80 pb-2">
                <Sparkles className="h-4 w-4 text-accent-primary shrink-0" />
                <h2 className="text-base md:text-lg font-bold text-text-primary tracking-tight">
                  {trimmed.substring(2)}
                </h2>
              </div>
            );
          }

          // H2 Headings (## Subheading)
          if (trimmed.startsWith('## ')) {
            return (
              <div key={idx} className="flex items-center gap-2 pt-2 text-accent-primary">
                <Zap className="h-3.5 w-3.5 shrink-0" />
                <h3 className="text-sm md:text-base font-bold tracking-tight">
                  {trimmed.substring(3)}
                </h3>
              </div>
            );
          }

          // H3 / H4 Headings (### or ####)
          if (trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
            const headingText = trimmed.replace(/^#+\s*/, '');
            return (
              <div key={idx} className="flex items-center gap-2 pt-3 pb-1 border-b border-border/60">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-accent-light text-accent-primary font-bold text-xs">
                  <Zap className="h-3.5 w-3.5" />
                </span>
                <h3 className="text-sm font-bold text-text-primary tracking-tight">
                  {headingText}
                </h3>
              </div>
            );
          }

          // File Structure Lines (- 📄 or 📄)
          if (trimmed.includes('📄 apps/') || trimmed.includes('📄 backend/') || trimmed.startsWith('- 📄')) {
            const cleanFileText = trimmed.replace(/^[-\s]*📄\s*/, '');
            return (
              <div key={idx} className="flex items-center gap-2 bg-surface-2 p-2.5 rounded-xl border border-border/60 text-xs font-mono text-text-primary my-1 hover:border-accent-primary/40 transition-luxury">
                <FileCode className="h-4 w-4 text-accent-primary shrink-0" />
                <span className="font-bold text-emerald-400">{cleanFileText.split(' ')[0]}</span>
                <span className="text-text-muted text-[11px] truncate">{cleanFileText.substring(cleanFileText.indexOf(' ') + 1)}</span>
              </div>
            );
          }

          // Stage Telemetry Lines (- **Phase)
          if (trimmed.startsWith('- **Phase') || trimmed.startsWith('* **Phase')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2.5 bg-surface-1 p-2.5 rounded-xl border border-border/80 text-xs font-mono my-1 shadow-2xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent-primary/20 text-accent-primary font-bold text-[10px] shrink-0 mt-0.5">
                  ✓
                </span>
                <div className="text-text-secondary leading-relaxed flex-1">
                  {parseInlineMarkdown(content)}
                </div>
              </div>
            );
          }

          // Key Metrics / Status Lines (Status:, QA Security Gate:, Integration Tests:)
          if (trimmed.startsWith('**Status:**') || trimmed.startsWith('**QA Security Gate:**') || trimmed.startsWith('**Integration Tests:**') || trimmed.startsWith('Status:') || trimmed.startsWith('QA Security Gate:')) {
            return (
              <div key={idx} className="inline-flex items-center gap-2 bg-accent-light/15 px-3 py-1.5 rounded-xl border border-accent-primary/30 font-mono text-xs text-text-primary my-1 mr-2 shadow-2xs">
                <span className="font-bold">{parseInlineMarkdown(trimmed)}</span>
              </div>
            );
          }

          // Standard Bullet Points (- or *)
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm pl-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-primary shrink-0 mt-2" />
                <div className="text-text-secondary leading-relaxed flex-1">
                  {parseInlineMarkdown(content)}
                </div>
              </div>
            );
          }

          // Code blocks or KV summary lines
          if (trimmed.startsWith('```')) {
            return (
              <div key={idx} className="font-mono text-xs bg-surface-2 p-3 rounded-xl border border-border text-emerald-400 font-semibold my-1.5 overflow-x-auto shadow-inner">
                {parseInlineMarkdown(trimmed)}
              </div>
            );
          }

          // Normal Paragraphs with inline bold support
          return (
            <p key={idx} className="text-xs md:text-sm text-text-primary leading-relaxed">
              {parseInlineMarkdown(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  const SUGGESTED_ACTIONS = [
    { title: 'Build Full Startup App', prompt: '/build Build School ERP Enterprise Application', icon: Rocket, category: 'Full SDLC' },
    { title: 'Run SDLC 5-Stage Audit', prompt: '/sdlc Audit System Architecture and Codebase', icon: Sparkles, category: 'SDLC Pipeline' },
    { title: 'Deep Web Research', prompt: '/research AI Agent Multi-Service Architecture', icon: Search, category: 'Research' },
    { title: 'Design System Architecture', prompt: '/arch Design OpenAPI v3 and pgvector Schema', icon: Layers, category: 'Architecture' },
    { title: 'Run QA & Security Scan', prompt: '/qa Audit Security Vulnerabilities and Secrets', icon: ShieldCheck, category: 'QA Gate' },
    { title: 'Search Vector RRF Memory', prompt: '/memory Retrieve RRF Context', icon: Database, category: 'Memory' },
  ];

  const hasMessages = activeSession?.messages && activeSession.messages.length > 0;

  return (
    <div className="flex h-full w-full overflow-hidden bg-background font-sans antialiased">
      {/* Notion-Style AI Workspace Navigator (260px) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/80 bg-sidebar p-3 space-y-4 select-none shrink-0 overflow-y-auto">
        <Button
          onClick={() => createNewSession('General')}
          variant="primary"
          size="sm"
          className="w-full justify-start rounded-xl font-semibold"
        >
          <Plus className="mr-2 h-4 w-4 stroke-[2]" /> New SDLC Session
        </Button>

        {/* Notion Folders & Session History */}
        <div className="space-y-3">
          {/* Section 1: Pinned */}
          <div className="space-y-1">
            <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Pin className="h-3 w-3 text-accent-primary" /> Pinned Sessions
            </h3>
            {sessions
              .filter((s) => s.isPinned)
              .map((sess) => (
                <div
                  key={sess.id}
                  className={`group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-luxury ${
                    activeSessionId === sess.id
                      ? 'bg-accent-light text-accent-primary font-bold'
                      : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                  }`}
                >
                  <button
                    onClick={() => setActiveSessionId(sess.id)}
                    className="flex items-center gap-2 truncate flex-1 text-left"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-accent-primary shrink-0 fill-accent-primary" />
                    <span className="truncate">{sess.title}</span>
                  </button>

                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePinSession(sess.id);
                      }}
                      className="p-1 hover:text-accent-primary rounded-lg"
                      title="Unpin Session"
                    >
                      <Pin className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Section 2: Execution Categories */}
          <div className="space-y-1 pt-2 border-t border-border/60">
            <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Folder className="h-3 w-3 text-accent-primary" /> SDLC Folders
            </h3>
            {['Full SDLC Builds', 'PRD Specs', 'Architecture Schemas', 'QA Audits'].map((folder, idx) => (
              <button
                key={idx}
                onClick={() => createNewSession('PRD')}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-luxury text-left"
              >
                <Folder className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span className="truncate">{folder}</span>
              </button>
            ))}
          </div>

          {/* Section 3: All Sessions */}
          <div className="space-y-1 pt-2 border-t border-border/60">
            <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Recent Sessions ({sessions.length})
            </h3>
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className={`group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-luxury ${
                  activeSessionId === sess.id
                    ? 'bg-accent-light text-accent-primary font-bold'
                    : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                }`}
              >
                <button
                  onClick={() => setActiveSessionId(sess.id)}
                  className="flex items-center gap-2 truncate flex-1 text-left"
                >
                  <Bookmark
                    className={`h-3.5 w-3.5 shrink-0 ${
                      sess.isPinned ? 'text-accent-primary fill-accent-primary' : 'text-text-muted'
                    }`}
                  />
                  <span className="truncate">{sess.title}</span>
                </button>

                <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePinSession(sess.id);
                    }}
                    className="p-1 hover:text-accent-primary rounded-lg"
                    title="Pin Session"
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(sess.id);
                      }}
                      className="p-1 hover:text-rose-500 rounded-lg"
                      title="Delete Session"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Center Execution Workspace (Max Width 900px, Centered) */}
      <main className="flex flex-1 flex-col justify-between overflow-hidden p-4 md:p-6">
        {/* Top AI Workspace Header Bar */}
        <div className="max-w-[900px] w-full mx-auto pb-3 mb-2 border-b border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-accent-primary" /> {activeSession?.title || 'AI Workspace Session'}
            </span>
            <Badge variant="accent" className="text-[10px] font-mono">{activeSession?.category || 'General'}</Badge>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 font-mono">
              ⚡ GOD MODE ACTIVE
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Prompt Optimizer Drawer Toggle */}
            <button
              onClick={() => setShowOptimizerDrawer(!showOptimizerDrawer)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-luxury ${
                showOptimizerDrawer
                  ? 'bg-accent-light border-accent-primary text-accent-primary'
                  : 'bg-surface-2 border-border text-text-muted hover:text-text-primary'
              }`}
            >
              <Zap className="h-3.5 w-3.5 text-accent-primary" />
              <span>Prompt Optimizer</span>
            </button>

            {/* Real-time AI Model Selector */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="h-8 rounded-xl border border-border bg-surface-2 px-2.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-primary font-mono cursor-pointer"
            >
              <option value="gemini-3.6-flash">Gemini 3.6 Flash (High Velocity)</option>
              <option value="gemini-3.6-pro">Gemini 3.6 Pro (Deep Reasoning)</option>
              <option value="gpt-4o">GPT-4o Enterprise</option>
              <option value="claude-3.5-sonnet">Claude 3.5 Sonnet (Code Audit)</option>
              <option value="deepseek-r1">DeepSeek R1 (Autonomous)</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={() => createNewSession('General')}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> New Session
            </Button>
          </div>
        </div>

        {/* Live Prompt Optimizer Drawer Box */}
        {showOptimizerDrawer && (
          <div className="max-w-[900px] w-full mx-auto mb-4 bg-surface-1 border-2 border-accent-primary/60 p-4 rounded-2xl space-y-3 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent-primary" />
                <span className="text-xs font-bold text-text-primary">Prompt Optimizer & Gap Analysis Engine</span>
                <Badge variant="accent" className="text-[10px] font-mono">Optimization Score: 98/100</Badge>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Target Tokens: ~1,450</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-text-muted uppercase">Detected Gaps & Resolved Constraints:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    ✓ Security & Auth Access Control
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    ✓ Neon pgvector RRF Memory Schema
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    ✓ Latency Target &lt; 150ms
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    ✓ 18-Stage SDLC Execution DAG
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-text-muted uppercase">Expanded Execution Plan:</span>
                <p className="text-[11px] font-mono text-text-secondary leading-tight bg-surface-2 p-2 rounded-xl border border-border/40">
                  Goal &rarr; Intent &rarr; Requirements &rarr; Context &rarr; Memory Search &rarr; Research &rarr; System Architecture &rarr; 18-Stage SDLC &rarr; QA Gate (Pass &ge;80)
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-6 max-w-[900px] w-full mx-auto pr-1">
          {/* Welcome Screen (When 0 Messages Exist) */}
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-8 select-none">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-1 shadow-sm text-accent-primary">
                <Cpu className="h-7 w-7 stroke-[1.75]" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                  AI Operating System Workspace
                </h1>
                <p className="text-base text-text-secondary">
                  Execute full startup app builds, SDLC 5-stage pipelines, deep research & code security audits.
                </p>
              </div>

              {/* Suggested Actions Grid */}
              <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                {SUGGESTED_ACTIONS.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => sendPrompt(action.prompt || action.title)}
                      className="flex flex-col justify-between rounded-2xl border border-border bg-surface-1 p-4 text-left hover:border-accent-primary hover:bg-surface-2 transition-luxury shadow-xs group"
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="h-4 w-4 text-accent-primary stroke-[1.75] group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-mono text-text-muted">{action.category}</span>
                      </div>
                      <span className="mt-3 text-xs font-bold text-text-primary leading-snug">
                        {action.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Quiet Luxury Conversation Stream */
            <div className="space-y-6 py-2">
              {activeSession.messages.map((msg, idx) => {
                const isPrevSameSender = idx > 0 && activeSession.messages[idx - 1].sender === msg.sender;

                if (msg.sender === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end my-3">
                      <div className="max-w-[70%] rounded-2xl bg-surface-2 text-text-primary border border-border/80 px-4 py-2.5 text-sm font-medium shadow-xs leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex gap-3.5 my-3">
                    {!isPrevSameSender ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-accent-light text-accent-primary shrink-0 shadow-xs mt-0.5">
                        <Bot className="h-4 w-4 stroke-[1.75]" />
                      </div>
                    ) : (
                      <div className="w-8 shrink-0" />
                    )}

                    <div className="flex-1 space-y-1">
                      {!isPrevSameSender && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-text-primary">Chief of Staff AI</span>
                          <span className="text-[10px] text-text-muted">{msg.timestamp}</span>
                        </div>
                      )}
                      {renderFormattedMessageText(msg.text)}
                    </div>
                  </div>
                );
              })}

              {/* Thinking / Progressive Phase Indicator */}
              {isThinking && (
                <div className="flex items-center gap-3 text-xs text-text-muted py-2 animate-pulse">
                  <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-accent-light text-accent-primary">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <span>{streamingPhase || 'Chief of Staff orchestrating 7 SDLC Departments...'}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Collapsible SDLC Multi-Department Execution Panel */}
          <WorkflowExecutionPanel />

          {/* Dynamic Connected Artifacts Previews */}
          {activeSession?.artifacts?.map((artifact) => (
            <ArtifactViewer
              key={artifact.id}
              title={artifact.title}
              type={artifact.type}
              content={artifact.content}
            />
          ))}
        </div>

        {/* Bottom Command Center Composer */}
        <div className="pt-4 shrink-0">
          <Composer onSend={(text) => sendPrompt(text)} />
        </div>
      </main>
    </div>
  );
};
