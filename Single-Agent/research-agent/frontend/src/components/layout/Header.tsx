import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-slate-900/60 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Multi-Agent AI Network</span>
        <span className="text-slate-600">/</span>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Chief of Staff Interface Ready</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <UserIcon className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-slate-200">{user.full_name || user.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-rose-400">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
};
