import { SystemEvent, ExecutionPlan } from './types.js';
import { eventBus } from './EventBus.js';
import { eventStore } from './EventStore.js';

export interface AgentHandler {
  name: string;
  execute: (action: string, payload: any, event: SystemEvent) => Promise<any>;
}

export class WorkflowOrchestrator {
  private static instance: WorkflowOrchestrator;
  private agents: Map<string, AgentHandler> = new Map();

  public static getInstance(): WorkflowOrchestrator {
    if (!WorkflowOrchestrator.instance) {
      WorkflowOrchestrator.instance = new WorkflowOrchestrator();
    }
    return WorkflowOrchestrator.instance;
  }

  public registerAgent(agent: AgentHandler) {
    this.agents.set(agent.name, agent);
  }

  public async executePlan(plan: ExecutionPlan, event: SystemEvent): Promise<any> {
    plan.status = 'EXECUTING';

    eventBus.broadcastStream('WORKFLOW_STARTED', {
      planId: plan.planId,
      correlationId: plan.correlationId,
      intent: plan.intent.intent,
      taskCount: plan.tasks.length,
    });

    let primaryResult: any = null;

    for (const task of plan.tasks) {
      const agent = this.agents.get(task.agentName);
      if (!agent) {
        task.status = 'SKIPPED';
        continue;
      }

      task.status = 'RUNNING';
      const startTime = Date.now();

      eventBus.broadcastStream('AGENT_STARTED', {
        planId: plan.planId,
        taskId: task.taskId,
        agentName: task.agentName,
        action: task.action,
      });

      try {
        const result = await agent.execute(task.action, task.payload, event);
        const durationMs = Date.now() - startTime;
        task.status = 'COMPLETED';
        task.result = result;

        if (task.agentName !== 'SecurityAgent' && task.agentName !== 'AnalyticsAgent' && task.agentName !== 'AuditAgent' && task.agentName !== 'NotificationAgent') {
          primaryResult = result;
        }

        eventStore.recordEvent(event, 'COMPLETED', undefined, result, durationMs);

        eventBus.broadcastStream('AGENT_COMPLETED', {
          planId: plan.planId,
          taskId: task.taskId,
          agentName: task.agentName,
          durationMs,
          result,
        });
      } catch (err: any) {
        const durationMs = Date.now() - startTime;
        task.status = 'FAILED';
        task.error = err.message || 'Execution error';

        eventStore.recordEvent(event, 'FAILED', err.message, undefined, durationMs);

        eventBus.broadcastStream('AGENT_FAILED', {
          planId: plan.planId,
          taskId: task.taskId,
          agentName: task.agentName,
          durationMs,
          error: task.error,
        });
      }
    }

    plan.status = 'COMPLETED';
    eventBus.broadcastStream('WORKFLOW_COMPLETED', {
      planId: plan.planId,
      correlationId: plan.correlationId,
      result: primaryResult,
    });

    return primaryResult;
  }
}

export const workflowOrchestrator = WorkflowOrchestrator.getInstance();
