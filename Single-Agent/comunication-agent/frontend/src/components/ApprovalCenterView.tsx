import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Check,
  X,
  UserPlus,
  Zap,
  Activity,
  History
} from 'lucide-react';

export interface ApprovalItem {
  id: string;
  title: string;
  channel: string;
  author: string;
  approver: string;
  approval_level: 'Level 1 (Lead)' | 'Level 2 (Director)' | 'Level 3 (Executive)';
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
  content_preview: string;
  comments?: string[];
}

export const ApprovalCenterView: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([
    {
      id: 'app_101',
      title: 'Q3 Executive Earnings Communication Dispatch',
      channel: 'Email & Slack',
      author: 'ChiefOfStaff',
      approver: 'Executive Director',
      approval_level: 'Level 3 (Executive)',
      status: 'Pending',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      content_preview: 'Dear Shareholders, Q3 financial performance metrics have exceeded initial forecasts by 14%...',
      comments: ['Level 1 Lead Approved: Looks solid.', 'Level 2 Director Approved: Verified metrics.']
    },
    {
      id: 'app_102',
      title: 'System Maintenance Window Escalation Alert',
      channel: 'Microsoft Teams & Push',
      author: 'DevOps Lead',
      approver: 'Engineering Lead',
      approval_level: 'Level 1 (Lead)',
      status: 'Pending',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      content_preview: 'Scheduled database migration window starting at 02:00 UTC. System access will be transiently affected...',
      comments: ['Pending initial technical sanity check.']
    },
    {
      id: 'app_103',
      title: 'Global Product Update Newsletter',
      channel: 'Email',
      author: 'Marketing Agent',
      approver: 'VP Marketing',
      approval_level: 'Level 2 (Director)',
      status: 'Approved',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      content_preview: 'Exciting news! Version 2.0 of LifeOS Communication Operations Center is now live...',
      comments: ['Approved by VP Marketing on 2026-07-28']
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalItem | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Reassign Modal State
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [newApprover, setNewApprover] = useState('');

  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, status: 'Approved', comments: [...(item.comments || []), `Approved by Current User at ${new Date().toLocaleTimeString()}`] };
        }
        return item;
      })
    );
  };

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, status: 'Rejected', comments: [...(item.comments || []), `Rejected by Current User at ${new Date().toLocaleTimeString()}`] };
        }
        return item;
      })
    );
  };

  const handleEmergencyOverride = (id: string) => {
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, status: 'Approved', comments: [...(item.comments || []), `[EMERGENCY OVERRIDE] Approved by Admin at ${new Date().toLocaleTimeString()}`] };
        }
        return item;
      })
    );
  };

  const handleAddComment = () => {
    if (!commentInput.trim() || !selectedApproval) return;
    const text = commentInput.trim();
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id === selectedApproval.id) {
          const updatedComments = [...(item.comments || []), `User: ${text}`];
          setSelectedApproval({ ...item, comments: updatedComments });
          return { ...item, comments: updatedComments };
        }
        return item;
      })
    );
    setCommentInput('');
  };

  const handleReassignApprover = () => {
    if (!newApprover.trim() || !selectedApproval) return;
    const approverName = newApprover.trim();
    setApprovals((prev) =>
      prev.map((item) => {
        if (item.id === selectedApproval.id) {
          return { ...item, approver: approverName };
        }
        return item;
      })
    );
    setIsReassignOpen(false);
    setNewApprover('');
  };

  const filteredApprovals = approvals.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = item.title.toLowerCase().includes(q);
      const matchesAuthor = item.author.toLowerCase().includes(q);
      if (!matchesTitle && !matchesAuthor) return false;
    }
    return true;
  });

  const pendingCount = approvals.filter((i) => i.status === 'Pending').length;
  const approvedCount = approvals.filter((i) => i.status === 'Approved').length;
  const rejectedCount = approvals.filter((i) => i.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2.5 tracking-tight">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
            <span>Communication Approval Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise multi-level governance, approval workflows, comments timeline, and emergency override controls.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-full flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingCount} Awaiting Approval</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Pending Approvals</span>
          <span className="text-xl font-extrabold text-amber-400">{pendingCount}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Approved Communications</span>
          <span className="text-xl font-extrabold text-emerald-400">{approvedCount}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Rejected Items</span>
          <span className="text-xl font-extrabold text-rose-400">{rejectedCount}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Governance Compliance</span>
          <span className="text-base font-bold text-sky-400">100% Verified</span>
        </div>
      </div>

      {/* Toolbar: Search & Filter Tabs */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === 'all' ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({approvals.length})
            </button>

            <button
              onClick={() => setFilterStatus('Pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending ({pendingCount})
            </button>

            <button
              onClick={() => setFilterStatus('Approved')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Approved ({approvedCount})
            </button>

            <button
              onClick={() => setFilterStatus('Rejected')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStatus === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search approvals by title or author..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Approval Items Workspace */}
      <div className="space-y-4">
        {filteredApprovals.map((item) => (
          <div key={item.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    {item.id}
                  </span>
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {item.approval_level}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
                <span className="text-xs text-slate-400 block font-mono">
                  Author: <strong className="text-slate-200">{item.author}</strong> • Approver: <strong className="text-amber-400">{item.approver}</strong> • Channel: {item.channel}
                </span>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                item.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {item.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-sans leading-relaxed">
              "{item.content_preview}"
            </p>

            {/* Approval History Timeline */}
            {item.comments && item.comments.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Approval History & Timeline</span>
                {item.comments.map((c, i) => (
                  <div key={i} className="text-[11px] font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                    {c}
                  </div>
                ))}
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedApproval(item)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                <span>Comments & Details</span>
              </button>

              {item.status === 'Pending' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedApproval(item);
                      setIsReassignOpen(true);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Reassign
                  </button>

                  <button
                    onClick={() => handleEmergencyOverride(item.id)}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
                    title="Admin Emergency Override"
                  >
                    Emergency Override
                  </button>

                  <button
                    onClick={() => handleReject(item.id)}
                    className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => handleApprove(item.id)}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer flex items-center space-x-1 shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Details & Comments Modal */}
      {selectedApproval && !isReassignOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">{selectedApproval.title}</h3>
              <button onClick={() => setSelectedApproval(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans text-slate-300">
              <p className="bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                "{selectedApproval.content_preview}"
              </p>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Add Approval Comment</span>
                <textarea
                  rows={3}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Enter governance comment or change request..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setSelectedApproval(null)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">
                Close
              </button>
              <button onClick={handleAddComment} className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition">
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Approver Modal */}
      {isReassignOpen && selectedApproval && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-purple-400" />
                <span>Reassign Approver</span>
              </h3>
              <button onClick={() => setIsReassignOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">New Approver Name / Email</label>
              <input
                type="text"
                value={newApprover}
                onChange={(e) => setNewApprover(e.target.value)}
                placeholder="e.g. Chief Risk Officer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setIsReassignOpen(false)} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">
                Cancel
              </button>
              <button onClick={handleReassignApprover} className="px-4 py-1.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl text-xs transition">
                Reassign Approver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
