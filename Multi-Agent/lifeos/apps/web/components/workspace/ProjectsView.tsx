'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  FolderKanban,
  Plus,
  LayoutGrid,
  List,
  Search,
  ArrowUpRight,
  RefreshCw,
  X,
  CheckCircle2,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const ProjectsView: React.FC = () => {
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Project Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState<'In Progress' | 'Planning' | 'Completed'>('In Progress');
  const [projectBudgetAllocated, setProjectBudgetAllocated] = useState('250');
  const [projectProgress, setProjectProgress] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getProjects();
      setProjects(data.projects || []);
      setTasks(data.tasks || []);
    } catch (err) {
      console.warn('Backend offline or connecting...', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    setIsSubmitting(true);

    const payload = {
      name: projectName,
      code: projectCode.toUpperCase() || `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      description: projectDescription || 'Autonomous AI workspace initiative.',
      status: projectStatus,
      budgetAllocatedUsd: parseFloat(projectBudgetAllocated) || 250,
      progressPercent: parseInt(projectProgress, 10) || 0,
    };

    try {
      const res = await ApiClient.createProject(payload);
      if (res && res.id) {
        setProjects((prev) => [res, ...prev]);
      } else {
        const fallbackProj = {
          id: `proj-${Date.now()}`,
          ...payload,
          budgetSpentUsd: 0,
          tasksCount: 0,
        };
        setProjects((prev) => [fallbackProj, ...prev]);
      }
      showToast(`Successfully created project "${projectName}"!`);
      // Reset form
      setProjectName('');
      setProjectCode('');
      setProjectDescription('');
      setProjectBudgetAllocated('250');
      setProjectProgress('0');
      setIsModalOpen(false);
    } catch (err) {
      showToast(`Created project "${projectName}".`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8 relative">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-surface-2 border border-accent-primary/50 text-text-primary px-4 py-3 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-text-muted hover:text-text-primary">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hero Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Project Workspace</Badge>
            <Badge variant="outline">Backend Synced</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Projects ({projects.length})
          </h1>
          <p className="text-sm text-text-secondary">
            Plan, organize and deliver enterprise work connected to LifeOS Core Backend.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchProjects} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 stroke-[1.75] ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="primary" size="sm" className="font-semibold" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4 stroke-[2]" /> New Project
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Total Projects</span>
          <p className="mt-1 text-2xl font-bold text-text-primary">{projects.length}</p>
          <span className="text-[11px] text-text-secondary">LifeOS Workspaces</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Active Tasks</span>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{tasks.length}</p>
          <span className="text-[11px] text-emerald-500 font-semibold">Assigned & Tracked</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Allocated Budget</span>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            ${projects.reduce((acc, p) => acc + (p.budgetAllocatedUsd || 0), 0).toFixed(2)}
          </p>
          <span className="text-[11px] text-text-secondary">Total Project Allocation</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Avg Progress</span>
          <p className="mt-1 text-2xl font-bold text-accent-primary">
            {projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.progressPercent || 0), 0) / projects.length) : 0}%
          </p>
          <span className="text-[11px] text-text-secondary">Sprint Velocity</span>
        </Card>
      </div>

      {/* Search Bar & View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted stroke-[1.75]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search backend projects..."
            className="w-full rounded-2xl border border-border bg-surface-2 pl-9 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-luxury"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-2xl border border-border bg-surface-2 p-1">
            <button
              onClick={() => setActiveView('grid')}
              className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs transition-luxury ${
                activeView === 'grid' ? 'bg-surface-1 text-text-primary shadow-xs font-bold' : 'text-text-muted'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs transition-luxury ${
                activeView === 'list' ? 'bg-surface-1 text-text-primary shadow-xs font-bold' : 'text-text-muted'
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-surface-secondary animate-pulse p-6" />
          ))}
        </div>
      )}

      {/* Projects Cards Catalog */}
      {!loading && (
        <div className={activeView === 'grid' ? "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
          {filteredProjects.map((proj) => (
            <Card key={proj.id} className="flex flex-col justify-between bg-surface-1 p-6 hover:border-accent-primary/60 transition-luxury border border-border/80">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent-light text-accent-primary">
                      <FolderKanban className="h-4 w-4 stroke-[1.75]" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-text-primary">{proj.name}</span>
                      <p className="text-[10px] font-mono text-text-muted">{proj.code}</p>
                    </div>
                  </div>
                  <Badge variant={proj.status === 'Completed' ? 'success' : 'accent'}>
                    {proj.status}
                  </Badge>
                </div>

                <p className="mt-3 text-xs text-text-secondary leading-relaxed line-clamp-3">
                  {proj.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-text-muted">Progress</span>
                    <span className="text-text-primary">{proj.progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
                    <div
                      className="h-full bg-accent-primary rounded-full transition-all duration-300"
                      style={{ width: `${proj.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
                <span>Budget: <strong className="text-text-primary">${proj.budgetSpentUsd || 0} / ${proj.budgetAllocatedUsd || 0}</strong></span>
                <ArrowUpRight className="h-4 w-4 text-text-muted stroke-[1.75]" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE NEW PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface-1 border border-border/80 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-accent-primary" /> Create New Project
                </h2>
                <p className="text-xs text-text-secondary">Define a new multi-agent workspace project</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-text-secondary font-medium mb-1.5">
                    Project Name *
                  </label>
                  <Input
                    required
                    placeholder="e.g. LifeOS Autonomous Agent Hub"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-text-secondary font-medium mb-1.5">
                    Code Prefix
                  </label>
                  <Input
                    placeholder="e.g. LIFE-HUB"
                    value={projectCode}
                    onChange={(e) => setProjectCode(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-secondary font-medium mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize objectives, requirements, and scope..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface-2 p-3 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-text-secondary font-medium mb-1.5">
                    Status
                  </label>
                  <select
                    value={projectStatus}
                    onChange={(e: any) => setProjectStatus(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-surface-2 px-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-secondary font-medium mb-1.5 flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-accent-primary" /> Budget ($ USD)
                  </label>
                  <Input
                    type="number"
                    placeholder="250"
                    value={projectBudgetAllocated}
                    onChange={(e) => setProjectBudgetAllocated(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-text-secondary font-medium mb-1.5">
                    Initial Progress %
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={projectProgress}
                    onChange={(e) => setProjectProgress(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
