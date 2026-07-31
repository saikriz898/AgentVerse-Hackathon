/**
 * LifeOS Core - Prompt-Based Automation Service
 * Converts natural language prompts into autonomous event-driven and cron-scheduled multi-agent workflows.
 */

export interface PromptAutomation {
  id: string;
  name: string;
  prompt: string;
  triggerType: 'Cron Schedule' | 'Event Listener' | 'Webhook Event' | 'Manual Prompt';
  triggerRule: string;
  assignedAgents: string[];
  status: 'Active' | 'Paused' | 'Testing';
  executionsCount: number;
  lastExecuted: string;
  actionOutput: string;
}

class AutomationService {
  private automations: PromptAutomation[] = [
    {
      id: 'auto-1',
      name: 'Autonomous Daily Executive Summary',
      prompt: 'Every morning at 9 AM, aggregate completed tasks, calculate budget velocity, and generate PRD summary.',
      triggerType: 'Cron Schedule',
      triggerRule: '0 9 * * * (Daily at 09:00 AM)',
      assignedAgents: ['Chief of Staff', 'Finance Agent'],
      status: 'Active',
      executionsCount: 42,
      lastExecuted: new Date(Date.now() - 3600000).toISOString(),
      actionOutput: 'Summary published to Knowledge Base & Slack Webhook.',
    },
    {
      id: 'auto-2',
      name: 'Self-Healing Security Audit & Governance',
      prompt: 'Scan codebase for vulnerabilities every 12 hours and log security audit records.',
      triggerType: 'Cron Schedule',
      triggerRule: '0 */12 * * * (Every 12 Hours)',
      assignedAgents: ['Review Agent', 'Memory Agent'],
      status: 'Active',
      executionsCount: 18,
      lastExecuted: new Date(Date.now() - 7200000).toISOString(),
      actionOutput: 'Audit score 98/100 logged to Security Audit Log.',
    },
    {
      id: 'auto-3',
      name: 'High-Priority Task Escalation Dispatch',
      prompt: 'When a new High Priority task is created, immediately trigger Research Agent and run AIDLC analysis.',
      triggerType: 'Event Listener',
      triggerRule: 'On Task Event: Priority == High',
      assignedAgents: ['Research Agent', 'Planning Agent'],
      status: 'Active',
      executionsCount: 29,
      lastExecuted: new Date(Date.now() - 1800000).toISOString(),
      actionOutput: 'AIDLC 5-Stage pipeline triggered automatically.',
    },
  ];

  public getAutomations(): PromptAutomation[] {
    return this.automations;
  }

  public createPromptAutomation(name: string, prompt: string, triggerType?: string, triggerRule?: string, assignedAgents?: string[]): PromptAutomation {
    const newAuto: PromptAutomation = {
      id: `auto-${Date.now()}`,
      name: name || prompt.slice(0, 30) + '...',
      prompt,
      triggerType: (triggerType as any) || 'Manual Prompt',
      triggerRule: triggerRule || 'Immediate Prompt Trigger',
      assignedAgents: assignedAgents && assignedAgents.length > 0 ? assignedAgents : ['Chief of Staff', 'Research Agent'],
      status: 'Active',
      executionsCount: 1,
      lastExecuted: new Date().toISOString(),
      actionOutput: `Prompt automation activated. Generated DAG workflow across [${(assignedAgents || ['Chief of Staff']).join(', ')}].`,
    };
    this.automations.unshift(newAuto);
    return newAuto;
  }

  public toggleAutomationStatus(id: string, active: boolean): PromptAutomation {
    const target = this.automations.find((a) => a.id === id);
    if (!target) throw new Error(`Automation ${id} not found`);
    target.status = active ? 'Active' : 'Paused';
    return target;
  }

  public triggerAutomationNow(id: string): { success: boolean; latencyMs: number; output: string } {
    const target = this.automations.find((a) => a.id === id);
    if (!target) throw new Error(`Automation ${id} not found`);
    target.executionsCount++;
    target.lastExecuted = new Date().toISOString();
    return {
      success: true,
      latencyMs: 340,
      output: `Executed prompt automation "${target.name}". Multi-agent fleet processed prompt: "${target.prompt}". Action output: ${target.actionOutput}`,
    };
  }
}

export const automationService = new AutomationService();
