'use client';

import React, { useRef, useEffect } from 'react';
import { WorkflowExecutionPanel } from '@/components/workspace/WorkflowExecutionPanel';
import { Composer } from '@/components/workspace/Composer';
import { ArtifactViewer } from '@/components/workspace/ArtifactViewer';
import { Button } from '@/components/ui/Button';
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

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages?.length, isThinking, streamingPhase]);

  const QUICK_PROMPTS = [
    { title: 'Generate PRD Spec', icon: FileCode, category: 'Planning' },
    { title: 'Multi-Source Deep Research', icon: Sparkles, category: 'Research' },
    { title: 'Cloud Infrastructure Cost Matrix', icon: LineChart, category: 'Finance' },
    { title: 'Run QA & Security Scan', icon: ShieldCheck, category: 'Review' },
  ];

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Notion-Style AI Workspace Navigator (260px) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/80 bg-sidebar p-3 space-y-4 select-none shrink-0 overflow-y-auto">
        <Button
          onClick={() => createNewSession('General')}
          variant="primary"
          size="sm"
          className="w-full justify-start rounded-xl font-semibold"
        >
          <Plus className="mr-2 h-4 w-4 stroke-[2]" /> New Execution Session
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

          {/* Section 2: Workspace Folders */}
          <div className="space-y-1 pt-2 border-t border-border/60">
            <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Folder className="h-3 w-3 text-accent-primary" /> Execution Categories
            </h3>
            {['PRD Specs', 'Research Sessions', 'Planning Roadmaps', 'QA Audits'].map((folder, idx) => (
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
        <div className="flex-1 overflow-y-auto space-y-6 max-w-[900px] w-full mx-auto pr-1">
          {/* Quick Actions Cards Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_PROMPTS.map((prompt, idx) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => sendPrompt(prompt.title)}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-surface-1 p-3.5 text-left hover:border-accent-primary transition-luxury shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-4 w-4 text-accent-primary stroke-[1.75]" />
                    <span className="text-[10px] font-mono text-text-muted">{prompt.category}</span>
                  </div>
                  <span className="mt-2 text-xs font-bold text-text-primary leading-tight">
                    {prompt.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quiet Luxury Execution Canvas */}
          <div className="space-y-6 py-2">
            {activeSession?.messages?.map((msg, idx) => {
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
                    <p className="text-sm text-text-primary leading-relaxed font-sans">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Thinking / Streaming Phase Indicator */}
            {isThinking && (
              <div className="flex items-center gap-3 text-xs text-text-muted py-2 animate-pulse">
                <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-accent-light text-accent-primary">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </div>
                <span>{streamingPhase || 'Chief of Staff executing autonomous workflows...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Live Multi-Agent Execution Progress Panel */}
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
