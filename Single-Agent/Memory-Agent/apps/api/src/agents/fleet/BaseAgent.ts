import { SystemEvent, AgentHealth } from '../core/types.js';
import { AgentHandler } from '../core/WorkflowOrchestrator.js';

export abstract class BaseAgent implements AgentHandler {
  public abstract name: string;
  public abstract version: string;
  public abstract consumedEvents: string[];
  public abstract producedEvents: string[];

  protected totalExecutions = 0;
  protected successfulExecutions = 0;
  protected failedExecutions = 0;
  protected totalLatencyMs = 0;
  protected lastActive = new Date().toISOString();

  public abstract execute(action: string, payload: any, event: SystemEvent): Promise<any>;

  public getHealth(): AgentHealth {
    return {
      name: this.name,
      status: 'ONLINE',
      version: this.version,
      consumedEvents: this.consumedEvents,
      producedEvents: this.producedEvents,
      metrics: {
        totalExecutions: this.totalExecutions,
        successfulExecutions: this.successfulExecutions,
        failedExecutions: this.failedExecutions,
        avgLatencyMs: this.totalExecutions > 0 ? Math.round(this.totalLatencyMs / this.totalExecutions) : 0,
        lastActive: this.lastActive,
      },
    };
  }

  protected recordExecutionSuccess(latencyMs: number) {
    this.totalExecutions++;
    this.successfulExecutions++;
    this.totalLatencyMs += latencyMs;
    this.lastActive = new Date().toISOString();
  }

  protected recordExecutionFailure(latencyMs: number) {
    this.totalExecutions++;
    this.failedExecutions++;
    this.totalLatencyMs += latencyMs;
    this.lastActive = new Date().toISOString();
  }
}
