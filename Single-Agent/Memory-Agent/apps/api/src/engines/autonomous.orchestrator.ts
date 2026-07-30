import { logger } from '../utils/logger.js';
import { workflowEngine } from '../jobs/workflow.engine.js';
import { processEmbedJob } from '../jobs/embed.worker.js';

export interface AutonomousEvent {
  id: string;
  type: 'MEMORY_CREATED' | 'MEMORY_UPDATED' | 'KNOWLEDGE_ADDED' | 'FILE_UPLOADED' | 'DOCUMENT_PROCESSED';
  workspaceId: string;
  entityId: string;
  payload: Record<string, any>;
  timestamp: string;
}

export interface AutonomousTaskPlan {
  planId: string;
  eventId: string;
  intent: string;
  tasks: Array<{
    id: string;
    name: string;
    type: 'EMBEDDING' | 'GRAPH_RELATIONSHIP' | 'SEARCH_INDEX' | 'ANALYTICS_UPDATE';
    queue: string;
    status: 'QUEUED' | 'RUNNING' | 'COMPLETED';
  }>;
}

export class AutonomousOrchestrator {
  private activePlans: AutonomousTaskPlan[] = [];

  async handleUserEvent(event: AutonomousEvent): Promise<AutonomousTaskPlan> {
    const planId = `plan-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    logger.info(`[AUTONOMOUS ORCHESTRATOR] Observed event: ${event.type} for entity ${event.entityId}`);

    let intent = 'Process memory item and update vector search partitions.';
    if (event.type === 'FILE_UPLOADED' || event.type === 'DOCUMENT_PROCESSED') {
      intent = 'Extract text chunks, generate 768d vector embeddings, link graph nodes, and refresh search index.';
    } else if (event.type === 'KNOWLEDGE_ADDED') {
      intent = 'Parse knowledge article, generate embedding vector, update search index, and refresh analytics.';
    }

    const tasks: AutonomousTaskPlan['tasks'] = [
      {
        id: `tsk-embed-${Date.now()}`,
        name: 'Generate Vector Embeddings (768d)',
        type: 'EMBEDDING',
        queue: 'embeddingQueue',
        status: 'QUEUED',
      },
      {
        id: `tsk-graph-${Date.now()}`,
        name: 'Update Relationship Graph Topology',
        type: 'GRAPH_RELATIONSHIP',
        queue: 'relationshipQueue',
        status: 'QUEUED',
      },
      {
        id: `tsk-search-${Date.now()}`,
        name: 'Re-index pgvector Hybrid Search',
        type: 'SEARCH_INDEX',
        queue: 'searchQueue',
        status: 'QUEUED',
      },
      {
        id: `tsk-analytics-${Date.now()}`,
        name: 'Update Workspace Analytics Telemetry',
        type: 'ANALYTICS_UPDATE',
        queue: 'analyticsQueue',
        status: 'QUEUED',
      },
    ];

    const plan: AutonomousTaskPlan = {
      planId,
      eventId: event.id,
      intent,
      tasks,
    };

    this.activePlans.unshift(plan);
    if (this.activePlans.length > 50) this.activePlans.pop();

    // Trigger background execution without blocking API response
    this.executeTaskPlan(event, plan).catch((err) => {
      logger.error(`[AUTONOMOUS ORCHESTRATOR] Background execution error: ${err.message}`);
    });

    return plan;
  }

  private async executeTaskPlan(event: AutonomousEvent, plan: AutonomousTaskPlan) {
    // Task 1: Generate Embedding
    if (event.payload?.content) {
      processEmbedJob(event.entityId, event.payload.content);
    }

    // Task 2: Trigger workflow tasks
    await workflowEngine.executeSequentialWorkflow([
      {
        id: event.entityId,
        type: 'embed',
        data: { id: event.entityId, workspaceId: event.workspaceId },
      },
    ]);

    // Mark plan completed
    plan.tasks.forEach((t) => (t.status = 'COMPLETED'));
  }

  getActivePlans(): AutonomousTaskPlan[] {
    return this.activePlans;
  }
}

export const autonomousOrchestrator = new AutonomousOrchestrator();
