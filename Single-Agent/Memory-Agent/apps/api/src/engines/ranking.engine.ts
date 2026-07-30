import { cosineSimilarity } from '../utils/cosine.js';

export interface ScoredMemory {
  id: string;
  title: string;
  content: string;
  type: string;
  importance: number;
  pinned: boolean;
  createdAt: string;
  relevanceScore?: number;
  recencyScore?: number;
  finalScore?: number;
}

/**
 * Calculates Reciprocal Rank Fusion (RRF) score:
 * RRF(d) = sum( 1 / (k + rank_i(d)) )
 */
export function reciprocalRankFusion(
  textRanked: ScoredMemory[],
  vectorRanked: ScoredMemory[],
  k = 60
): ScoredMemory[] {
  const map = new Map<string, { item: ScoredMemory; score: number }>();

  textRanked.forEach((item, index) => {
    const rrf = 1 / (k + (index + 1));
    map.set(item.id, { item, score: rrf });
  });

  vectorRanked.forEach((item, index) => {
    const rrf = 1 / (k + (index + 1));
    const existing = map.get(item.id);
    if (existing) {
      existing.score += rrf;
    } else {
      map.set(item.id, { item, score: rrf });
    }
  });

  const merged = Array.from(map.values()).map(({ item, score }) => ({
    ...item,
    relevanceScore: score,
  }));

  return merged.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
}

/**
 * Calculates final score for context building:
 * FinalScore = (Relevance * 0.5) + (Importance * 0.3) + (Recency * 0.2)
 * Pinned items receive boost.
 */
export function computeContextScores(
  items: ScoredMemory[],
  queryVector?: number[],
  itemVectors?: Map<string, number[]>
): ScoredMemory[] {
  const now = Date.now();

  return items.map((item) => {
    // 1. Relevance Score
    let relevance = item.relevanceScore || 0.5;
    if (queryVector && itemVectors?.has(item.id)) {
      relevance = cosineSimilarity(queryVector, itemVectors.get(item.id)!);
    }

    // 2. Recency Score (Exponential decay based on age in days)
    const ageMs = Math.max(0, now - new Date(item.createdAt).getTime());
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    const recency = Math.exp(-0.1 * ageDays);

    // 3. Importance Score
    const importance = item.importance || 0.5;

    // Composite calculation
    let finalScore = relevance * 0.5 + importance * 0.3 + recency * 0.2;

    // Pinned priority boost
    if (item.pinned) {
      finalScore += 10.0;
    }

    return {
      ...item,
      relevanceScore: relevance,
      recencyScore: recency,
      finalScore,
    };
  }).sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));
}
