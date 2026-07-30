import { embedQueue, summarizeQueue } from './queue.js';
import { logger } from '../utils/logger.js';

function withTimeout<T>(promise: Promise<T>, ms = 1500): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<T | null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]).catch(() => null);
}

export interface WorkflowTask {
  id: string;
  type: 'embed' | 'summarize';
  data: any;
}

export class WorkflowEngine {
  async executeSequentialWorkflow(tasks: WorkflowTask[]): Promise<{ workflowId: string; totalTasks: number }> {
    const workflowId = crypto.randomUUID();
    logger.info(`Starting sequential background workflow: ${workflowId} with ${tasks.length} tasks`);

    for (const task of tasks) {
      if (task.type === 'embed' && embedQueue) {
        await withTimeout(embedQueue.add('embed-task', task.data, { jobId: `${workflowId}-${task.id}` }));
      } else if (task.type === 'summarize' && summarizeQueue) {
        await withTimeout(summarizeQueue.add('summarize-task', task.data, { jobId: `${workflowId}-${task.id}` }));
      }
    }

    return { workflowId, totalTasks: tasks.length };
  }
}

export const workflowEngine = new WorkflowEngine();
