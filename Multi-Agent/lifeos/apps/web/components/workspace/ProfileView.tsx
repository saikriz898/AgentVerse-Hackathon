'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User, ShieldCheck, Activity } from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const ProfileView: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    ApiClient.getAuthSessions().then((data) => setSessions(data.sessions || []));
  }, []);

  const activeSession = sessions.length > 0 ? sessions[0] : { name: 'Lead System Architect', email: 'admin@lifeos.internal', role: 'Admin' };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      <div className="flex items-center gap-2 border-b border-border/60 pb-6">
        <Badge variant="accent">Operator Identity</Badge>
      </div>

      <Card className="p-6 bg-surface-1 space-y-4 border border-border">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-light text-accent-primary font-bold text-xl">
            {activeSession.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{activeSession.name}</h1>
            <p className="text-xs text-text-muted font-mono">{activeSession.email}</p>
            <Badge variant="success" className="mt-1">{activeSession.role} Access</Badge>
          </div>
        </div>
      </Card>
    </main>
  );
};
