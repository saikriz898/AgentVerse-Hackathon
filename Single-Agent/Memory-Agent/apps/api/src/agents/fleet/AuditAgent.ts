import { BaseAgent } from './BaseAgent.js';
import { SystemEvent } from '../core/types.js';

export class AuditAgent extends BaseAgent {
  public name = 'AuditAgent';
  public version = '1.0.0';
  public consumedEvents = ['*'];
  public producedEvents = ['audit.logged'];

  public async execute(action: string, payload: any, event: SystemEvent): Promise<any> {
    const start = Date.now();
    try {
      const auditLog = {
        auditId: `audit-${crypto.randomUUID().slice(0, 8)}`,
        eventId: event.eventId,
        correlationId: event.correlationId,
        eventType: event.eventType,
        workspaceId: event.workspaceId,
        userId: event.userId,
        timestamp: new Date().toISOString(),
      };
      this.recordExecutionSuccess(Date.now() - start);
      return auditLog;
    } catch (err) {
      this.recordExecutionFailure(Date.now() - start);
      throw err;
    }
  }
}

export const auditAgent = new AuditAgent();
