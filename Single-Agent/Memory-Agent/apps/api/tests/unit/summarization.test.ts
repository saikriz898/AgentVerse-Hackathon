import { describe, it, expect } from 'vitest';
import { summarizeConversation } from '../../src/engines/summarization.engine.js';

describe('Conversation Summarization Engine Unit Tests', () => {
  it('should generate title and summary from message stream', async () => {
    const messages = [
      { role: 'user', content: 'What is the architecture of Agent 3 Memory Service?' },
      { role: 'assistant', content: 'Agent 3 Memory Service provides long-term, working, and vector memory with hybrid search.' },
    ];

    const result = await summarizeConversation(messages);
    expect(result.title).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(typeof result.title).toBe('string');
  });
});
