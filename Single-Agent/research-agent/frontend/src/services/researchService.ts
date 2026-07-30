import api from './api';
import { ResearchResponse, ResearchFilters, HistoryItem, AnalyticsData } from '../types/research';

export const researchService = {
  async startResearch(objective: string, filters?: ResearchFilters): Promise<ResearchResponse> {
    const response = await api.post('/research/start', { objective, filters });
    return response.data;
  },

  async quickSearch(query: string) {
    const response = await api.post('/research/search', { query });
    return response.data;
  },

  async summarizeContent(content: string, url?: string) {
    const response = await api.post('/research/summarize', { content, url });
    return response.data;
  },

  async compareTopics(topics: string[]) {
    const response = await api.post('/research/compare', { topics });
    return response.data;
  },

  async factCheck(claim: string) {
    const response = await api.post('/research/fact-check', { claim });
    return response.data;
  },

  async getHistory(search?: string): Promise<{ total: number; items: HistoryItem[] }> {
    const response = await api.get('/research/history', { params: { search } });
    return response.data;
  },

  async getResultById(id: string): Promise<ResearchResponse> {
    const response = await api.get(`/research/result/${id}`);
    return response.data;
  },

  async deleteResearch(id: string) {
    const response = await api.delete(`/research/${id}`);
    return response.data;
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  }
};
