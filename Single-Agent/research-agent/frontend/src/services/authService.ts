import api from './api';
import { User } from '../types/research';

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('lifeos_research_token', response.data.access_token);
    }
    return response.data;
  },

  async register(email: string, password: string, full_name?: string) {
    const response = await api.post('/auth/register', { email, password, full_name });
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('lifeos_research_token');
  }
};
