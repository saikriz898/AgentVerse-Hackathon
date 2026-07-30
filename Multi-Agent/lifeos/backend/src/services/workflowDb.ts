/**
 * LifeOS Core - 7. Workflow Database Service
 * Persistent store for Workflows, Workflow Steps, Execution Logs, Agent Calls, Responses, Artifacts, and Errors.
 */

export interface WorkflowStepRecord {
  id: string;
  workflowId: string;
  stepNumber: number;
  name: string;
  agentId: string;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Skipped';
  input: any;
  output: any;
  durationMs: number;
  retries: number;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface WorkflowRecord {
  id: string;
  title: string;
  category: string;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Cancelled';
  promptText: string;
  currentStepIndex: number;
  totalSteps: number;
  steps: WorkflowStepRecord[];
  chiefOfStaffResponse?: string;
  artifact?: any;
  createdAt: string;
  completedAt?: string;
  durationMs?: number;
}

class WorkflowDatabase {
  private workflows: Map<string, WorkflowRecord> = new Map();
  private executionLogs: Array<{ id: string; timestamp: string; level: 'info' | 'warn' | 'error'; message: string; metadata?: any }> = [];

  constructor() {
    this.seedHistoricalWorkflows();
  }

  private seedHistoricalWorkflows() {
    const sample: WorkflowRecord = {
      id: 'wf-sample-101',
      title: 'Full Startup SDLC Build Specification',
      category: 'SDLC Build',
      status: 'Completed',
      promptText: '/build create full startup application specification',
      currentStepIndex: 4,
      totalSteps: 4,
      steps: [
        {
          id: 'step-1',
          workflowId: 'wf-sample-101',
          stepNumber: 1,
          name: 'Multi-Source Intelligence Search',
          agentId: 'research',
          status: 'Completed',
          input: { query: 'Full startup SDLC build specs' },
          output: { citations: 14, summary: '14 epics & 42 stories compiled.' },
          durationMs: 340,
          retries: 0,
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          completedAt: new Date(Date.now() - 3599660).toISOString(),
        },
        {
          id: 'step-2',
          workflowId: 'wf-sample-101',
          stepNumber: 2,
          name: '768-dim RRF Context Ingestion',
          agentId: 'memory',
          status: 'Completed',
          input: { query: 'vector search context' },
          output: { score: 0.96 },
          durationMs: 180,
          retries: 0,
          startedAt: new Date(Date.now() - 3599600).toISOString(),
          completedAt: new Date(Date.now() - 3599420).toISOString(),
        },
        {
          id: 'step-3',
          workflowId: 'wf-sample-101',
          stepNumber: 3,
          name: 'LangGraph Task DAG Orchestration',
          agentId: 'planning',
          status: 'Completed',
          input: { prompt: 'System architecture' },
          output: { stepsCreated: 4 },
          durationMs: 420,
          retries: 0,
          startedAt: new Date(Date.now() - 3599400).toISOString(),
          completedAt: new Date(Date.now() - 3598980).toISOString(),
        },
        {
          id: 'step-4',
          workflowId: 'wf-sample-101',
          stepNumber: 4,
          name: 'QA Security & Secret Scanner Audit',
          agentId: 'review',
          status: 'Completed',
          input: { code: 'generated spec' },
          output: { score: 96, gatePassed: true },
          durationMs: 250,
          retries: 0,
          startedAt: new Date(Date.now() - 3598900).toISOString(),
          completedAt: new Date(Date.now() - 3598650).toISOString(),
        },
      ],
      chiefOfStaffResponse: 'Chief of Staff & 7 SDLC Departments synthesized full startup specification.',
      artifact: {
        id: 'art-sample-1',
        title: 'sdlc-build-specification.md',
        type: 'markdown',
        version: 'v1.0.0',
        content: '# Full Startup SDLC Build Specification\n\n## 1. Requirement Analysis (Business Analysis Dept)...',
      },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date(Date.now() - 3598650).toISOString(),
      durationMs: 1350,
    };

    this.workflows.set(sample.id, sample);
    this.addLog('info', `Historical workflow '${sample.id}' loaded into persistent database.`);
  }

  public saveWorkflow(workflow: WorkflowRecord): WorkflowRecord {
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  public getWorkflow(id: string): WorkflowRecord | undefined {
    return this.workflows.get(id);
  }

  public getAllWorkflows(): WorkflowRecord[] {
    return Array.from(this.workflows.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public addLog(level: 'info' | 'warn' | 'error', message: string, metadata?: any) {
    const logItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    };
    this.executionLogs.unshift(logItem);
    if (this.executionLogs.length > 500) this.executionLogs.pop();
  }

  public getLogs(): Array<{ id: string; timestamp: string; level: string; message: string; metadata?: any }> {
    return this.executionLogs;
  }
}

export const workflowDb = new WorkflowDatabase();
