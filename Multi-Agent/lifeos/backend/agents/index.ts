/**
 * Backend Agents Contract Gateway
 * Architecture definitions for Chief of Staff and 6 Specialist Agents
 */

export interface AgentContract {
  role: string;
  version: string;
  initialize(): Promise<boolean>;
  executeTask(payload: Record<string, unknown>): Promise<Record<string, unknown>>;
  healthCheck(): Promise<{ status: string; llmConnected: boolean }>;
}

export const AGENT_REGISTRY = {
  CHIEF_OF_STAFF: 'chief_of_staff',
  RESEARCH_AGENT: 'research_agent',
  PLANNING_AGENT: 'planning_agent',
  EXECUTION_AGENT: 'execution_agent',
  FINANCE_AGENT: 'finance_agent',
  REVIEW_AGENT: 'review_agent',
  COMMUNICATION_AGENT: 'communication_agent',
} as const;
