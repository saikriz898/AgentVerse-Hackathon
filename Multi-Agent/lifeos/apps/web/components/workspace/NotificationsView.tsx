'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  CheckCheck,
  Trash2,
  Cpu,
  ShieldCheck,
  Rocket,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState('all');

  const NOTIFICATIONS = [
    {
      id: 'notif-1',
      title: 'Full SDLC Build Completed Successfully',
      description: 'Chief of Staff & 7 SDLC Departments built end-to-end specification for "Build School ERP".',
      time: '10 mins ago',
      category: 'Workflow',
      isUnread: true,
      icon: Rocket,
    },
    {
      id: 'notif-2',
      title: 'QA Gate Verification Passed (Score 96/100)',
      description: 'Review Agent verified 0 SQLi and secret scanner vulnerabilities across codebase.',
      time: '45 mins ago',
      category: 'QA',
      isUnread: true,
      icon: ShieldCheck,
    },
    {
      id: 'notif-3',
      title: 'Neon pgvector Hybrid RRF Index Synced',
      description: 'Memory Agent synced 768-dim embeddings and BM25 keywords for active workspace.',
      time: '2 hours ago',
      category: 'Memory',
      isUnread: false,
      icon: Cpu,
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-none">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="accent" className="flex items-center gap-1.5">
              <Bell className="h-3 w-3 stroke-[2]" /> System Notifications
            </Badge>
            <Badge variant="outline">Activity Audit</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Notification Center & Event Logs
          </h1>
          <p className="text-sm text-text-secondary">
            Audit system alerts, workflow completion events, QA gate notifications, and memory updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <CheckCheck className="mr-2 h-4 w-4 stroke-[1.75]" /> Mark All Read
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'Workflow', 'QA', 'Memory'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-luxury capitalize ${
              filterCategory === cat
                ? 'bg-accent-light text-accent-primary border-accent-primary/40 font-bold'
                : 'border-border text-text-muted hover:text-text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {NOTIFICATIONS.map((notif) => {
          const Icon = notif.icon;
          return (
            <Card
              key={notif.id}
              className={`p-4 flex items-start justify-between transition-luxury ${
                notif.isUnread
                  ? 'bg-surface-1 border-accent-primary/40 shadow-xs'
                  : 'bg-surface-1/60 border-border/60 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-accent-light text-accent-primary shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 stroke-[1.75]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-text-primary">{notif.title}</h3>
                    {notif.isUnread && <span className="h-2 w-2 rounded-full bg-accent-primary" />}
                    <Badge variant="outline">{notif.category}</Badge>
                  </div>
                  <p className="text-xs text-text-secondary">{notif.description}</p>
                  <span className="text-[10px] text-text-muted block pt-1">{notif.time}</span>
                </div>
              </div>

              <button className="p-1.5 text-text-muted hover:text-rose-500 rounded-xl" title="Dismiss">
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
