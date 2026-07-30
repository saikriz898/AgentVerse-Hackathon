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

  public createProject(data: Partial<ProjectEntity>): ProjectEntity {
    const id = `proj-${Date.now()}`;
    const code = data.code || `PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const newProject: ProjectEntity = {
      id,
      name: data.name || 'Untitled Project',
      code,
      description: data.description || 'New enterprise workspace project created in LifeOS.',
      status: data.status || 'Planning',
      progressPercent: data.progressPercent ?? 0,
      tasksCount: 0,
      budgetAllocatedUsd: data.budgetAllocatedUsd ?? 100.0,
      budgetSpentUsd: 0.0,
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  public createTask(data: Partial<TaskEntity>): TaskEntity {
    const id = `task-${Date.now()}`;
    const firstProject = this.getProjects()[0];
    const newTask: TaskEntity = {
      id,
      projectId: data.projectId || (firstProject ? firstProject.id : 'proj-default'),
      title: data.title || 'Untitled Agent Task',
      assignedAgent: data.assignedAgent || 'Chief of Staff',
      status: data.status || 'Todo',
      priority: data.priority || 'Medium',
      dueDate: data.dueDate || 'Today',
    };
    this.tasks.unshift(newTask);

    // Update parent project tasks count if found
    const parentProj = this.projects.get(newTask.projectId);
    if (parentProj) {
      parentProj.tasksCount += 1;
      parentProj.updatedAt = new Date().toISOString();
    }

    return newTask;
  }
}

export const projectManager = new ProjectManager();

