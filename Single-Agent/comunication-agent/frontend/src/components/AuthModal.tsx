import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await api.register({ username, email, password });
        // Automatically login after register
        await api.login({ username, password });
      } else {
        await api.login({ username, password });
      }
      onSuccess({ username });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-[11px] font-mono border border-sky-500/20">
            <Sparkles className="h-3 w-3" />
            <span>JWT Security</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {isRegister ? 'Create LifeOS Account' : 'Sign In to Communication Agent'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? 'Register to generate and manage communication outputs.' : 'Enter credentials to access protected routes.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Username</label>
            <div className="relative">
              <User className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="agent_developer"
                className="w-full glass-input rounded-xl pl-9 pr-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@lifeos.ai"
                  className="w-full glass-input rounded-xl pl-9 pr-3 py-2 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl pl-9 pr-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-sky-500/20 transition cursor-pointer"
          >
            {loading ? 'Processing...' : (isRegister ? 'Register Account' : 'Authenticate & Sign In')}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-sky-400 font-semibold hover:underline"
          >
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </div>

      </div>
    </div>
  );
};
