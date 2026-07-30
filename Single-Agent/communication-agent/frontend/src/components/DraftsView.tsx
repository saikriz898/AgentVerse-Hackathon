import React, { useState } from 'react';
import {
  FileEdit,
  Save,
  Sparkles,
  RotateCcw,
  Copy,
  Trash2,
  Clock,
  CheckCircle2,
  Edit3,
  Search,
  Plus
} from 'lucide-react';

export interface DraftItem {
  id: string;
  title: string;
  channel: string;
  target_audience: string;
  content: string;
  version: string;
  updated_at: string;
  is_ai_generated?: boolean;
}

interface DraftsViewProps {
  onContinueEditing?: (draft: DraftItem) => void;
}

export const DraftsView: React.FC<DraftsViewProps> = ({ onContinueEditing }) => {
  const [drafts, setDrafts] = useState<DraftItem[]>([
    {
      id: 'd_201',
      title: 'Q3 Product Launch Announcement (Draft)',
      channel: 'Email & LinkedIn',
      target_audience: 'Executive Leadership',
      content: 'We are thrilled to announce the upcoming launch of LifeOS 2.0 Agentic Architecture...',
      version: 'v1.2',
      updated_at: new Date(Date.now() - 300000).toISOString(),
      is_ai_generated: true
    },
    {
      id: 'd_202',
      title: 'Internal Engineering All-Hands Invite',
      channel: 'Slack & Teams',
      target_audience: 'Engineering Team',
      content: 'Hey team! Join us this Friday at 15:00 UTC for our monthly engineering demo...',
      version: 'v1.0',
      updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      is_ai_generated: false
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState('Saved 2s ago');

  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDuplicateDraft = (draft: DraftItem) => {
    const dup: DraftItem = {
      ...draft,
      id: `d_${Date.now()}`,
      title: `Copy of ${draft.title}`,
      version: 'v1.0',
      updated_at: new Date().toISOString()
    };
    setDrafts([dup, ...drafts]);
  };

  const filteredDrafts = drafts.filter((d) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = d.title.toLowerCase().includes(q);
      const matchesChannel = d.channel.toLowerCase().includes(q);
      if (!matchesTitle && !matchesChannel) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2.5 tracking-tight">
            <FileEdit className="w-6 h-6 text-sky-400" />
            <span>Unfinished & AI-Generated Drafts</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Auto-saved drafts workspace with version history, draft recovery, and 1-click continuation in Transformation Studio.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Auto-Save Active ({autoSaveStatus})</span>
          </span>
        </div>
      </div>

      {/* Toolbar: Search */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drafts by title or channel..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>

        <span className="text-xs text-slate-400 font-mono font-semibold">Total Drafts: {drafts.length}</span>
      </div>

      {/* Draft Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrafts.map((draft) => (
          <div key={draft.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {draft.id}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">{draft.version}</span>
                    {draft.is_ai_generated && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Draft</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-1">{draft.title}</h3>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    Channel: {draft.channel} • Audience: {draft.target_audience}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 font-sans leading-relaxed truncate">
                "{draft.content}"
              </p>
            </div>

            {/* Action Toolbar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">Updated: {new Date(draft.updated_at).toLocaleTimeString()}</span>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => handleDuplicateDraft(draft)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition"
                  title="Duplicate Draft"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDeleteDraft(draft.id)}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30 transition"
                  title="Delete Draft"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onContinueEditing && onContinueEditing(draft)}
                  className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 transition cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Continue Editing</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
