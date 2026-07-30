import { ai } from '../config/gemini.js';
import { logger } from '../utils/logger.js';

/**
 * Summarizes long conversations or document streams for archiving into memory.
 */
export async function summarizeConversation(
  messages: { role: string; content: string }[]
): Promise<{ title: string; summary: string }> {
  const formatted = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

  if (ai) {
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Summarize the following agent conversation into a concise memory entry. Return valid JSON in the format: {"title": "...", "summary": "..."}\n\n${formatted}`;
      const response = await model.generateContent(prompt);
      const textResult = response.response.text();

      if (textResult) {
        const cleaned = textResult.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (err: any) {
      logger.warn(`Gemini summarization failed: ${err.message}. Using fallback summary generator.`);
    }
  }

  // Fallback summary generator
  const firstUserMsg = messages.find((m) => m.role === 'user')?.content || 'Conversation Summary';
  const title = firstUserMsg.slice(0, 50) + (firstUserMsg.length > 50 ? '...' : '');
  const summary = messages.map((m) => m.content).join(' ').slice(0, 300) + '...';

  return { title, summary };
}
