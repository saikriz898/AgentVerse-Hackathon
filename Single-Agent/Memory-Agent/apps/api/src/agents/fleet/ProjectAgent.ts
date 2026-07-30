import { BaseAgent } from './BaseAgent.js';
import { SystemEvent } from '../core/types.js';
import { projectService } from '../../modules/project/project.service.js';

export class ProjectAgent extends BaseAgent {
  public name = 'ProjectAgent';
  public version = '1.0.0';
  public consumedEvents = ['project.create.requested', 'project.update.requested', 'project.delete.requested', 'project.list.requested'];
  public producedEvents = ['project.created', 'project.updated', 'project.deleted'];

  public async execute(action: string, payload: any, event: SystemEvent): Promise<any> {
    const start = Date.now();
    try {
      let result: any = null;

      if (action === 'project.create.requested' || action === 'create') {
        const { name, description, code, status, priority, progress } = payload;
        result = await projectService.createProject(
          event.workspaceId,
          name,
          description,
          code,
          status || 'active',
          priority || 'high',
          progress
        );
      } else if (action === 'project.update.requested' || action === 'update') {
        const { id, updatedData } = payload;
        result = await projectService.updateProject(event.workspaceId, id, updatedData || payload);
      } else if (action === 'project.delete.requested' || action === 'delete') {
        const { id } = payload;
        const targetId = typeof payload === 'string' ? payload : id;
        result = await projectService.deleteProject(event.workspaceId, targetId);
      } else if (action === 'project.list.requested' || action === 'list') {
        const { search, status, id } = payload || {};
        result = await projectService.listProjects(event.workspaceId, search, status, id);
      } else {
        // Fallback default list or pass-through
        result = await projectService.listProjects(event.workspaceId);
      }

      this.recordExecutionSuccess(Date.now() - start);
      return result;
    } catch (err) {
      this.recordExecutionFailure(Date.now() - start);
      throw err;
    }
  }
}

export const projectAgent = new ProjectAgent();
