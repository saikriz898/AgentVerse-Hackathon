import { describe, it, expect } from 'vitest';
import { checkDuplicateMemory } from '../../src/engines/duplicate.engine.js';

describe('Duplicate Detection Engine Unit Tests', () => {
  it('should flag candidate vector with >0.92 similarity as duplicate', () => {
    const candidateVector = [1, 0, 0, 0];
    const existing = [
      { memoryId: 'mem-1', vector: [0.99, 0.01, 0, 0] },
      { memoryId: 'mem-2', vector: [0, 1, 0, 0] },
    ];

    const result = checkDuplicateMemory(candidateVector, existing, 0.92);
    expect(result.isDuplicate).toBe(true);
    expect(result.duplicateId).toBe('mem-1');
  });

  it('should not flag candidate vector with low similarity as duplicate', () => {
    const candidateVector = [1, 0, 0, 0];
    const existing = [
      { memoryId: 'mem-1', vector: [0, 1, 0, 0] },
      { memoryId: 'mem-2', vector: [0, 0, 1, 0] },
    ];

    const result = checkDuplicateMemory(candidateVector, existing, 0.92);
    expect(result.isDuplicate).toBe(false);
  });
});
