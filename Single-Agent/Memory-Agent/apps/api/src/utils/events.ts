import { EventEmitter } from 'events';
import { logger } from './logger.js';

export enum MemoryEvent {
  CREATED = 'memory.created',
  UPDATED = 'memory.updated',
  DELETED = 'memory.deleted',
  ARCHIVED = 'memory.archived',
  RESTORED = 'memory.restored',
  RANKED = 'memory.ranked',
  COMPRESSED = 'memory.compressed',
  VERSION_CREATED = 'memory.version_created',
  RELATIONSHIP_CREATED = 'memory.relationship_created',
}

class MemoryEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.on('error', (err) => {
      logger.error(`MemoryEventEmitter Error: ${err.message}`);
    });
  }

  emitMemoryEvent(event: MemoryEvent, payload: any) {
    logger.info(`[Event Published] ${event} for workspace: ${payload.workspaceId || 'global'}`);
    this.emit(event, payload);
  }
}

export const memoryEvents = new MemoryEventEmitter();
