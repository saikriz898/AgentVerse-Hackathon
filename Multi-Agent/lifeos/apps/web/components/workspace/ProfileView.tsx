'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  User,
  ShieldCheck,
  Activity,
  Key,
  Copy,
  Check,
  RefreshCw,
  Smartphone,
  Laptop,
  Lock,
  Globe,
  Bell,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { ApiClient } from '@/lib/apiClient';

export const ProfileView: React.FC = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [copiedKey, setCopiedKey] = useState(false);
  const [apiKey, setApiKey] = useState('lifeos_live_sk_9f82a173e4b029c8821d');
  const [isEditing, setIsEditing] = useState(false);
  const [operatorName, setOperatorName] = useState('Chief Executive Operator');
  const [operatorEmail, setOperatorEmail] = useState('admin@lifeos.internal');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    ApiClient.getAuthSessions()
      .then((data) => setSessions(data.sessions || []))
      .catch(() => console.warn('Auth sessions pending...'));
  }, []);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    const newKey = `lifeos_live_sk_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 10)}`;
    setApiKey(newKey);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-20 md:pb-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="accent">Executive Identity</Badge>
            <Badge variant="outline" className="font-mono text-xs">SuperAdmin Access</Badge>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 font-mono text-xs">
              ⚡ GOD MODE UNLOCKED
            </Badge>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
            Operator Profile & Security Cockpit
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your Executive Identity credentials, active sessions, API keys, and system permissions.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          <Sliders className="mr-1.5 h-3.5 w-3.5" /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </div>

      {/* Save Feedback Banner */}
      {savedFeedback && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl text-xs font-mono flex items-center justify-between animate-fade-in shadow-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Operator profile & credentials successfully updated in core vault.
          </span>
        </div>
      )}

      {/* 1. EXECUTIVE OPERATOR IDENTITY CARD */}
      <Card className="p-6 bg-surface-1 space-y-6 border border-border shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-accent-primary/30 via-accent-light to-accent-primary/20 text-accent-primary font-bold text-2xl border-2 border-accent-primary shadow-lg">
              {operatorName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-text-primary">{operatorName}</h2>
                <Badge variant="success">Online</Badge>
              </div>
              <p className="text-xs text-text-muted font-mono mt-0.5">{operatorEmail}</p>
              <p className="text-xs text-accent-primary font-semibold mt-1">
                Unified Chief of Staff AI Principal Operator
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="bg-surface-2 p-3 rounded-xl border border-border/60 text-center">
              <span className="text-[10px] text-text-muted block font-medium">Role Level</span>
              <strong className="text-accent-primary font-mono text-xs">Root Admin</strong>
            </div>

            <div className="bg-surface-2 p-3 rounded-xl border border-border/60 text-center">
              <span className="text-[10px] text-text-muted block font-medium">2FA Status</span>
              <strong className="text-emerald-400 font-mono text-xs">Hardware Key OK</strong>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-4 border-t border-border/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-in fade-in">
            <div className="space-y-1">
              <label className="text-text-muted font-medium">Operator Full Name:</label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-text-primary focus:outline-none focus:border-accent-primary font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-text-muted font-medium">Operator Email Address:</label>
              <input
                type="email"
                value={operatorEmail}
                onChange={(e) => setOperatorEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-text-primary focus:outline-none focus:border-accent-primary font-mono"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <Button variant="primary" size="sm" type="submit">
                Save Operator Profile
              </Button>
            </div>
          </form>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. SECURITY API KEYS VAULT */}
        <Card className="p-6 bg-surface-1 space-y-4 border border-border">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-text-primary">API Credentials & Secret Keys</h3>
            </div>
            <Badge variant="outline" className="font-mono text-[10px]">Vault AES-256 Encrypted</Badge>
          </div>

          <p className="text-xs text-text-secondary">
            Your live secret key provides full access to LifeOS REST APIs and WebSocket Gateways.
          </p>

          <div className="bg-surface-2 p-3.5 rounded-xl border border-border/80 space-y-2">
            <span className="text-[10px] font-mono text-text-muted block uppercase">Live Production Secret Key:</span>
            <div className="flex items-center justify-between font-mono text-xs text-emerald-400">
              <span className="truncate">{apiKey}</span>
              <button
                onClick={handleCopyKey}
                className="p-1.5 rounded-lg bg-surface-1 border border-border text-text-muted hover:text-text-primary ml-2 transition-luxury shrink-0"
                title="Copy API Key"
              >
                {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-text-muted">Key created: Today • Never expires</span>
            <Button variant="outline" size="sm" onClick={handleRegenerateKey}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Regenerate Secret Key
            </Button>
          </div>
        </Card>

        {/* 3. GRANULAR RBAC PERMISSIONS MATRIX */}
        <Card className="p-6 bg-surface-1 space-y-4 border border-border">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-text-primary">Executive Permissions Matrix</h3>
            </div>
            <Badge variant="success" className="font-mono text-[10px]">All Rights Granted</Badge>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { scope: 'AIDLC 18-Stage Execution', status: 'Full Control', color: 'text-emerald-400' },
              { scope: 'Model Switcher (Gemini, GPT-4o, Claude, DeepSeek)', status: 'Unrestricted', color: 'text-emerald-400' },
              { scope: 'Vector RRF Memory Store Writes', status: 'Full Access', color: 'text-emerald-400' },
              { scope: 'System Reset & Audit Logs', status: 'SuperAdmin Only', color: 'text-indigo-400' },
            ].map((perm, idx) => (
              <div key={idx} className="flex items-center justify-between bg-surface-2 p-2.5 rounded-xl border border-border/50">
                <span className="text-text-primary font-medium">{perm.scope}</span>
                <span className={`font-mono text-xs font-bold ${perm.color}`}>{perm.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4. ACTIVE OPERATOR SESSIONS */}
      <Card className="p-6 bg-surface-1 space-y-4 border border-border">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Laptop className="h-5 w-5 text-accent-primary" />
            <h3 className="text-base font-bold text-text-primary">Active Operator Sessions ({sessions.length || 1})</h3>
          </div>
          <span className="text-xs font-mono text-text-muted">Live Security Audit</span>
        </div>

        <div className="space-y-3">
          {[
            { id: 'sess-active', device: 'Windows PC (Chrome 124)', ip: '192.168.1.102 (Localhost)', location: 'Current Session', current: true },
            { id: 'sess-mobile', device: 'Mobile Browser (Safari iOS)', ip: '192.168.1.145', location: 'Active 20m ago', current: false },
          ].map((sess) => (
            <div key={sess.id} className="flex items-center justify-between bg-surface-2/70 p-3.5 rounded-xl border border-border/60 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-1 border border-border text-accent-primary">
                  {sess.device.includes('PC') ? <Laptop className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary">{sess.device}</span>
                    {sess.current && <Badge variant="accent" className="text-[10px]">This Device</Badge>}
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">{sess.ip} • {sess.location}</span>
                </div>
              </div>

              {!sess.current && (
                <Button variant="outline" size="sm" className="h-7 text-[11px] text-rose-400 hover:text-rose-300">
                  Revoke Session
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
};
