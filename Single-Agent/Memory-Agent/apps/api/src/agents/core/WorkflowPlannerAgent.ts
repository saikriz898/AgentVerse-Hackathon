import { SystemEvent, UserIntent, ExecutionPlan, ExecutionTask } from './types.js';

export class WorkflowPlannerAgent {
  private static instance: WorkflowPlannerAgent;

  public static getInstance(): WorkflowPlannerAgent {
    if (!WorkflowPlannerAgent.instance) {
      WorkflowPlannerAgent.instance = new WorkflowPlannerAgent();
    }
    return WorkflowPlannerAgent.instance;
  }

  public async createPlan(event: SystemEvent, intent: UserIntent): Promise<ExecutionPlan> {
    const planId = `plan-${crypto.randomUUID()}`;
    const tasks: ExecutionTask[] = [];

    // Security check task is always first
    tasks.push({
      taskId: `task-sec-${crypto.randomUUID().slice(0, 8)}`,
      agentName: 'SecurityAgent',
      action: 'validateAccess',
      payload: { workspaceId: event.workspaceId, userId: event.userId },
      status: 'PENDING',
    });

    // Primary domain agent task
    const primaryAgent = intent.requiredAgents.find((a) => a !== 'SecurityAgent' && a !== 'AnalyticsAgent' && a !== 'AuditAgent' && a !== 'NotificationAgent') || 'ProjectAgent';

    const primaryTaskId = `task-primary-${crypto.randomUUID().slice(0, 8)}`;
    tasks.push({
      taskId: primaryTaskId,
      agentName: primaryAgent,
      action: event.eventType,
      payload: event.payload,
      dependsOn: [`task-sec-${tasks[0].taskId}`],
      status: 'PENDING',
    });

    // Downstream multi-agent cascade tasks
    for (const agentName of intent.requiredAgents) {
      if (agentName === 'SecurityAgent' || agentName === primaryAgent) continue;
      tasks.push({
        taskId: `task-${agentName.toLowerCase()}-${crypto.randomUUID().slice(0, 8)}`,
        agentName,
        action: `process.${event.eventType}`,
        payload: event.payload,
        dependsOn: [primaryTaskId],
        status: 'PENDING',
      });
    }

    return {
      planId,
      correlationId: event.correlationId,
      intent,
      tasks,
      createdAt: new Date().toISOString(),
      status: 'PLANNED',
    };
  }
}

export const workflowPlannerAgent = WorkflowPlannerAgent.getInstance();
