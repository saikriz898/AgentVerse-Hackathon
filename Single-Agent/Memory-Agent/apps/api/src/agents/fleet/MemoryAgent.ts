import { BaseAgent } from './BaseAgent.js';
import { SystemEvent } from '../core/types.js';
import { memoryService } from '../../modules/memory/memory.service.js';

export class MemoryAgent extends BaseAgent {
  public name = 'MemoryAgent';
  public version = '1.0.0';
  public consumedEvents = ['memory.create.requested', 'memory.update.requested', 'memory.delete.requested', 'project.created'];
  public producedEvents = ['memory.created', 'memory.updated', 'memory.deleted'];

  public async execute(action: string, payload: any, event: SystemEvent): Promise<any> {
    const start = Date.now();
    try {
      let result: any = null;

      if (action === 'memory.create.requested' || action === 'create') {
        const { title, content, type } = payload;
        result = await memoryService.createMemory(event.workspaceId, {
          title,
          content,
          type: type || 'working',
          importance: payload.importance || 0.8,
          pinned: Boolean(payload.pinned),
        });
      } else if (action === 'memory.update.requested' || action === 'update') {
        const { id, updatedData } = payload;
        result = await memoryService.updateMemory(event.workspaceId, id, updatedData || payload, event.userId);
      } else if (action === 'memory.delete.requested' || action === 'delete') {
        const id = typeof payload === 'string' ? payload : payload.id;
        result = await memoryService.deleteMemory(event.workspaceId, id);
      } else if (action === 'memory.list.requested' || action === 'list') {
        const { page = 1, limit = 20, type } = payload || {};
        result = await memoryService.listMemories(event.workspaceId, page, limit, type);
      } else {
        result = { acknowledged: true, agent: this.name, action };
      }

      this.recordExecutionSuccess(Date.now() - start);
      return result;
    } catch (err) {
      this.recordExecutionFailure(Date.now() - start);
      throw err;
    }
  }
}

export const memoryAgent = new MemoryAgent();
