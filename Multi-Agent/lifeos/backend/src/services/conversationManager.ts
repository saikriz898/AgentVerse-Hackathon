/**
 * LifeOS Core - 8. Conversation Manager
 * Manages Chat Sessions, Messages, Attachments, Thread Branching, Search, and Streaming.
 */

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'user' | 'chief-of-staff' | 'agent-specialist';
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: Array<{ title: string; url: string; type: string }>;
}

export interface ConversationThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  tags: string[];
}

class ConversationManager {
  private threads: Map<string, ConversationThread> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();

  constructor() {
    this.seedDefaultThread();
  }

  private seedDefaultThread() {
    const threadId = 'conv-master-1';
    const thread: ConversationThread = {
      id: threadId,
      title: 'Chief of Staff Multi-Agent Planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 2,
      tags: ['SDLC', 'Chief of Staff', 'Architecture'],
    };

    const msgs: ChatMessage[] = [
      {
        id: 'msg-1',
        conversationId: threadId,
        sender: 'user',
        senderName: 'Lead Architect',
        content: '/build Initialize LifeOS Core Backend platform',
        timestamp: new Date(Date.now() - 120000).toISOString(),
      },
      {
        id: 'msg-2',
        conversationId: threadId,
        sender: 'chief-of-staff',
        senderName: 'Chief of Staff AI Gateway',
        content: 'Chief of Staff & 7 SDLC Specialist Departments synthesized full startup specification.',
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
    ];

    this.threads.set(threadId, thread);
    this.messages.set(threadId, msgs);
  }

  public getThreads(): ConversationThread[] {
    return Array.from(this.threads.values());
  }

  public getMessages(conversationId: string): ChatMessage[] {
    return this.messages.get(conversationId) || [];
  }

  public addMessage(conversationId: string, sender: 'user' | 'chief-of-staff', content: string, senderName?: string): ChatMessage {
    let thread = this.threads.get(conversationId);
    if (!thread) {
      thread = {
        id: conversationId,
        title: content.substring(0, 30) + '...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
        tags: ['Session'],
      };
      this.threads.set(conversationId, thread);
      this.messages.set(conversationId, []);
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      sender,
      senderName: senderName || (sender === 'user' ? 'Operator' : 'Chief of Staff AI'),
      content,
      timestamp: new Date().toISOString(),
    };

    const list = this.messages.get(conversationId)!;
    list.push(newMsg);
    thread.messageCount = list.length;
    thread.updatedAt = newMsg.timestamp;

    return newMsg;
  }
}

export const conversationManager = new ConversationManager();
