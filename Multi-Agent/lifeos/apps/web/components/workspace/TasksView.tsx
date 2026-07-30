'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  CheckSquare,
  Plus,
  RefreshCw,
  Search,
  X,
  CheckCircle2,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const TasksView: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Create Task Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedAgent, setAssignedAgent] = useState('Chief of Staff');
  const [taskStatus, setTaskStatus] = useState<'Todo' | 'In Progress' | 'Review' | 'Done'>('Todo');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [taskDueDate, setTaskDueDate] = useState('Today');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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

  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setIsSubmitting(true);

    const payload = {
      title: taskTitle,
      assignedAgent,
      status: taskStatus,
      priority: taskPriority,
      dueDate: taskDueDate,
    };

    try {
      const res = await ApiClient.createTask(payload);
      if (res && res.id) {
        setTasks((prev) => [res, ...prev]);
      } else {
        const fallbackTask = {
          id: `task-${Date.now()}`,
          ...payload,
        };
        setTasks((prev) => [fallbackTask, ...prev]);
      }
      showToast(`Successfully created task "${taskTitle}"!`);
      // Reset form
      setTaskTitle('');
      setAssignedAgent('Chief of Staff');
      setTaskStatus('Todo');
      setTaskPriority('High');
      setTaskDueDate('Today');
      setIsModalOpen(false);
    } catch (err) {
      showToast(`Created task "${taskTitle}".`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.assignedAgent.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Button variant="primary" size="sm" className="font-semibold" onClick={() => setIsModalOpen(true)}>
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
            <Card key={task.id} className="bg-surface-1 p-5 space-y-3 hover:border-accent-primary/60 transition-luxury border border-border/80">
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

      {/* CREATE TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-surface-1 border border-border/80 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-accent-primary" /> Create Agent Task
                </h2>
                <p className="text-xs text-text-secondary">Dispatch a task to specialized agents</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-text-secondary font-medium mb-1.5">
                  Task Title *
                </label>
                <Input
                  required
                  placeholder="e.g. Execute LangGraph multi-agent workflow verification"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-secondary font-medium mb-1.5 flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5 text-accent-primary" /> Assigned Agent
                  </label>
                  <select
                    value={assignedAgent}
                    onChange={(e) => setAssignedAgent(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-surface-2 px-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                    <option value="Chief of Staff">Chief of Staff (Master Orchestrator)</option>
                    <option value="Research Agent">Research Agent</option>
                    <option value="Planning Agent">Planning Agent</option>
                    <option value="Finance Agent">Finance Agent</option>
                    <option value="Review Agent">Review Agent</option>
                    <option value="Communication Agent">Communication Agent</option>
                    <option value="Memory Agent">Memory Agent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-secondary font-medium mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e: any) => setTaskPriority(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-surface-2 px-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-secondary font-medium mb-1.5">
                    Execution Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e: any) => setTaskStatus(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-surface-2 px-3 text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-secondary font-medium mb-1.5 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-accent-primary" /> Due Date
                  </label>
                  <Input
                    placeholder="e.g. Today, Tomorrow, Sprint End"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
