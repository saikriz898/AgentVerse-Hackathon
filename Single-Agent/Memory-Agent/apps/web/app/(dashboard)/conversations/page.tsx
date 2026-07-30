'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import { MessageSquare, Plus, Send, X, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConversationsPage() {
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    { sender: 'agent', text: 'Hello! I am your Memory Agent runtime. How can I assist you with your workspace context today?', time: 'Just now' },
  ]);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => fetchApi('/conversations'),
  });

  const createMutation = useMutation({
    mutationFn: (title: string) =>
      fetchApi('/conversations', {
        method: 'POST',
        body: JSON.stringify({ title: title || 'New Agent Chat Session' }),
      }),
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setIsNewModalOpen(false);
      setNewTitle('');
      setSelectedConv(newSession?.data || newSession);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: 'Just now' }]);
    setChatMessage('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: `Context indexed for query: "${userMsg}". Workspace memories and graph nodes have been automatically updated.`,
          time: 'Just now',
        },
      ]);
    }, 600);
  };

  return (
    <div className="h-full flex flex-col justify-between select-none font-sans text-[#111827] dark:text-neutral-100 overflow-hidden">
      <div className="shrink-0 pb-2 border-b border-[#E5E7EB] dark:border-white/[0.04]">
        <PageHeader
          breadcrumb={['Workspace', 'Conversations']}
          title="Conversations Vault"
          description="Agent chat sessions, dialogue logs, and automatic memory summarization streams"
          actions={
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="h-10 px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>
          }
        />
      </div>

      <div className="flex-1 my-3 overflow-y-auto pr-1">
        <div className="p-6 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl shadow-sm dark:shadow-none min-h-[400px]">
          {isLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-16 bg-[#F6F7F9] dark:bg-white/[0.03] rounded-xl"></div>
              <div className="h-16 bg-[#F6F7F9] dark:bg-white/[0.03] rounded-xl"></div>
            </div>
          ) : (data?.data || []).length === 0 ? (
            <div className="text-center py-16 text-[#6B7280] dark:text-neutral-400 space-y-3">
              <MessageSquare className="w-12 h-12 mx-auto text-[#2563EB]/40" />
              <h3 className="text-sm font-bold text-[#111827] dark:text-white">No Active Conversation Streams</h3>
              <p className="text-xs max-w-sm mx-auto">Start a new agent session to interact with your workspace memory graph and AI engines.</p>
              <button
                onClick={() => setIsNewModalOpen(true)}
                className="mt-2 h-9 px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Start First Conversation</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {(data?.data || []).map((conv: any) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className="p-4 bg-[#F6F7F9] dark:bg-[#111111] hover:bg-[#F3F4F6] dark:hover:bg-[#202020] rounded-xl border border-[#E5E7EB] dark:border-white/[0.04] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-xs text-[#2563EB] dark:text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      {conv.title || 'Agent Chat Session'}
                    </h3>
                    <p className="text-xs text-[#6B7280] dark:text-neutral-400 mt-1">{conv.summary || 'Active interactive workspace session'}</p>
                  </div>
                  <span className="text-[11px] font-mono text-[#6B7280] dark:text-neutral-500">{new Date(conv.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 w-full max-w-md space-y-4 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl shadow-2xl text-[#111827] dark:text-white font-sans text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-3">
                <h3 className="text-sm font-bold">Start New Conversation</h3>
                <button onClick={() => setIsNewModalOpen(false)} className="p-1 text-gray-400 hover:text-black dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold text-[#6B7280] dark:text-neutral-400">Session Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Architecture Overview Discussion"
                  className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7EB] dark:border-white/[0.06]">
                <button
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createMutation.mutate(newTitle)}
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-[#2563EB] text-white rounded-xl font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{createMutation.isPending ? 'Starting...' : 'Create Session'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Chat Session Drawer */}
      <AnimatePresence>
        {selectedConv && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end font-sans text-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-lg bg-white dark:bg-[#0D0D11] border-l border-[#E5E7EB] dark:border-white/[0.08] p-5 h-full flex flex-col justify-between space-y-4 text-[#111827] dark:text-gray-200 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#2563EB]" />
                  <div>
                    <h3 className="font-bold text-sm text-[#111827] dark:text-white">{selectedConv.title || 'Agent Session'}</h3>
                    <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">ACTIVE MEMORY CONTEXT STREAM</p>
                  </div>
                </div>
                <button onClick={() => setSelectedConv(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded">
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        m.sender === 'user' ? 'bg-[#2563EB] text-white' : 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {m.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-[#F9FAFB] dark:bg-[#14151B] border border-[#E5E7EB] dark:border-white/[0.06] text-[#111827] dark:text-gray-200'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span className="text-[9px] opacity-60 font-mono mt-1 block text-right">{m.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-2 border-t border-[#E5E7EB] dark:border-white/[0.08] flex items-center gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask agent or pass memory query..."
                  className="flex-1 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB] text-[#111827] dark:text-white"
                />
                <button type="submit" className="h-9 px-3 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl font-bold flex items-center gap-1.5 shrink-0">
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
