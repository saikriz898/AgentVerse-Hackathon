/**
 * LifeOS Core - 9. Project Manager
 * Linked management of Projects, Tasks, Milestones, Documents, Artifacts, and Token/Financial Budgets.
 */

export interface ProjectEntity {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Planning';
  progressPercent: number;
  tasksCount: number;
  budgetAllocatedUsd: number;
  budgetSpentUsd: number;
  updatedAt: string;
}

export interface TaskEntity {
  id: string;
  projectId: string;
  title: string;
  assignedAgent: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
}

class ProjectManager {
  private projects: Map<string, ProjectEntity> = new Map();
  private tasks: TaskEntity[] = [];

  constructor() {
    this.seedDefaultProject();
  }

  private seedDefaultProject() {
    const proj: ProjectEntity = {
      id: 'proj-lifeos-core',
      name: 'LifeOS Core V1.0 Backend Platform',
      code: 'LIFE-CORE',
      description: 'Centralized Multi-Agent Gateway, Workflow Engine, and Operational Control Center UI.',
      status: 'In Progress',
      progressPercent: 88,
      tasksCount: 18,
      budgetAllocatedUsd: 250.0,
      budgetSpentUsd: 18.45,
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(proj.id, proj);

    this.tasks = [
      {
        id: 'task-1',
        projectId: proj.id,
        title: 'Build Agent Manager & Connector Layer',
        assignedAgent: 'Chief of Staff',
        status: 'Done',
        priority: 'High',
        dueDate: 'Today',
      },
      {
        id: 'task-2',
        projectId: proj.id,
        title: 'Implement 30s Health Monitor Heartbeat',
        assignedAgent: 'Review Agent',
        status: 'Done',
        priority: 'High',
        dueDate: 'Today',
      },
      {
        id: 'task-3',
        projectId: proj.id,
        title: 'Deploy Operational Control Center UI',
        assignedAgent: 'Communication Agent',
        status: 'In Progress',
        priority: 'High',
        dueDate: 'Today',
      },
    ];
  }

  public getProjects(): ProjectEntity[] {
    return Array.from(this.projects.values());
  }

  public getTasks(projectId?: string): TaskEntity[] {
    if (projectId) return this.tasks.filter((t) => t.projectId === projectId);
    return this.tasks;
  }
}

export const projectManager = new ProjectManager();
