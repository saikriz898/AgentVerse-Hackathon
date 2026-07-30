'use client';

import React, { useState } from 'react';
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
  User,
  Loader2,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'chief_of_staff';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export const AIWorkspaceView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'chief_of_staff',
      text: 'Good afternoon. I have loaded your system context and memory partitions. How would you like us to proceed on the LifeOS Autonomous Platform architecture?',
      timestamp: '12:42 PM',
    },
    {
      id: 'msg-2',
      sender: 'chief_of_staff',
      text: 'The 6 specialist agents are standing by to execute deep research, project planning, cost estimation, and document synthesis.',
      timestamp: '12:43 PM',
    },
  ]);

  const [isThinking, setIsThinking] = useState(false);

  const QUICK_PROMPTS = [
    { title: 'Generate PRD Spec', icon: FileCode, category: 'Planning' },
    { title: 'Multi-Source Deep Research', icon: Sparkles, category: 'Research' },
    { title: 'Cloud Infrastructure Cost Matrix', icon: LineChart, category: 'Finance' },
    { title: 'Run QA & Security Scan', icon: ShieldCheck, category: 'Review' },
  ];

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'chief_of_staff',
        text: `Understood. Orchestrating specialist agents to process: "${text}". Memory vector loaded and multi-agent pipeline initiated.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Notion-Style Left Conversation & Prompt Panel (250px) */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border/80 bg-sidebar p-3 space-y-4 select-none shrink-0 overflow-y-auto">
        <Button variant="primary" size="sm" className="w-full justify-start rounded-xl font-semibold">
          <Plus className="mr-2 h-4 w-4 stroke-[2]" /> New Session
        </Button>

        {/* Pinned Sessions */}
        <div className="space-y-1">
          <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Pinned Workspace Sessions
          </h3>
          {[
            { title: 'LifeOS Architecture V1', time: '2h ago' },
            { title: 'Cloud Price Optimization', time: '1d ago' },
            { title: 'LangGraph Roadmap Spec', time: '3d ago' },
          ].map((sess, idx) => (
            <button
              key={idx}
              className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-luxury"
            >
              <div className="flex items-center gap-2 truncate">
                <Bookmark className="h-3.5 w-3.5 text-accent-primary shrink-0" />
                <span className="truncate">{sess.title}</span>
              </div>
              <span className="text-[10px] text-text-muted">{sess.time}</span>
            </button>
          ))}
        </div>

        {/* Quick Prompt Starters */}
        <div className="space-y-1 pt-2 border-t border-border/60">
          <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Orchestrator Prompts
          </h3>
          {QUICK_PROMPTS.map((prompt, idx) => {
            const Icon = prompt.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.title)}
                className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-text-secondary hover:bg-accent-light hover:text-accent-primary transition-luxury text-left"
              >
                <Icon className="h-4 w-4 text-accent-primary shrink-0 stroke-[1.75]" />
                <span className="truncate">{prompt.title}</span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Center Natural Conversation Canvas (Max Width 900px, Centered) */}
      <main className="flex flex-1 flex-col justify-between overflow-hidden p-4 md:p-6">
        <div className="flex-1 overflow-y-auto space-y-6 max-w-[900px] w-full mx-auto pr-1">
          {/* Quick Actions Cards Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_PROMPTS.map((prompt, idx) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt.title)}
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

          {/* Natural Grouped Conversation Canvas (No Cards, Natural Flow) */}
          <div className="space-y-6 py-2">
            {messages.map((msg, idx) => {
              const isPrevSameSender = idx > 0 && messages[idx - 1].sender === msg.sender;

              if (msg.sender === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end my-3">
                    <div className="max-w-[70%] rounded-2xl bg-accent-primary text-white px-4 py-2.5 text-sm font-medium shadow-sm leading-relaxed">
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

            {/* Thinking / Streaming Indicator */}
            {isThinking && (
              <div className="flex items-center gap-3 text-xs text-text-muted py-2 animate-pulse">
                <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-accent-light text-accent-primary">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </div>
                <span>Chief of Staff thinking & orchestrating specialist agents...</span>
              </div>
            )}
          </div>

          {/* Live Multi-Agent Execution Panel */}
          <WorkflowExecutionPanel />

          {/* Inline Sample Artifact Preview */}
          <ArtifactViewer
            title="lifeos-architecture-spec.json"
            type="json"
            content={`{
  "system": "LifeOS Multi-Agent Platform",
  "orchestrator": "Chief of Staff AI",
  "specialist_agents": [
    "Research Agent",
    "Planning Agent",
    "Finance Agent",
    "Memory Agent",
    "Review Agent",
    "Communication Agent"
  ],
  "qa_approval_threshold": 80,
  "vector_search": "Reciprocal Rank Fusion (768-dim + BM25)"
}`}
          />
        </div>

        {/* Bottom Composer */}
        <div className="pt-4 shrink-0">
          <Composer onSend={handleSendMessage} />
        </div>
      </main>
    </div>
  );
};
