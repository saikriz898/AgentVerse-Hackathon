import { cosineSimilarity } from '../utils/cosine.js';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  duplicateId?: string;
  similarity: number;
}

/**
 * Checks if a candidate memory content is semantically identical or near-duplicate to existing memory entries.
 */
export function checkDuplicateMemory(
  candidateVector: number[],
  existingEmbeddings: { memoryId: string; vector: number[] }[],
  threshold = 0.92
): DuplicateCheckResult {
  let highestSim = 0;
  let matchId: string | undefined;

  for (const { memoryId, vector } of existingEmbeddings) {
    const sim = cosineSimilarity(candidateVector, vector);
    if (sim > highestSim) {
      highestSim = sim;
      matchId = memoryId;
    }
  }

  return {
    isDuplicate: highestSim >= threshold,
    duplicateId: matchId,
    similarity: highestSim,
  };
}
