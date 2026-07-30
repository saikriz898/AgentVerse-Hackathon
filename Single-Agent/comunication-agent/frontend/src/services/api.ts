import axios from 'axios';
import {
  TransformationRequest,
  TransformationResult,
  DeliveryRequest,
  DeliveryResponse,
  StatsSummary,
  TemplateItem
} from '../types/communication';

const API_BASE = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
});

// Request Interceptor: Attach JWT Token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('lifeos_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('lifeos_access_token');
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Health
  async getHealth() {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Auth
  async register(data: { username: string; email: string; password: string; role?: string }) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async login(data: { username: string; password: string }) {
    const res = await apiClient.post('/auth/login', data);
    if (res.data.access_token) {
      localStorage.setItem('lifeos_access_token', res.data.access_token);
      localStorage.setItem('lifeos_refresh_token', res.data.refresh_token);
      localStorage.setItem('lifeos_user', JSON.stringify({ username: data.username }));
    }
    return res.data;
  },

  async logout() {
    localStorage.removeItem('lifeos_access_token');
    localStorage.removeItem('lifeos_refresh_token');
    localStorage.removeItem('lifeos_user');
  },

  // Communication Queue
  async getQueue(status?: string, priority?: string) {
    const res = await apiClient.get('/communication/queue', { params: { status, priority } });
    return res.data;
  },

  async approveQueueItem(id: string) {
    const res = await apiClient.post(`/communication/queue/${id}/approve`);
    return res.data;
  },

  async rejectQueueItem(id: string) {
    const res = await apiClient.post(`/communication/queue/${id}/reject`);
    return res.data;
  },

  async archiveQueueItem(id: string) {
    const res = await apiClient.post(`/communication/queue/${id}/archive`);
    return res.data;
  },

  // Communication Transformations (v2.0 Enterprise)
  async transformCommunication(req: TransformationRequest): Promise<TransformationResult> {
    const res = await apiClient.post('/communication/transform', req);
    return res.data;
  },

  async approveAndDeliver(data: DeliveryRequest): Promise<DeliveryResponse> {
    const res = await apiClient.post('/communication/approve-and-deliver', data);
    return res.data;
  },

  async getDeliveryTracking(): Promise<any> {
    const res = await apiClient.get('/communication/delivery-tracking');
    return res.data;
  },

  async generateSummary(payload: any): Promise<TransformationResult> {
    const res = await apiClient.post('/communication/summary', payload);
    return res.data;
  },

  async generateReport(payload: any): Promise<TransformationResult> {
    const res = await apiClient.post('/communication/report', payload);
    return res.data;
  },

  async generateEmail(payload: any): Promise<TransformationResult> {
    const res = await apiClient.post('/communication/email', payload);
    return res.data;
  },

  async sendRealEmail(data: { recipient: string; subject: string; body: string; cc?: string }) {
    const res = await apiClient.post('/communication/send-email', data);
    return res.data;
  },

  async generateMarkdown(payload: any): Promise<TransformationResult> {
    const res = await apiClient.post('/communication/markdown', payload);
    return res.data;
  },

  async generateHtml(payload: any): Promise<TransformationResult> {
    const res = await apiClient.post('/communication/html', payload);
    return res.data;
  },

  async generateMeetingNotes(payload: any): Promise<TransformationResult> {
    const res = await apiClient.post('/communication/meeting-notes', payload);
    return res.data;
  },

  async generateStatus(payload: any): Promise<TransformationResult> {
    const res = await apiClient.post('/communication/status', payload);
    return res.data;
  },

  async generateReleaseNotes(payload: any): Promise<TransformationResult> {
    const res = await apiClient.post('/communication/release-notes', payload);
    return res.data;
  },

  async generateDocumentation(payload: any): Promise<TransformationResult> {
    const res = await apiClient.post('/communication/documentation', payload);
    return res.data;
  },

  // History & Management
  async getHistory(params?: { source_agent?: string; document_type?: string; language?: string; limit?: number }): Promise<TransformationResult[]> {
    const res = await apiClient.get('/communication/history', { params });
    return res.data;
  },

  async getRecordById(id: string): Promise<TransformationResult> {
    const res = await apiClient.get(`/communication/${id}`);
    return res.data;
  },

  async deleteRecord(id: string) {
    const res = await apiClient.delete(`/communication/${id}`);
    return res.data;
  },

  // Export
  async exportDocument(content: string, format: 'markdown' | 'html' | 'pdf' | 'docx' | 'email' | 'text' | 'json', title?: string) {
    const res = await apiClient.post('/communication/export', {
      content,
      format,
      title
    });
    return res.data;
  },

  // Stats & Templates
  async getStats(): Promise<StatsSummary> {
    const res = await apiClient.get('/communication/stats');
    return res.data;
  },

  async getTemplates(): Promise<TemplateItem[]> {
    const res = await apiClient.get('/templates/');
    return res.data;
  }
};
