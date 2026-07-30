import { SystemEvent, UserIntent } from './types.js';

export class IntentDetectionAgent {
  private static instance: IntentDetectionAgent;

  public static getInstance(): IntentDetectionAgent {
    if (!IntentDetectionAgent.instance) {
      IntentDetectionAgent.instance = new IntentDetectionAgent();
    }
    return IntentDetectionAgent.instance;
  }

  public async detectIntent(event: SystemEvent): Promise<UserIntent> {
    const { eventType } = event;

    if (eventType.startsWith('project.')) {
      return {
        intent: 'PROJECT_MANAGEMENT',
        confidence: 0.99,
        businessOperation: eventType,
        requiredAgents: ['SecurityAgent', 'ProjectAgent', 'MemoryAgent', 'KnowledgeAgent', 'SearchAgent', 'RelationshipGraphAgent', 'NotificationAgent', 'AnalyticsAgent', 'AuditAgent'],
        dependencies: ['SecurityAgent'],
        priority: event.priority,
      };
    }

    if (eventType.startsWith('memory.')) {
      return {
        intent: 'MEMORY_STORAGE',
        confidence: 0.98,
        businessOperation: eventType,
        requiredAgents: ['SecurityAgent', 'MemoryAgent', 'SearchAgent', 'RelationshipGraphAgent', 'NotificationAgent', 'AnalyticsAgent', 'AuditAgent'],
        dependencies: ['SecurityAgent'],
        priority: event.priority,
      };
    }

    if (eventType.startsWith('knowledge.')) {
      return {
        intent: 'KNOWLEDGE_MANAGEMENT',
        confidence: 0.98,
        businessOperation: eventType,
        requiredAgents: ['SecurityAgent', 'KnowledgeAgent', 'SearchAgent', 'RelationshipGraphAgent', 'NotificationAgent', 'AnalyticsAgent', 'AuditAgent'],
        dependencies: ['SecurityAgent'],
        priority: event.priority,
      };
    }

    return {
      intent: 'GENERIC_SYSTEM_OPERATION',
      confidence: 0.90,
      businessOperation: eventType,
      requiredAgents: ['SecurityAgent', 'AnalyticsAgent', 'AuditAgent'],
      dependencies: ['SecurityAgent'],
      priority: event.priority,
    };
  }
}

export const intentDetectionAgent = IntentDetectionAgent.getInstance();
