/**
 * LifeOS Core - 12. Notification Service
 * Dispatches real-time alerts & notifications for Workflow Completed, Workflow Failed, Agent Offline, Review Failed, Memory Updated, and Artifacts Ready.
 */

export interface SystemNotification {
  id: string;
  type: 'Workflow' | 'Agent' | 'Security' | 'Memory' | 'Artifact';
  severity: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

class NotificationService {
  private notifications: SystemNotification[] = [];

  constructor() {
    this.seedDefaultNotifications();
  }

  private seedDefaultNotifications() {
    this.notifications = [
      {
        id: 'notif-1',
        type: 'Workflow',
        severity: 'success',
        title: 'Workflow Execution Completed',
        message: 'Chief of Staff synthesized full SDLC build specification.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
      {
        id: 'notif-2',
        type: 'Agent',
        severity: 'info',
        title: 'Agent Fleet Heartbeat Normal',
        message: 'All 6 specialist microservice agents respond within <45ms.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: true,
      },
    ];
  }

  public getNotifications(): SystemNotification[] {
    return this.notifications;
  }

  public createNotification(type: SystemNotification['type'], severity: SystemNotification['severity'], title: string, message: string): SystemNotification {
    const notif: SystemNotification = {
      id: `notif-${Date.now()}`,
      type,
      severity,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.notifications.unshift(notif);
    return notif;
  }

  public markAsRead(id: string): boolean {
    const found = this.notifications.find((n) => n.id === id);
    if (found) {
      found.read = true;
      return true;
    }
    return false;
  }
}

export const notificationService = new NotificationService();
