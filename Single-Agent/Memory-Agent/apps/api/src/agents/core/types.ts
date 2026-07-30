export type EventPriority = 'HIGH' | 'NORMAL' | 'BACKGROUND' | 'LOW';

export interface SystemEvent<T = any> {
  eventId: string;
  eventType: string;
  workspaceId: string;
  userId: string;
  correlationId: string;
  sessionId: string;
  timestamp: string;
  priority: EventPriority;
  payload: T;
  metadata?: Record<string, any>;
}

export interface UserIntent {
  intent: string;
  confidence: number;
  businessOperation: string;
  requiredAgents: string[];
  dependencies: string[];
  priority: EventPriority;
}

export interface ExecutionTask {
  taskId: string;
  agentName: string;
  action: string;
  payload: any;
  dependsOn?: string[];
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  result?: any;
  error?: string;
  retryCount?: number;
}

export interface ExecutionPlan {
  planId: string;
  correlationId: string;
  intent: UserIntent;
  tasks: ExecutionTask[];
  createdAt: string;
  status: 'PLANNED' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
}

export interface AgentMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  avgLatencyMs: number;
  lastActive: string;
}

export interface AgentHealth {
  name: string;
  status: 'ONLINE' | 'BUSY' | 'DEGRADED' | 'OFFLINE';
  version: string;
  consumedEvents: string[];
  producedEvents: string[];
  metrics: AgentMetrics;
}
