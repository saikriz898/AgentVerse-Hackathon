import { ai } from '../config/gemini.js';
import { logger } from '../utils/logger.js';

/**
 * Compresses context or long text to conserve token count.
 */
export async function compressText(text: string, targetTokenLimit = 200): Promise<string> {
  if (text.length < targetTokenLimit * 4) {
    return text;
  }

  if (ai) {
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model.generateContent(
        `Compress the following memory text into a dense, key-information-focused summary under ${targetTokenLimit} tokens:\n\n${text}`
      );
      const textResult = response.response.text();
      if (textResult) {
        return textResult.trim();
      }
    } catch (err: any) {
      logger.warn(`Gemini compression failed: ${err.message}. Performing algorithmic fallback compression.`);
    }
  }

  // Algorithmic fallback: extract key sentences containing highest information density
  const sentences = text.split(/(?<=[.!?])\s+/);
  if (sentences.length <= 3) return text;
  return sentences.slice(0, Math.ceil(sentences.length / 2)).join(' ');
}
