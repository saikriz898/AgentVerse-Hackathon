'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/useAuthStore';
import { fetchApi } from '../../../lib/api';
import { Database, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@antigravity.ai');
  const [password, setPassword] = useState('AdminPass123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuth(data.user, data.token);
      if (data.workspace?.id) {
        localStorage.setItem('workspaceId', data.workspace.id);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] dark:bg-[#090909] text-[#111827] dark:text-gray-100 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none transition-colors duration-150">
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#2563EB] border border-blue-400/30 flex items-center justify-center mx-auto shadow-md">
            <Database className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111827] dark:text-white">Memory Agent Portal</h1>
          <p className="text-xs text-[#6B7280] dark:text-neutral-400">Antigravity Multi-Agent Enterprise Infrastructure Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#171717] p-8 space-y-6 border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl shadow-xl dark:shadow-none">
          {error && (
            <div className="p-3 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/50 text-[#DC2626] dark:text-red-300 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B7280] dark:text-neutral-400 mb-1.5 font-semibold">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9CA3AF] dark:text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@antigravity.ai"
                  className="w-full h-11 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B7280] dark:text-neutral-400 mb-1.5 font-semibold">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9CA3AF] dark:text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full h-11 bg-[#F6F7F9] dark:bg-[#111111] border border-[#E5E7EB] dark:border-white/[0.08] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#2563EB] hover:bg-blue-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-none disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B7280] dark:text-neutral-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>PostgreSQL (Neon) • BullMQ Redis • JWT Auth</span>
        </div>
      </div>
    </div>
  );
}
