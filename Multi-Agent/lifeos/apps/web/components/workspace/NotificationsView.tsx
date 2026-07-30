'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Bell, CheckCircle2, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.warn('Notifications API fallback...', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Realtime Alert Center</Badge>
            <Badge variant="outline" className="font-mono">WebSocket Sync</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Notifications ({notifications.length})
          </h1>
          <p className="text-sm text-text-secondary">
            Realtime alerts for Workflow Executions, Agent Heartbeats, QA Gate Audits, and Memory sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchNotifs} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 stroke-[1.75] ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <Card key={n.id} className="p-4 bg-surface-1 flex items-start gap-4 border border-border">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${
              n.severity === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
            }`}>
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-text-primary">{n.title}</span>
                <span className="text-[11px] font-mono text-text-muted">{n.timestamp ? new Date(n.timestamp).toLocaleTimeString() : 'Just now'}</span>
              </div>
              <p className="text-xs text-text-secondary">{n.message}</p>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
};
