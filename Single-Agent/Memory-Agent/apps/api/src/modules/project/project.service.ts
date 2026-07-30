import { db } from '../../config/db.js';
import { projects, workspaces } from '../../db/schema/index.js';
import { eq, and, isNull, like, or } from 'drizzle-orm';
import { memoryService } from '../memory/memory.service.js';

export class ProjectService {
  private async resolveWorkspaceId(workspaceId?: string): Promise<string> {
    const isValidUuid = (id?: string) => Boolean(id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
    if (isValidUuid(workspaceId)) {
      return workspaceId!;
    }
    const defaultWs = await db.select({ id: workspaces.id }).from(workspaces).limit(1);
    if (defaultWs[0]?.id && isValidUuid(defaultWs[0].id)) {
      return defaultWs[0].id;
    }
    return '00000000-0000-0000-0000-000000000000';
  }

  async createProject(workspaceId: string, name: string, description?: string, code?: string, status = 'active', priority = 'medium', progress?: number) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    const id = crypto.randomUUID();
    const computedProgress = progress ?? (status === 'completed' ? 100 : status === 'active' ? 65 : status === 'planning' ? 25 : 10);
    const computedCode = code || `PRJ-${id.slice(0, 4).toUpperCase()}`;

    const record = {
      id,
      workspaceId: wsId,
      name,
      description: description || null,
    };
    await db.insert(projects).values(record);

    const createdProject = {
      ...record,
      code: computedCode,
      status,
      priority,
      progress: computedProgress,
    };

    try {
      await memoryService.createMemory(wsId, {
        title: `Project Initialized: ${name}`,
        content: `Code: ${computedCode} | Status: ${status} | Priority: ${priority}\nDescription: ${description || 'No description provided.'}`,
        type: 'project',
        importance: 0.85,
        pinned: false,
        metadataJson: JSON.stringify({ projectId: id, code: computedCode, status, priority, progress: computedProgress }),
      });
    } catch (e) {
      console.error('Failed to sync project item to memory entries:', e);
    }

    return createdProject;
  }

  async listProjects(workspaceId: string, search?: string, status?: string, id?: string) {
    const wsId = await this.resolveWorkspaceId(workspaceId);
    const conditions: any[] = [isNull(projects.deletedAt)];

    if (id) {
      conditions.push(eq(projects.id, id));
    } else {
      conditions.push(or(eq(projects.workspaceId, wsId), isNull(projects.workspaceId)));
    }

    if (search && search.trim()) {
      const pattern = `%${search.trim()}%`;
      conditions.push(or(like(projects.name, pattern), like(projects.description, pattern)));
    }

    const records = await db.select().from(projects).where(and(...conditions));
    return records.map((p: any) => {
      const pStatus = p.status || 'active';
      const pProgress = p.progress ?? (pStatus === 'completed' ? 100 : pStatus === 'active' ? 65 : pStatus === 'planning' ? 25 : 10);
      return {
        ...p,
        code: p.code || `PRJ-${p.id.slice(0, 4).toUpperCase()}`,
        status: pStatus,
        priority: p.priority || 'high',
        progress: pProgress,
      };
    });
  }

  async getProjectById(workspaceId: string, id: string) {
    const items = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), isNull(projects.deletedAt)));
    if (!items[0]) return null;
    const p = items[0] as any;
    const pStatus = p.status || 'active';
    const pProgress = p.progress ?? (pStatus === 'completed' ? 100 : pStatus === 'active' ? 65 : pStatus === 'planning' ? 25 : 10);
    return {
      ...p,
      code: p.code || `PRJ-${id.slice(0, 4).toUpperCase()}`,
      status: pStatus,
      priority: p.priority || 'high',
      progress: pProgress,
    };
  }

  async updateProject(workspaceId: string, id: string, data: { name?: string; description?: string; status?: string; priority?: string; progress?: number }) {
    const updatePayload: any = { updatedAt: new Date() };
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.description !== undefined) updatePayload.description = data.description;

    await db
      .update(projects)
      .set(updatePayload)
      .where(eq(projects.id, id));

    const item = await this.getProjectById(workspaceId, id);
    if (!item) return null;

    const newStatus = data.status || item.status;
    const newPriority = data.priority || item.priority;
    const newProgress = data.progress !== undefined ? data.progress : (newStatus === 'completed' ? 100 : newStatus === 'active' ? 65 : newStatus === 'planning' ? 25 : 10);

    const updatedResult = {
      ...item,
      ...data,
      status: newStatus,
      priority: newPriority,
      progress: newProgress,
    };

    try {
      const { data: memories } = await memoryService.listMemories(workspaceId, 1, 200);
      const match: any = memories.find((m: any) => {
        try {
          const meta = JSON.parse(m.metadataJson || '{}');
          return meta.projectId === id;
        } catch {
          return m.title === `Project Initialized: ${item.name}` || m.type === 'project';
        }
      });
      if (match) {
        await memoryService.updateMemory(
          workspaceId,
          match.id,
          {
            title: `Project Initialized: ${updatedResult.name}`,
            content: `Code: ${updatedResult.code} | Status: ${updatedResult.status} | Priority: ${updatedResult.priority}\nDescription: ${updatedResult.description || 'No description provided.'}`,
          },
          'system'
        );
      }
    } catch (e) {
      console.error('Failed to sync project update to memory:', e);
    }

    return updatedResult;
  }

  async deleteProject(workspaceId: string, id: string) {
    const existing = await this.getProjectById(workspaceId, id);
    await db
      .delete(projects)
      .where(eq(projects.id, id));

    try {
      if (existing) {
        const { data: memories } = await memoryService.listMemories(workspaceId, 1, 200);
        const match: any = memories.find((m: any) => {
          try {
            const meta = JSON.parse(m.metadataJson || '{}');
            return meta.projectId === id;
          } catch {
            return m.title === `Project Initialized: ${existing.name}`;
          }
        });
        if (match) {
          await memoryService.deleteMemory(workspaceId, match.id);
        }
      }
    } catch (e) {
      console.error('Failed to delete synced project memory:', e);
    }

    return { success: true, id };
  }
}

export const projectService = new ProjectService();


