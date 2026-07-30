import { BaseAgent } from './BaseAgent.js';
import { SystemEvent } from '../core/types.js';
import { knowledgeService } from '../../modules/knowledge/knowledge.service.js';

export class KnowledgeAgent extends BaseAgent {
  public name = 'KnowledgeAgent';
  public version = '1.0.0';
  public consumedEvents = ['knowledge.create.requested', 'knowledge.delete.requested', 'project.created', 'memory.created'];
  public producedEvents = ['knowledge.created', 'knowledge.updated', 'knowledge.deleted'];

  public async execute(action: string, payload: any, event: SystemEvent): Promise<any> {
    const start = Date.now();
    try {
      let result: any = null;

      if (action === 'knowledge.create.requested' || action === 'create') {
        const { title, content, category } = payload;
        result = await knowledgeService.createKnowledge(event.workspaceId, title, content, category);
      } else if (action === 'knowledge.update.requested' || action === 'update') {
        const { id, updatedData } = payload;
        result = await knowledgeService.updateKnowledge(event.workspaceId, id, updatedData || payload);
      } else if (action === 'knowledge.delete.requested' || action === 'delete') {
        const id = typeof payload === 'string' ? payload : payload.id;
        result = await knowledgeService.deleteKnowledge(event.workspaceId, id);
      } else if (action === 'knowledge.list.requested' || action === 'list') {
        const { search, category, id } = payload || {};
        result = await knowledgeService.listKnowledge(event.workspaceId, search, category, id);
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

export const knowledgeAgent = new KnowledgeAgent();
