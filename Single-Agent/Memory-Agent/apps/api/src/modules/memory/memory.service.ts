import { memoryRepository } from './memory.repository.js';
import { CreateMemoryDto, UpdateMemoryDto } from './memory.dto.js';
import { processEmbedJob } from '../../jobs/embed.worker.js';
import { buildPaginatedResponse } from '../../utils/pagination.js';

import { autonomousOrchestrator } from '../../engines/autonomous.orchestrator.js';

export class MemoryService {
  async createMemory(workspaceId: string, dto: CreateMemoryDto) {
    const memory = await memoryRepository.create(workspaceId, dto);
    // Trigger autonomous task planning and background processing
    autonomousOrchestrator.handleUserEvent({
      id: `evt-${Date.now()}`,
      type: 'MEMORY_CREATED',
      workspaceId,
      entityId: memory.id,
      payload: { title: memory.title, content: memory.content },
      timestamp: new Date().toISOString(),
    });
    return memory;
  }

  async getMemory(workspaceId: string, id: string) {
    const memory = await memoryRepository.findById(workspaceId, id);
    if (!memory) throw new Error('Memory entry not found');
    return memory;
  }

  async listMemories(workspaceId: string, page = 1, limit = 20, type?: string) {
    const { data, total } = await memoryRepository.findAll(workspaceId, page, limit, type);
    return buildPaginatedResponse(data, total, page, limit);
  }

  async listDeletedMemories(workspaceId: string) {
    return memoryRepository.findDeleted(workspaceId);
  }

  async updateMemory(workspaceId: string, id: string, dto: UpdateMemoryDto, userId: string) {
    const existing = await memoryRepository.findById(workspaceId, id);
    if (!existing) throw new Error('Memory entry not found');

    const updated = await memoryRepository.updateWithVersion(workspaceId, id, existing, dto, userId);
    autonomousOrchestrator.handleUserEvent({
      id: `evt-${Date.now()}`,
      type: 'MEMORY_UPDATED',
      workspaceId,
      entityId: id,
      payload: { title: dto.title || existing.title, content: dto.content || existing.content },
      timestamp: new Date().toISOString(),
    });
    return updated;
  }

  async deleteMemory(workspaceId: string, id: string) {
    await memoryRepository.permanentDelete(workspaceId, id);
    return { success: true, id };
  }

  async restoreMemory(workspaceId: string, id: string) {
    await memoryRepository.restore(workspaceId, id);
    return { success: true, id };
  }

  async permanentDeleteMemory(workspaceId: string, id: string) {
    await memoryRepository.permanentDelete(workspaceId, id);
    return { success: true, id };
  }
}

export const memoryService = new MemoryService();
