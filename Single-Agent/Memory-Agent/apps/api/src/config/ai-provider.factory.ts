import { LLMProvider, CompletionOptions, CompletionResponse } from './ai-provider.interface.js';
import { ai } from './gemini.js';
import { generateEmbedding } from '../engines/embedding.engine.js';
import { logger } from '../utils/logger.js';

export class GeminiLLMProvider implements LLMProvider {
  name = 'google-gemini';

  async generateText(prompt: string, options?: CompletionOptions): Promise<CompletionResponse> {
    if (ai) {
      try {
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const res = await model.generateContent(prompt);
        const text = res.response.text() || '';
        return {
          text,
          usage: { promptTokens: Math.ceil(prompt.length / 4), completionTokens: Math.ceil(text.length / 4), totalTokens: Math.ceil((prompt.length + text.length) / 4) },
        };
      } catch (err: any) {
        logger.warn(`Gemini generation error: ${err.message}. Using fallback generator.`);
      }
    }

    return {
      text: `[Fallback Response] Processed query: "${prompt.slice(0, 50)}..."`,
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 },
    };
  }

  async embedText(text: string): Promise<number[]> {
    return generateEmbedding(text);
  }
}

export class AIProviderFactory {
  static getProvider(): LLMProvider {
    return new GeminiLLMProvider();
  }
}
