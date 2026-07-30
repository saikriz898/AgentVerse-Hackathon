import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { agentRegistry } from './agent.registry.js';
import { mcpServer } from '../mcp/mcp.server.js';

export class AgentController {
  register(req: AuthenticatedRequest, res: Response) {
    const { agentId, name, version, type, capabilities } = req.body;
    const record = agentRegistry.registerAgent({
      agentId: agentId || crypto.randomUUID(),
      name,
      version: version || '1.0.0',
      type: type || 'custom',
      workspaceId: req.workspaceId!,
      capabilities: capabilities || ['memory'],
    });
    res.status(201).json(record);
  }

  heartbeat(req: AuthenticatedRequest, res: Response) {
    const { agentId } = req.body;
    const ok = agentRegistry.heartbeat(agentId);
    if (!ok) {
      res.status(404).json({ message: 'Agent not found' });
      return;
    }
    res.json({ message: 'Heartbeat acknowledged' });
  }

  list(req: AuthenticatedRequest, res: Response) {
    const agents = agentRegistry.getWorkspaceAgents(req.workspaceId!);
    res.json({ agents });
  }

  async handleMCP(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const mcpResponse = await mcpServer.handleRequest(req.workspaceId!, req.body);
      res.json(mcpResponse);
    } catch (err) {
      next(err);
    }
  }
}

export const agentController = new AgentController();
