'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../../../lib/api';
import PageHeader from '../../../components/PageHeader';
import { FileText, Plus, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => fetchApi('/documents'),
  });

  const uploadMutation = useMutation({
    mutationFn: (newDoc: { title: string; content: string }) =>
      fetchApi('/documents', {
        method: 'POST',
        body: JSON.stringify(newDoc),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setIsModalOpen(false);
      setTitle('');
      setContent('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    uploadMutation.mutate({ title, content });
  };

  return (
    <div className="space-y-6 select-none font-sans text-[#111827] dark:text-neutral-100">
      <PageHeader
        breadcrumb={['Workspace', 'Documents']}
        title="Document Repository"
        description="Structured documents ingested for long-term memory retrieval and semantic chunking"
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        }
      />

      <div className="p-6 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.06] rounded-2xl shadow-sm dark:shadow-none min-h-[350px]">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-[#F6F7F9] dark:bg-white/[0.03] rounded-xl"></div>
            <div className="h-16 bg-[#F6F7F9] dark:bg-white/[0.03] rounded-xl"></div>
          </div>
        ) : (data?.data || []).length === 0 ? (
          <div className="text-center py-16 text-[#6B7280] dark:text-neutral-400 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-[#2563EB]/40" />
            <h3 className="text-sm font-bold text-[#111827] dark:text-white">No Ingested Documents Found</h3>
            <p className="text-xs max-w-sm mx-auto">Upload technical documentation or specs to split into vector memory chunks.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 h-9 px-4 bg-[#2563EB] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Upload First Document</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {(data?.data || []).map((d: any) => (
              <div
                key={d.id}
                className="p-4 bg-[#F6F7F9] dark:bg-[#111111] hover:bg-[#F3F4F6] dark:hover:bg-[#202020] rounded-xl border border-[#E5E7EB] dark:border-white/[0.04] space-y-1.5 transition-colors"
              >
                <h3 className="font-bold text-xs text-[#2563EB] dark:text-blue-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  {d.title}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-neutral-400 leading-relaxed">{d.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 w-full max-w-md space-y-4 bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl shadow-2xl text-[#111827] dark:text-white font-sans text-xs"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#2563EB]" /> Upload Document
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-black dark:hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#6B7280] dark:text-neutral-400">Document Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. System Architecture Whitepaper"
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-[#6B7280] dark:text-neutral-400">Content / Specification Text</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    placeholder="Paste technical documentation or document content..."
                    className="w-full bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB] resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E7EB] dark:border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadMutation.isPending}
                    className="px-4 py-2 bg-[#2563EB] text-white rounded-xl font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadMutation.isPending ? 'Uploading...' : 'Ingest Document'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
