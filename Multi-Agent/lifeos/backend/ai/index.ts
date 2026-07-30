/**
 * AI Models Gateway & LLM Client Adapters
 * Support for Gemini, Claude, OpenAI, OpenRouter, and Ollama.
 */

export interface LLMRequestOptions {
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface LLMResponse {
  text: string;
  tokensUsed: number;
  finishReason: string;
  raw?: unknown;
}

export interface LLMAdapter {
  providerName: 'gemini' | 'claude' | 'openai' | 'openrouter' | 'ollama';
  generateText(prompt: string, options?: LLMRequestOptions): Promise<LLMResponse>;
  generateEmbeddings(text: string): Promise<number[]>;
}
