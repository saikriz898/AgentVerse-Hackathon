import { BaseAgent } from './BaseAgent.js';
import { SystemEvent } from '../core/types.js';
import { eventBus } from '../core/EventBus.js';

export class NotificationAgent extends BaseAgent {
  public name = 'NotificationAgent';
  public version = '1.0.0';
  public consumedEvents = ['*'];
  public producedEvents = ['notification.sent'];

  public async execute(action: string, payload: any, event: SystemEvent): Promise<any> {
    const start = Date.now();
    try {
      const notification = {
        id: `notif-${crypto.randomUUID().slice(0, 8)}`,
        title: `Operation Completed: ${event.eventType}`,
        message: `Successfully processed event for workspace ${event.workspaceId}`,
        timestamp: new Date().toISOString(),
      };

      eventBus.broadcastStream('NOTIFICATION_SENT', notification);

      this.recordExecutionSuccess(Date.now() - start);
      return notification;
    } catch (err) {
      this.recordExecutionFailure(Date.now() - start);
      throw err;
    }
  }
}

export const notificationAgent = new NotificationAgent();
