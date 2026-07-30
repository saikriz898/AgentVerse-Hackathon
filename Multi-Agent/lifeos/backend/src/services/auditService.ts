/**
 * LifeOS Core - 14. Audit Service
 * Centralized audit log tracking API calls, user actions, workflow executions, agent calls, security events, and auth attempts.
 */

export interface AuditRecord {
  id: string;
  timestamp: string;
  category: 'API_CALL' | 'USER_ACTION' | 'WORKFLOW' | 'AGENT_CALL' | 'SECURITY' | 'AUTH';
  actor: string;
  action: string;
  target: string;
  status: 'SUCCESS' | 'FAILED' | 'WARN';
  ipAddress: string;
  details?: Record<string, any>;
}

class AuditService {
  private auditLogs: AuditRecord[] = [];

  constructor() {
    this.seedDefaultAuditLogs();
  }

  private seedDefaultAuditLogs() {
    this.auditLogs = [
      {
        id: 'audit-1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        category: 'WORKFLOW',
        actor: 'usr-admin-1',
        action: 'EXECUTE_WORKFLOW',
        target: 'ChiefOfStaffOrchestrator',
        status: 'SUCCESS',
        ipAddress: '127.0.0.1',
        details: { prompt: '/build full startup application spec' },
      },
      {
        id: 'audit-2',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        category: 'SECURITY',
        actor: 'ReviewAgent',
        action: 'QA_SECURITY_SCAN',
        target: 'Codebase',
        status: 'SUCCESS',
        ipAddress: 'localhost:8000',
        details: { score: 96, sqliVulnerabilities: 0 },
      },
    ];
  }

  public logEvent(category: AuditRecord['category'], action: string, actor: string, target: string, status: AuditRecord['status'] = 'SUCCESS', details?: Record<string, any>): AuditRecord {
    const record: AuditRecord = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      category,
      actor,
      action,
      target,
      status,
      ipAddress: '127.0.0.1',
      details,
    };
    this.auditLogs.unshift(record);
    if (this.auditLogs.length > 1000) this.auditLogs.pop();
    return record;
  }

  public getAuditLogs(): AuditRecord[] {
    return this.auditLogs;
  }
}

export const auditService = new AuditService();
