import { describe, it, expect } from 'vitest';
import { computeContextScores } from '../../src/engines/ranking.engine.js';

describe('Context Scoring & Pinned Priority Unit Test', () => {
  it('should give pinned items a massive score boost', () => {
    const items = [
      { id: '1', title: 'Unpinned', content: 'c1', type: 'long_term', importance: 0.9, pinned: false, createdAt: new Date().toISOString() },
      { id: '2', title: 'Pinned Item', content: 'c2', type: 'long_term', importance: 0.1, pinned: true, createdAt: new Date().toISOString() },
    ];

    const scored = computeContextScores(items);
    expect(scored[0].id).toBe('2'); // Pinned item must come first
  });
});
