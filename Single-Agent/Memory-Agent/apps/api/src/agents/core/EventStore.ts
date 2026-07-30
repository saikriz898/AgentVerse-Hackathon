import { SystemEvent } from './types.js';

export interface EventStoreRecord {
  eventId: string;
  correlationId: string;
  eventType: string;
  workspaceId: string;
  userId: string;
  priority: string;
  status: 'PUBLISHED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  payload: any;
  error?: string;
  result?: any;
  durationMs?: number;
  timestamp: string;
}

export class EventStore {
  private static instance: EventStore;
  private records: EventStoreRecord[] = [];

  public static getInstance(): EventStore {
    if (!EventStore.instance) {
      EventStore.instance = new EventStore();
    }
    return EventStore.instance;
  }

  public recordEvent(event: SystemEvent, status: 'PUBLISHED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' = 'PUBLISHED', error?: string, result?: any, durationMs?: number) {
    const record: EventStoreRecord = {
      eventId: event.eventId,
      correlationId: event.correlationId,
      eventType: event.eventType,
      workspaceId: event.workspaceId,
      userId: event.userId,
      priority: event.priority,
      status,
      payload: event.payload,
      error,
      result,
      durationMs,
      timestamp: event.timestamp,
    };
    this.records.unshift(record);

    // Keep memory cache trimmed to 1000 recent events
    if (this.records.length > 1000) {
      this.records = this.records.slice(0, 1000);
    }
    return record;
  }

  public updateEventStatus(eventId: string, status: 'COMPLETED' | 'FAILED', result?: any, error?: string, durationMs?: number) {
    const rec = this.records.find((r) => r.eventId === eventId);
    if (rec) {
      rec.status = status;
      if (result) rec.result = result;
      if (error) rec.error = error;
      if (durationMs) rec.durationMs = durationMs;
    }
  }

  public getEventsByCorrelationId(correlationId: string): EventStoreRecord[] {
    return this.records.filter((r) => r.correlationId === correlationId);
  }

  public getRecentEvents(limit = 50): EventStoreRecord[] {
    return this.records.slice(0, limit);
  }
}

export const eventStore = EventStore.getInstance();
