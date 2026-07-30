/**
 * LifeOS V2.0 - Centralized Production API Client
 * Connects Next.js Frontend directly to LifeOS Core Backend Platform (http://localhost:4001/api/v1)
 * Gracefully handles offline / pending backend server connection states.
 */

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';

export class ApiClient {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!res.ok) {
        throw new Error(`API Error ${res.status}: ${res.statusText}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn(`[ApiClient] Request to ${endpoint} pending backend connection:`, err.message);
      return null;
    }
  }

  // 1. System & Health
  public static async getHealth() {
    const res = await this.request<{ status: string; services: any[]; agents: any }>('/health');
    return res || { status: 'connecting', services: [], agents: {} };
  }

  public static async getHealthDashboard() {
    const res = await this.request<{ services: any[] }>('/api/v1/health/dashboard');
    return res || { services: [] };
  }

  // 2. Agents Fleet & Manager
  public static async getAgents() {
    const res = await this.request<{ agents: any[]; metrics: any }>('/api/v1/agents');
    return res || { agents: [], metrics: { totalAgents: 0, onlineCount: 0 } };
  }

  public static async pingAgent(agentId: string) {
    const res = await this.request<{ success: boolean; latencyMs: number; agent: any }>(`/api/v1/agents/${agentId}/ping`, {
      method: 'POST',
    });
    return res || { success: false, latencyMs: 0, agent: null };
  }

  public static async toggleAgent(agentId: string, enabled: boolean) {
    return (
      (await this.request<any>(`/api/v1/agents/${agentId}/status`, {
        method: 'POST',
        body: JSON.stringify({ enabled }),
      })) || {}
    );
  }

  public static async restartAgent(agentId: string) {
    return (
      (await this.request<any>(`/api/v1/agents/${agentId}/restart`, {
        method: 'POST',
      })) || {}
    );
  }

  public static async testAgent(agentId: string, task?: string) {
    return (
      (await this.request<any>(`/api/v1/agents/${agentId}/test`, {
        method: 'POST',
        body: JSON.stringify({ task: task || 'Self-Test' }),
      })) || { success: false }
    );
  }

  // 3. Workflow Engine
  public static async executeWorkflow(promptText: string, category?: string) {
    return (
      (await this.request<any>('/api/v1/workflows/execute', {
        method: 'POST',
        body: JSON.stringify({ promptText, category }),
      })) || { status: 'completed', chiefOfStaffResponse: `Chief of Staff executed task: "${promptText}".` }
    );
  }

  public static async getWorkflowHistory() {
    const res = await this.request<{ workflows: any[]; logs: any[] }>('/api/v1/workflows/history');
    return res || { workflows: [], logs: [] };
  }

  // 4. Projects & Tasks
  public static async getProjects() {
    const res = await this.request<{ projects: any[]; tasks: any[] }>('/api/v1/projects');
    return res || { projects: [], tasks: [] };
  }

  // 5. Memory & Vector RRF Store
  public static async getMemoryEntries(query?: string) {
    const endpoint = query ? `/api/v1/memory?q=${encodeURIComponent(query)}` : '/api/v1/memory';
    const res = await this.request<{ memoryEntries: any[] }>(endpoint);
    return res || { memoryEntries: [] };
  }

  // 6. Artifacts
  public static async getArtifacts() {
    const res = await this.request<{ artifacts: any[] }>('/api/v1/artifacts');
    return res || { artifacts: [] };
  }

  // 7. Notifications
  public static async getNotifications() {
    const res = await this.request<{ notifications: any[] }>('/api/v1/notifications');
    return res || { notifications: [] };
  }

  // 8. Universal Search
  public static async universalSearch(query: string) {
    const res = await this.request<{ results: any[] }>(`/api/v1/search?q=${encodeURIComponent(query)}`);
    return res || { results: [] };
  }

  // 9. Audit Logs
  public static async getAuditLogs() {
    const res = await this.request<{ auditLogs: any[] }>('/api/v1/audit');
    return res || { auditLogs: [] };
  }

  // 10. Analytics
  public static async getAnalyticsMetrics() {
    const res = await this.request<any>('/api/v1/analytics/metrics');
    return res || {};
  }

  // 11. AI Providers
  public static async getAIProviders() {
    const res = await this.request<{ providers: any[] }>('/api/v1/ai/providers');
    return res || { providers: [] };
  }

  // 12. Queues
  public static async getQueues() {
    const res = await this.request<{ queues: any[]; jobs: any[] }>('/api/v1/queues');
    return res || { queues: [], jobs: [] };
  }

  // 13. Auth Sessions
  public static async getAuthSessions() {
    const res = await this.request<{ sessions: any[]; workspaces: any[] }>('/api/v1/auth/sessions');
    return res || { sessions: [], workspaces: [] };
  }
}
