'use client';

import React, { useState } from 'react';
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
  Calendar,
  Search,
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  User,
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const [activeView, setActiveView] = useState<'grid' | 'list' | 'kanban'>('grid');

  const PROJECTS = [
    {
      id: 'proj-1',
      title: 'LifeOS Autonomous Engine V1',
      description: 'Chief of Staff orchestration platform combining 6 specialist AI agent microservices into a unified workspace.',
      status: 'In Progress',
      progress: 85,
      health: 'Optimal (94%)',
      budget: '$4,200 / $5,000',
      owner: 'Saikriz',
      members: ['S', 'A', 'M'],
      priority: 'High',
      tags: ['AI Engine', 'Next.js', 'LangGraph'],
      aiRecommendation: 'Execute Review Agent security scan prior to production release.',
    },
    {
      id: 'proj-2',
      title: 'Reciprocal Rank Fusion Memory',
      description: '768-dimensional hybrid vector search engine with Neon PostgreSQL pgvector and BM25 rank fusion.',
      status: 'Completed',
      progress: 100,
      health: 'Optimal (98%)',
      budget: '$1,800 / $2,000',
      owner: 'Dr. Suresh Kumar',
      members: ['S', 'D'],
      priority: 'Urgent',
      tags: ['pgvector', 'RRF', 'FastAPI'],
      aiRecommendation: 'Vector index synced and 0-latency cache verified.',
    },
    {
      id: 'proj-3',
      title: 'Cloud Infrastructure Price Matrix',
      description: 'Real-time multi-cloud price estimator comparing AWS, GCP, and Azure instance tariffs with ROI forecasting.',
      status: 'Planning',
      progress: 35,
      health: 'Review Needed',
      budget: '$800 / $3,500',
      owner: 'Saikriz',
      members: ['F', 'A'],
      priority: 'Medium',
      tags: ['FastAPI', 'Recharts', 'Finance'],
      aiRecommendation: 'Finance Agent estimating 24% cost saving on spot instances.',
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Hero Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Project Workspace</Badge>
            <Badge variant="outline">AI Assisted</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Projects
          </h1>
          <p className="text-sm text-text-secondary">
            Plan, organize and deliver enterprise work with autonomous AI assistance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm">
            <FileCode className="mr-2 h-4 w-4 stroke-[1.75]" /> Generate PRD
          </Button>
          <Button variant="outline" size="sm">
            <Sparkles className="mr-2 h-4 w-4 stroke-[1.75]" /> AI Planning
          </Button>
          <Button variant="primary" size="sm" className="font-semibold">
            <Plus className="mr-2 h-4 w-4 stroke-[2]" /> New Project
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Total Projects</span>
          <p className="mt-1 text-2xl font-bold text-text-primary">12</p>
          <span className="text-[11px] text-text-secondary">Active Workspaces</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Running</span>
          <p className="mt-1 text-2xl font-bold text-emerald-500">8</p>
          <span className="text-[11px] text-emerald-500 font-semibold">On Track</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Completed</span>
          <p className="mt-1 text-2xl font-bold text-text-primary">3</p>
          <span className="text-[11px] text-text-secondary">Shipped to Main</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Overdue</span>
          <p className="mt-1 text-2xl font-bold text-amber-500">1</p>
          <span className="text-[11px] text-amber-500 font-semibold">Review Pending</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Avg Completion</span>
          <p className="mt-1 text-2xl font-bold text-accent-primary">78%</p>
          <span className="text-[11px] text-text-secondary">Sprint Velocity</span>
        </Card>
      </div>

      {/* Search Bar & View Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted stroke-[1.75]" />
          <input
            type="text"
            placeholder="Search projects or tags..."
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
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs transition-luxury ${
                activeView === 'list' ? 'bg-surface-1 text-text-primary shadow-xs font-bold' : 'text-text-muted'
              }`}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActiveView('kanban')}
              className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs transition-luxury ${
                activeView === 'kanban' ? 'bg-surface-1 text-text-primary shadow-xs font-bold' : 'text-text-muted'
              }`}
              title="Kanban View"
            >
              <Kanban className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Cards Catalog */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((proj) => (
          <Card key={proj.id} className="flex flex-col justify-between bg-surface-1 p-6 hover:border-accent-primary/60 transition-luxury">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent-light text-accent-primary">
                    <FolderKanban className="h-4 w-4 stroke-[1.75]" />
                  </div>
                  <span className="text-sm font-bold text-text-primary">{proj.title}</span>
                </div>
                <Badge variant={proj.status === 'Completed' ? 'success' : proj.status === 'In Progress' ? 'accent' : 'outline'}>
                  {proj.status}
                </Badge>
              </div>

              <p className="mt-3 text-xs text-text-secondary leading-relaxed">
                {proj.description}
              </p>

              {/* Progress Bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-text-muted">Progress</span>
                  <span className="text-text-primary">{proj.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
                  <div
                    className="h-full bg-accent-primary rounded-full transition-all duration-300"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>

              {/* AI Recommendation Widget */}
              <div className="mt-4 rounded-xl border border-accent-primary/20 bg-accent-light/10 p-2.5 flex items-start gap-2 text-[11px] text-text-secondary">
                <Sparkles className="h-3.5 w-3.5 text-accent-primary shrink-0 mt-0.5" />
                <span>{proj.aiRecommendation}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-text-muted">
              <span>Budget: <strong className="text-text-primary">{proj.budget}</strong></span>
              <ArrowUpRight className="h-4 w-4 text-text-muted stroke-[1.75]" />
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};
