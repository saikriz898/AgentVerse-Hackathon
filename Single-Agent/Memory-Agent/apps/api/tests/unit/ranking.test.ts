import { describe, it, expect } from 'vitest';
import { reciprocalRankFusion } from '../../src/engines/ranking.engine.js';

describe('Reciprocal Rank Fusion (RRF) Ranking Engine', () => {
  it('should rank items present in both text and vector search higher', () => {
    const textRanked = [
      { id: '1', title: 'Doc A', content: 'a', type: 'long_term', importance: 0.5, pinned: false, createdAt: new Date().toISOString() },
      { id: '2', title: 'Doc B', content: 'b', type: 'long_term', importance: 0.5, pinned: false, createdAt: new Date().toISOString() },
    ];

    const vectorRanked = [
      { id: '2', title: 'Doc B', content: 'b', type: 'long_term', importance: 0.5, pinned: false, createdAt: new Date().toISOString() },
      { id: '3', title: 'Doc C', content: 'c', type: 'long_term', importance: 0.5, pinned: false, createdAt: new Date().toISOString() },
    ];

    const fused = reciprocalRankFusion(textRanked, vectorRanked, 60);

    expect(fused[0].id).toBe('2'); // Present in both lists -> highest RRF score
  });
});
