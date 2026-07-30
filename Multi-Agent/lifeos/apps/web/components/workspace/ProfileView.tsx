'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  User,
  Shield,
  Activity,
  Award,
  FolderKanban,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/useAuthStore';

export const ProfileView: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-none">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-2 text-2xl font-bold text-text-primary shadow-xs">
            {user?.name?.[0] || 'E'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="accent">{user?.role || 'Executive Admin'}</Badge>
              <Badge variant="outline">Enterprise Workspace</Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              {user?.name || 'Executive User'}
            </h1>
            <p className="text-sm text-text-secondary">{user?.email || 'admin@lifeos.ai'}</p>
          </div>
        </div>

        <Button variant="outline" size="sm">
          Edit Profile
        </Button>
      </div>

      {/* Profile Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Projects Created</span>
          <p className="mt-1.5 text-2xl font-bold text-text-primary">12 Projects</p>
        </Card>
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Tasks Completed</span>
          <p className="mt-1.5 text-2xl font-bold text-text-primary">142 Tasks</p>
        </Card>
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Artifacts Generated</span>
          <p className="mt-1.5 text-2xl font-bold text-text-primary">38 Artifacts</p>
        </Card>
        <Card className="bg-surface-1">
          <span className="text-xs font-semibold text-text-muted">Token Usage</span>
          <p className="mt-1.5 text-2xl font-bold text-emerald-500">1.42M Tokens</p>
        </Card>
      </div>
    </div>
  );
};
