import { workflowOrchestrator } from './core/WorkflowOrchestrator.js';
import { securityAgent } from './fleet/SecurityAgent.js';
import { projectAgent } from './fleet/ProjectAgent.js';
import { memoryAgent } from './fleet/MemoryAgent.js';
import { knowledgeAgent } from './fleet/KnowledgeAgent.js';
import { searchAgent } from './fleet/SearchAgent.js';
import { relationshipGraphAgent } from './fleet/RelationshipGraphAgent.js';
import { notificationAgent } from './fleet/NotificationAgent.js';
import { analyticsAgent } from './fleet/AnalyticsAgent.js';
import { auditAgent } from './fleet/AuditAgent.js';

export function initializeAgentFleet() {
  workflowOrchestrator.registerAgent(securityAgent);
  workflowOrchestrator.registerAgent(projectAgent);
  workflowOrchestrator.registerAgent(memoryAgent);
  workflowOrchestrator.registerAgent(knowledgeAgent);
  workflowOrchestrator.registerAgent(searchAgent);
  workflowOrchestrator.registerAgent(relationshipGraphAgent);
  workflowOrchestrator.registerAgent(notificationAgent);
  workflowOrchestrator.registerAgent(analyticsAgent);
  workflowOrchestrator.registerAgent(auditAgent);
}

export * from './core/types.js';
export * from './core/EventBus.js';
export * from './core/EventStore.js';
export * from './core/EventGateway.js';
export * from './core/IntentDetectionAgent.js';
export * from './core/WorkflowPlannerAgent.js';
export * from './core/WorkflowOrchestrator.js';
