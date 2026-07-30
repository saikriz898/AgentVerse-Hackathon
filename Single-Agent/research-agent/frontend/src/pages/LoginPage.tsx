import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Bot, Sparkles, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password, fullName);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">LifeOS Research Agent</h1>
          <p className="text-xs text-slate-400">AI Research Specialist Module • Version 1.0.0</p>
        </div>

        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">
              {isRegister ? 'Create Specialist Account' : 'Sign In to Dashboard'}
            </h2>
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs text-blue-400 hover:underline font-semibold"
            >
              {isRegister ? 'Existing user? Sign In' : 'Need account? Register'}
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                label="Full Name"
                placeholder="Dr. Sarah Connor"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="researcher@lifeos.ai"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" disabled={loading} className="w-full">
              {loading ? 'Authenticating...' : isRegister ? 'Register Specialist' : 'Sign In'}
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500">
              Default Seed User: <code className="text-blue-400 font-mono">researcher@lifeos.ai</code> / <code className="text-blue-400 font-mono">LifeOS2026!</code>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};
