import { api } from './api';
import {
  StandardReviewOutput,
  DashboardStats,
  ReviewRule,
  ReviewRecord
} from '../types/review';

export const reviewService = {
  // Submit generic review
  submitReview: async (payload: {
    agent_name: string;
    review_type: string;
    content: any;
    metadata?: any;
  }): Promise<StandardReviewOutput> => {
    const res = await api.post('/review', payload);
    return res.data;
  },

  // Submit code review
  submitCodeReview: async (payload: {
    agent_name: string;
    language: string;
    code: string;
    context?: string;
  }): Promise<StandardReviewOutput> => {
    const res = await api.post('/review/code', payload);
    return res.data;
  },

  // Submit JSON review
  submitJsonReview: async (payload: {
    agent_name: string;
    json_data: any;
    required_keys?: string[];
  }): Promise<StandardReviewOutput> => {
    const res = await api.post('/review/json', payload);
    return res.data;
  },

  // Submit Document review
  submitDocReview: async (payload: {
    agent_name: string;
    document_type: string;
    content: string;
    title?: string;
  }): Promise<StandardReviewOutput> => {
    const res = await api.post('/review/document', payload);
    return res.data;
  },

  // Submit Research review
  submitResearchReview: async (payload: {
    agent_name: string;
    topic: string;
    findings: string;
    sources?: string[];
  }): Promise<StandardReviewOutput> => {
    const res = await api.post('/review/research', payload);
    return res.data;
  },

  // Submit Execution review
  submitExecutionReview: async (payload: {
    agent_name: string;
    execution_type: string;
    output: any;
  }): Promise<StandardReviewOutput> => {
    const res = await api.post('/review/execution', payload);
    return res.data;
  },

  // Submit Planning review
  submitPlanningReview: async (payload: {
    agent_name: string;
    goal: string;
    plan: any;
    milestones?: any[];
  }): Promise<StandardReviewOutput> => {
    const res = await api.post('/review/planning', payload);
    return res.data;
  },

  // Submit Memory review
  submitMemoryReview: async (payload: {
    agent_name: string;
    category: string;
    tags: string[];
    importance_score: number;
    summary: string;
    data?: any;
  }): Promise<StandardReviewOutput> => {
    const res = await api.post('/review/memory', payload);
    return res.data;
  },

  // Submit Communication review
  submitCommunicationReview: async (payload: {
    agent_name: string;
    comm_type: string;
    content: string;
    subject?: string;
  }): Promise<StandardReviewOutput> => {
    const res = await api.post('/review/communication', payload);
    return res.data;
  },

  // Submit Chief of Staff review
  submitChiefOfStaffReview: async (payload: {
    agent_name: string;
    task_summary: string;
    delegated_agents?: string[];
    content: any;
  }): Promise<StandardReviewOutput> => {
    const res = await api.post('/review/chief-of-staff', payload);
    return res.data;
  },

  // History & detail calls
  getHistory: async (params?: {
    agent_name?: string;
    review_type?: string;
    status?: string;
    min_score?: number;
    max_score?: number;
    skip?: number;
    limit?: number;
  }) => {
    const res = await api.get('/review/history', { params });
    return res.data;
  },

  getReviewById: async (id: string): Promise<ReviewRecord> => {
    const res = await api.get(`/review/${id}`);
    return res.data;
  },

  deleteReview: async (id: string) => {
    await api.delete(`/review/${id}`);
  },

  // Analytics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },

  // Rules
  getRules: async (): Promise<ReviewRule[]> => {
    const res = await api.get('/rules');
    return res.data;
  },

  createRule: async (payload: {
    name: string;
    agent_name: string;
    review_type: string;
    rule_config: any;
  }): Promise<ReviewRule> => {
    const res = await api.post('/rules', payload);
    return res.data;
  },

  deleteRule: async (id: string) => {
    await api.delete(`/rules/${id}`);
  }
};
