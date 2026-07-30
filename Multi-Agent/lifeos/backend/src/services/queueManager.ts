/**
 * LifeOS Core - 17. Queue Manager
 * Queue orchestration (Workflows, Artifacts, Embeddings, Notifications, Email jobs) with status monitoring.
 */

export interface QueueJob {
  id: string;
  queueName: string;
  data: any;
  status: 'active' | 'completed' | 'failed' | 'delayed';
  progressPercent: number;
  attempts: number;
  timestamp: string;
}

export interface QueueStatus {
  name: string;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: boolean;
}

class QueueManager {
  private queues: Map<string, QueueStatus> = new Map();
  private jobs: QueueJob[] = [];

  constructor() {
    this.seedDefaultQueues();
  }

  private seedDefaultQueues() {
    const queueNames = ['Workflows', 'Artifacts', 'Embeddings', 'Notifications', 'Emails'];
    queueNames.forEach((name) => {
      this.queues.set(name, {
        name,
        active: 1,
        completed: 142,
        failed: 0,
        delayed: 0,
        paused: false,
      });
    });

    this.jobs = [
      {
        id: 'job-101',
        queueName: 'Workflows',
        data: { workflowId: 'wf-sample-101', action: 'synthesize_sdlc' },
        status: 'completed',
        progressPercent: 100,
        attempts: 1,
        timestamp: new Date().toISOString(),
      },
    ];
  }

  public getQueueStatuses(): QueueStatus[] {
    return Array.from(this.queues.values());
  }

  public getRecentJobs(): QueueJob[] {
    return this.jobs;
  }
}

export const queueManager = new QueueManager();
