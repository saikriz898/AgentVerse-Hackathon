import { SystemEvent } from './types.js';
import { eventStore } from './EventStore.js';

export type EventListener = (event: SystemEvent) => Promise<void> | void;
export type StreamListener = (eventData: { type: string; payload: any; timestamp: string }) => void;

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, EventListener[]> = new Map();
  private streamListeners: Set<StreamListener> = new Set();
  private highQueue: SystemEvent[] = [];
  private normalQueue: SystemEvent[] = [];
  private backgroundQueue: SystemEvent[] = [];
  private dlq: SystemEvent[] = [];

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe(eventType: string, listener: EventListener) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  public subscribeStream(streamListener: StreamListener) {
    this.streamListeners.add(streamListener);
    return () => this.streamListeners.delete(streamListener);
  }

  public broadcastStream(type: string, payload: any) {
    const timestamp = new Date().toISOString();
    this.streamListeners.forEach((listener) => {
      try {
        listener({ type, payload, timestamp });
      } catch (err) {
        console.error('Error broadcasting stream listener:', err);
      }
    });
  }

  public async publish(event: SystemEvent): Promise<void> {
    eventStore.recordEvent(event, 'PUBLISHED');

    // Enqueue event based on priority
    if (event.priority === 'HIGH') {
      this.highQueue.push(event);
    } else if (event.priority === 'BACKGROUND' || event.priority === 'LOW') {
      this.backgroundQueue.push(event);
    } else {
      this.normalQueue.push(event);
    }

    // Broadcast live event to Realtime Stream listeners (SSE/WebSockets)
    this.broadcastStream(event.eventType, event);

    // Notify registered handlers asynchronously
    const topicListeners = this.listeners.get(event.eventType) || [];
    const wildcardListeners = this.listeners.get('*') || [];

    const handlers = [...topicListeners, ...wildcardListeners];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (err: any) {
        console.error(`Error handling event ${event.eventType}:`, err);
        this.dlq.push(event);
        eventStore.recordEvent(event, 'FAILED', err.message || 'Handler execution failed');
      }
    }
  }

  public getQueueStats() {
    return {
      highQueueDepth: this.highQueue.length,
      normalQueueDepth: this.normalQueue.length,
      backgroundQueueDepth: this.backgroundQueue.length,
      dlqDepth: this.dlq.length,
      activeStreamListeners: this.streamListeners.size,
    };
  }
}

export const eventBus = EventBus.getInstance();
