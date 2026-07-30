import { describe, it, expect } from 'vitest';
import { cosineSimilarity } from '../../src/utils/cosine.js';

describe('Cosine Similarity Engine Unit Tests', () => {
  it('should return 1.0 for identical vectors', () => {
    const v1 = [1, 2, 3, 4];
    const v2 = [1, 2, 3, 4];
    expect(cosineSimilarity(v1, v2)).toBeCloseTo(1.0);
  });

  it('should return 0.0 for orthogonal vectors', () => {
    const v1 = [1, 0];
    const v2 = [0, 1];
    expect(cosineSimilarity(v1, v2)).toBeCloseTo(0.0);
  });

  it('should return -1.0 for opposite vectors', () => {
    const v1 = [1, 1];
    const v2 = [-1, -1];
    expect(cosineSimilarity(v1, v2)).toBeCloseTo(-1.0);
  });
});
