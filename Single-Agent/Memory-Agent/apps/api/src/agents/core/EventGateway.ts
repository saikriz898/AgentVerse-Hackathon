import { SystemEvent, EventPriority } from './types.js';
import { eventBus } from './EventBus.js';
import { intentDetectionAgent } from './IntentDetectionAgent.js';
import { workflowPlannerAgent } from './WorkflowPlannerAgent.js';
import { workflowOrchestrator } from './WorkflowOrchestrator.js';

export interface IngestRequestOptions {
  eventType: string;
  workspaceId: string;
  userId?: string;
  correlationId?: string;
  sessionId?: string;
  priority?: EventPriority;
  payload: any;
}

export class EventGateway {
  private static instance: EventGateway;

  public static getInstance(): EventGateway {
    if (!EventGateway.instance) {
      EventGateway.instance = new EventGateway();
    }
    return EventGateway.instance;
  }

  public async ingest(options: IngestRequestOptions): Promise<{ trackingId: string; correlationId: string; result?: any }> {
    const eventId = `evt-${crypto.randomUUID()}`;
    const correlationId = options.correlationId || `corr-${crypto.randomUUID()}`;
    const sessionId = options.sessionId || `sess-main`;
    const userId = options.userId || 'user-admin';
    const timestamp = new Date().toISOString();
    const priority = options.priority || 'NORMAL';

    const event: SystemEvent = {
      eventId,
      eventType: options.eventType,
      workspaceId: options.workspaceId,
      userId,
      correlationId,
      sessionId,
      timestamp,
      priority,
      payload: options.payload,
    };

    // 1. Publish raw requested event to EventBus & EventStore
    await eventBus.publish(event);

    // 2. Intent Detection Agent analyzes user request
    const intent = await intentDetectionAgent.detectIntent(event);

    // 3. Workflow Planning Agent builds execution graph
    const plan = await workflowPlannerAgent.createPlan(event, intent);

    // 4. Workflow Orchestrator executes agent sequence
    const result = await workflowOrchestrator.executePlan(plan, event);

    return {
      trackingId: eventId,
      correlationId,
      result,
    };
  }
}

export const eventGateway = EventGateway.getInstance();
