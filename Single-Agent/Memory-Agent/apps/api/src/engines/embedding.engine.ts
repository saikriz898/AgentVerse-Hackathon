import { ai } from '../config/gemini.js';
import { logger } from '../utils/logger.js';

/**
 * Generates a 768-dimensional vector embedding.
 * Uses Gemini API text-embedding-004 / embedding-001 if configured, or deterministic fallback vector for local dev.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (ai) {
    try {
      const model = ai.getGenerativeModel({ model: 'embedding-001' });
      const response = await model.embedContent(text);
      if (response.embedding?.values) {
        return response.embedding.values;
      }
    } catch (_err: any) {
      try {
        const fallbackModel = ai.getGenerativeModel({ model: 'text-embedding-004' });
        const response = await fallbackModel.embedContent(text);
        if (response.embedding?.values) {
          return response.embedding.values;
        }
      } catch (_e: any) {
        // Fallback gracefully to local deterministic 768-dim hash vector
      }
    }
  }

  // Deterministic 768-dim hash vector fallback for offline local dev
  const dim = 768;
  const vector: number[] = new Array(dim).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < dim; i++) {
    vector[i] = Math.sin(hash + i);
  }

  // Normalize vector to unit length
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return norm === 0 ? vector : vector.map((v) => v / norm);
}
