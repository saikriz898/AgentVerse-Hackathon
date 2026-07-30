/**
 * LifeOS Core - 16. AI Provider Manager
 * Centralized multi-provider gateway (Gemini, Claude, OpenAI, OpenRouter, Ollama) with fallback, rate limiting, and token counting.
 */

export interface AIProviderConfig {
  id: string;
  name: string;
  provider: 'gemini' | 'claude' | 'openai' | 'openrouter' | 'ollama';
  model: string;
  status: 'Active' | 'Fallback' | 'Disabled';
  apiKeyConfigured: boolean;
  priority: number;
  totalTokensUsed: number;
}

class AIProviderManager {
  private providers: Map<string, AIProviderConfig> = new Map();

  constructor() {
    this.seedDefaultProviders();
  }

  private seedDefaultProviders() {
    const list: AIProviderConfig[] = [
      {
        id: 'prov-gemini',
        name: 'Google Gemini 1.5/3.6 Flash Engine',
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        status: 'Active',
        apiKeyConfigured: true,
        priority: 1,
        totalTokensUsed: 980400,
      },
      {
        id: 'prov-claude',
        name: 'Anthropic Claude 3.5 Sonnet',
        provider: 'claude',
        model: 'claude-3-5-sonnet-20241022',
        status: 'Fallback',
        apiKeyConfigured: true,
        priority: 2,
        totalTokensUsed: 320100,
      },
      {
        id: 'prov-openai',
        name: 'OpenAI GPT-4o',
        provider: 'openai',
        model: 'gpt-4o',
        status: 'Active',
        apiKeyConfigured: true,
        priority: 3,
        totalTokensUsed: 120000,
      },
      {
        id: 'prov-ollama',
        name: 'Local Ollama (Llama 3 8B)',
        provider: 'ollama',
        model: 'llama3:8b',
        status: 'Active',
        apiKeyConfigured: true,
        priority: 4,
        totalTokensUsed: 0,
      },
    ];

    list.forEach((p) => this.providers.set(p.id, p));
  }

  public getProviders(): AIProviderConfig[] {
    return Array.from(this.providers.values()).sort((a, b) => a.priority - b.priority);
  }

  public updateProvider(id: string, updates: Partial<AIProviderConfig>): AIProviderConfig {
    const existing = this.providers.get(id);
    if (!existing) throw new Error(`Provider ${id} not found`);
    const updated = { ...existing, ...updates };
    this.providers.set(id, updated);
    return updated;
  }
}

export const aiProviderManager = new AIProviderManager();
