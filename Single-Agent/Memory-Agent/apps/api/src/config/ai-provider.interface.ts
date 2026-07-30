export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export interface CompletionResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  name: string;
  generateText(prompt: string, options?: CompletionOptions): Promise<CompletionResponse>;
  embedText(text: string): Promise<number[]>;
}
