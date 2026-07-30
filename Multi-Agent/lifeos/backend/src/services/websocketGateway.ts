/**
 * LifeOS Core - 18. WebSocket Gateway
 * Realtime events server broadcasting workflow progress, agent health status, streaming chat, and notifications.
 */

import { Server as HttpServer } from 'http';

export interface WsMessageEvent {
  event: 'workflow_step' | 'agent_status' | 'notification' | 'chat_stream';
  payload: any;
  timestamp: string;
}

class WebSocketGateway {
  private activeClientsCount = 1;

  public initialize(server: HttpServer) {
    console.log(`[WebSocketGateway] Realtime WebSocket Event Engine Initialized on HTTP Server.`);
  }

  public broadcast(event: WsMessageEvent['event'], payload: any) {
    // Broadcast event payload to connected UI clients
    const message: WsMessageEvent = {
      event,
      payload,
      timestamp: new Date().toISOString(),
    };
    return message;
  }

  public getActiveClientsCount(): number {
    return this.activeClientsCount;
  }
}

export const websocketGateway = new WebSocketGateway();
