'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Settings, Shield, User, RefreshCw } from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const SettingsView: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAuthData = async () => {
    setLoading(true);
    try {
      const data = await ApiClient.getAuthSessions();
      setSessions(data.sessions || []);
      setWorkspaces(data.workspaces || []);
    } catch (err) {
      console.warn('Auth Sessions API fallback...', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthData();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">Workspace Settings</Badge>
            <Badge variant="outline" className="font-mono">RBAC Matrix</Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Settings & Permissions
          </h1>
          <p className="text-sm text-text-secondary">
            Workspace access controls, active operator sessions, and device security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchAuthData} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 stroke-[1.75] ${loading ? 'animate-spin' : ''}`} /> Sync Sessions
          </Button>
        </div>
      </div>

      {/* Workspaces List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-text-primary">Configured Workspaces</h2>
        {workspaces.map((ws) => (
          <Card key={ws.id} className="p-5 bg-surface-1 space-y-2 border border-border">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-text-primary">{ws.name}</span>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-xs text-text-secondary">Owner ID: {ws.ownerId} • Members: {ws.membersCount}</p>
          </Card>
        ))}
      </div>

      {/* Active User Sessions */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-text-primary">Active Sessions ({sessions.length})</h2>
        {sessions.map((s) => (
          <Card key={s.sessionId} className="p-4 bg-surface-1 flex items-center justify-between border border-border">
            <div>
              <span className="font-bold text-xs text-text-primary">{s.name} ({s.email})</span>
              <p className="text-[11px] text-text-muted font-mono">{s.device} • {s.ipAddress}</p>
            </div>
            <Badge variant="accent">{s.role}</Badge>
          </Card>
        ))}
      </div>
    </main>
  );
};
