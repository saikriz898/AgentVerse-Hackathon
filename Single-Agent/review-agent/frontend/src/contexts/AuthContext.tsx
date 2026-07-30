import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/review';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('review_agent_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem('review_agent_token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (isMounted) setUser(res.data);
        } catch {
          if (isMounted) logout();
        }
      }
      if (isMounted) setIsLoading(false);
    };
    fetchUser();
    return () => { isMounted = false; };
  }, [token, logout]);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token, user: loggedUser } = res.data;
    localStorage.setItem('review_agent_token', access_token);
    setToken(access_token);
    setUser(loggedUser);
  };

  const register = async (email: string, password: string, fullName?: string) => {
    await api.post('/auth/register', { email, password, full_name: fullName });
    await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
