'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  FolderKanban,
  Plus,
  FileCode,
  Sparkles,
  LayoutGrid,
  List,
  Kanban,
  Search,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const ProjectsView: React.FC = () => {
  const [activeView, setActiveView] = useState<'grid' | 'list' | 'kanban'>('grid');
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
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
          <Button variant="primary" size="sm" className="font-semibold">
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((proj) => (
            <Card key={proj.id} className="flex flex-col justify-between bg-surface-1 p-6 hover:border-accent-primary/60 transition-luxury">
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
                <span>Budget: <strong className="text-text-primary">${proj.budgetSpentUsd} / ${proj.budgetAllocatedUsd}</strong></span>
                <ArrowUpRight className="h-4 w-4 text-text-muted stroke-[1.75]" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};
