'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  CheckSquare,
  Plus,
  Sparkles,
  RefreshCw,
  Search,
} from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getProjects();
      setTasks(data.tasks || []);
    } catch (err) {
      console.warn('Tasks API fallback...', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Hero Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Execution Engine</Badge>
            <Badge variant="outline" className="font-mono">Backend Connected</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Tasks ({tasks.length})
          </h1>
          <p className="text-sm text-text-secondary">
            Everything that requires execution across your autonomous agent fleet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchTasks} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 stroke-[1.75] ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button variant="primary" size="sm" className="font-semibold">
            <Plus className="mr-2 h-4 w-4 stroke-[2]" /> Create Task
          </Button>
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Total Tasks</span>
          <p className="mt-1 text-2xl font-bold text-text-primary">{tasks.length}</p>
          <span className="text-[11px] text-text-secondary">Tracked in Backend</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">In Progress</span>
          <p className="mt-1 text-2xl font-bold text-emerald-500">
            {tasks.filter((t) => t.status === 'In Progress').length}
          </p>
          <span className="text-[11px] text-emerald-500 font-semibold">Active Pipeline</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Completed</span>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {tasks.filter((t) => t.status === 'Done').length}
          </p>
          <span className="text-[11px] text-text-secondary">Passed QA Verification</span>
        </Card>

        <Card className="p-4 bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Execution Score</span>
          <p className="mt-1 text-2xl font-bold text-accent-primary">96/100</p>
          <span className="text-[11px] text-text-secondary">High Velocity</span>
        </Card>
      </div>

      {/* Search Filter */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted stroke-[1.75]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter tasks..."
          className="w-full rounded-2xl border border-border bg-surface-2 pl-9 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-luxury"
        />
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface-secondary animate-pulse p-5" />
          ))}
        </div>
      )}

      {/* Tasks Catalog Cards */}
      {!loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="bg-surface-1 p-5 space-y-3 hover:border-accent-primary/60 transition-luxury">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    task.priority === 'High' ? 'warning' : 'accent'
                  }
                >
                  {task.priority} Priority
                </Badge>

                <span className="text-xs font-mono text-text-muted">{task.dueDate}</span>
              </div>

              <h3 className="text-sm font-bold text-text-primary leading-snug">{task.title}</h3>

              <div className="flex items-center justify-between text-xs text-text-secondary pt-1">
                <span>Assigned: <strong className="text-text-primary">{task.assignedAgent}</strong></span>
                <span>Status: <strong className="text-emerald-400">{task.status}</strong></span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};
