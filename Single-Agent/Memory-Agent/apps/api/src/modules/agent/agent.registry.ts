export interface RegisteredAgent {
  agentId: string;
  name: string;
  version: string;
  type: string;
  workspaceId: string;
  capabilities: string[];
  status: 'online' | 'busy' | 'offline';
  lastHeartbeat: string;
}

export class AgentRegistry {
  private agents = new Map<string, RegisteredAgent>();

  registerAgent(agent: Omit<RegisteredAgent, 'lastHeartbeat' | 'status'>): RegisteredAgent {
    const record: RegisteredAgent = {
      ...agent,
      status: 'online',
      lastHeartbeat: new Date().toISOString(),
    };
    this.agents.set(agent.agentId, record);
    return record;
  }

  heartbeat(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.lastHeartbeat = new Date().toISOString();
    agent.status = 'online';
    return true;
  }

  getWorkspaceAgents(workspaceId: string): RegisteredAgent[] {
    return Array.from(this.agents.values()).filter((a) => a.workspaceId === workspaceId);
  }
}

export const agentRegistry = new AgentRegistry();
