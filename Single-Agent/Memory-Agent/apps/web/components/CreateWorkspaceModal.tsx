'use client';

import { useState } from 'react';
import { Building2, User, FlaskConical, Users, Gift, Briefcase, Sparkles, X } from 'lucide-react';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (workspace: { name: string; icon: string; type: string; description: string }) => void;
}

export default function CreateWorkspaceModal({ isOpen, onClose, onCreate }: CreateWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('building');
  const [type, setType] = useState('Private');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const icons = [
    { id: 'building', icon: Building2, label: 'Building' },
    { id: 'user', icon: User, label: 'Personal' },
    { id: 'flask', icon: FlaskConical, label: 'Research' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'gift', icon: Gift, label: 'Demo' },
    { id: 'briefcase', icon: Briefcase, label: 'Client' },
    { id: 'sparkles', icon: Sparkles, label: 'AI' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (onCreate) {
      onCreate({ name, icon: selectedIcon, type, description });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4 select-none">
      <div className="w-full max-w-md bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 text-[#111827] dark:text-white">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-white/[0.06] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111827] dark:text-white">Create Workspace</h2>
            <p className="text-xs text-[#6B7280] dark:text-neutral-400">Add a new isolated workspace for your team or projects</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.06] text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Workspace Name */}
          <div className="space-y-1.5">
            <label className="font-medium text-[#111827] dark:text-neutral-300">Workspace Name</label>
            <input
              type="text"
              placeholder="e.g. Research & Development"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] focus:border-[#2563EB] rounded-xl text-[#111827] dark:text-white placeholder-[#9CA3AF] dark:placeholder-neutral-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Workspace Icon Picker Grid */}
          <div className="space-y-1.5">
            <label className="font-medium text-[#111827] dark:text-neutral-300">Workspace Icon</label>
            <div className="grid grid-cols-7 gap-2">
              {icons.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIcon(item.id)}
                    className={`h-10 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#2563EB]/15 border-[#2563EB] text-[#2563EB] dark:text-blue-300 font-bold'
                        : 'bg-[#F6F7F9] dark:bg-[#111111] border-[#E5E7EB] dark:border-white/[0.06] text-[#6B7280] dark:text-neutral-400 hover:text-[#111827] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#202020]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workspace Type Dropdown */}
          <div className="space-y-1.5">
            <label className="font-medium text-[#111827] dark:text-neutral-300">Workspace Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] focus:border-[#2563EB] rounded-xl text-[#111827] dark:text-white focus:outline-none transition-colors"
            >
              <option value="Private">Private (Only Me)</option>
              <option value="Shared">Shared (Team Members)</option>
              <option value="Enterprise">Enterprise (Organization-wide)</option>
            </select>
          </div>

          {/* Workspace Description */}
          <div className="space-y-1.5">
            <label className="font-medium text-[#111827] dark:text-neutral-300">Description (Optional)</label>
            <textarea
              placeholder="Brief summary of this workspace purpose..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] focus:border-[#2563EB] rounded-xl text-[#111827] dark:text-white placeholder-[#9CA3AF] dark:placeholder-neutral-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB] dark:border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 bg-[#F6F7F9] dark:bg-[#111111] hover:bg-[#F3F4F6] dark:hover:bg-[#202020] border border-[#E5E7EB] dark:border-white/[0.06] rounded-xl font-medium text-[#6B7280] dark:text-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 bg-[#2563EB] hover:bg-blue-600 rounded-xl font-semibold text-white transition-all shadow-none"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
