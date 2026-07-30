/**
 * LifeOS Core - 2. Agent Registry
 * Central registry configuration for all 6 microservice agents in the ecosystem.
 */

export interface AgentMetadata {
  id: string;
  name: string;
  role: string;
  version: string;
  host: string;
  port: number;
  url: string;
  healthEndpoint: string;
  capabilities: string[];
  timeoutMs: number;
  status: 'Online' | 'Offline' | 'Degraded' | 'Disabled';
  health: 'Healthy' | 'Warning' | 'Critical';
  lastSeen: string;
  retryCount: number;
  errorCount: number;
}

class AgentRegistry {
  private agentsMap: Map<string, AgentMetadata> = new Map();

  constructor() {
    this.seedDefaultAgents();
  }

  private seedDefaultAgents() {
    const defaults: AgentMetadata[] = [
      {
        id: 'research',
        name: 'Research Agent',
        role: 'Multi-Source Intelligence & Deep Web Discovery',
        version: 'v1.4.0',
        host: 'localhost',
        port: 8000,
        url: process.env.RESEARCH_AGENT_URL || 'http://localhost:8000',
        healthEndpoint: '/health',
        capabilities: ['Deep Search', 'SerpAPI', 'Paper Summarization', 'Fact Verification'],
        timeoutMs: 15000,
        status: 'Online',
        health: 'Healthy',
        lastSeen: new Date().toISOString(),
        retryCount: 0,
        errorCount: 0,
      },
      {
        id: 'memory',
        name: 'Memory Agent',
        role: 'Central RRF Vector DB & Graph Store',
        version: 'v2.1.0',
        host: 'localhost',
        port: 4000,
        url: process.env.MEMORY_AGENT_URL || 'http://localhost:4000',
        healthEndpoint: '/health',
        capabilities: ['768-dim Embeddings', 'Hybrid BM25 RRF', 'Graph Memory', 'Context Injection'],
        timeoutMs: 10000,
        status: 'Online',
        health: 'Healthy',
        lastSeen: new Date().toISOString(),
        retryCount: 0,
        errorCount: 0,
      },
      {
        id: 'planning',
        name: 'Planning Agent',
        role: 'LangGraph Workflow Synthesizer & Task Breakdown',
        version: 'v1.8.2',
        host: 'localhost',
        port: 8000,
        url: process.env.PLANNING_AGENT_URL || 'http://localhost:8000',
        healthEndpoint: '/health',
        capabilities: ['DAG Generation', 'Dependency Resolution', 'Milestone Estimation', 'PRD Structuring'],
        timeoutMs: 20000,
        status: 'Online',
        health: 'Healthy',
        lastSeen: new Date().toISOString(),
        retryCount: 0,
        errorCount: 0,
      },
      {
        id: 'finance',
        name: 'Finance Agent',
        role: 'Cost Architect Engine & Token Economics',
        version: 'v1.2.0',
        host: 'localhost',
        port: 8000,
        url: process.env.FINANCE_AGENT_URL || 'http://localhost:8000',
        healthEndpoint: '/health',
        capabilities: ['Cost Calculation', 'Token Usage Prediction', 'Budget Auditing', 'ROI Modeling'],
        timeoutMs: 10000,
        status: 'Online',
        health: 'Healthy',
        lastSeen: new Date().toISOString(),
        retryCount: 0,
        errorCount: 0,
      },
      {
        id: 'review',
        name: 'Review Agent',
        role: 'QA Gate Auditor & Code Security Scanner',
        version: 'v2.0.1',
        host: 'localhost',
        port: 8000,
        url: process.env.REVIEW_AGENT_URL || 'http://localhost:8000',
        healthEndpoint: '/health',
        capabilities: ['QA Gate Audit (>=80)', 'SQLi & Secret Scanner', 'Linter Audit', 'Vulnerability Gate'],
        timeoutMs: 15000,
        status: 'Online',
        health: 'Healthy',
        lastSeen: new Date().toISOString(),
        retryCount: 0,
        errorCount: 0,
      },
      {
        id: 'communication',
        name: 'Communication Agent',
        role: 'Format, Delivery & Realtime Alert Gateway',
        version: 'v1.5.0',
        host: 'localhost',
        port: 8004,
        url: process.env.COMMUNICATION_AGENT_URL || 'http://localhost:8004',
        healthEndpoint: '/health',
        capabilities: ['Markdown Formatting', 'Email Dispatch', 'Webhook Delivery', 'Slack Sync'],
        timeoutMs: 12000,
        status: 'Online',
        health: 'Healthy',
        lastSeen: new Date().toISOString(),
        retryCount: 0,
        errorCount: 0,
      },
    ];

    defaults.forEach((agent) => this.agentsMap.set(agent.id, agent));
  }

  public getAllAgents(): AgentMetadata[] {
    return Array.from(this.agentsMap.values());
  }

  public getAgent(id: string): AgentMetadata | undefined {
    return this.agentsMap.get(id);
  }

  public updateAgent(id: string, updates: Partial<AgentMetadata>): AgentMetadata | undefined {
    const existing = this.agentsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, lastSeen: new Date().toISOString() };
    this.agentsMap.set(id, updated);
    return updated;
  }
}

export const agentRegistry = new AgentRegistry();
