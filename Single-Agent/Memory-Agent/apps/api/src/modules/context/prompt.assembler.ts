export interface PromptAssemblyInput {
  provider?: 'gemini' | 'openai' | 'claude' | 'ollama';
  systemRole?: string;
  query: string;
  contextText: string;
}

export function assembleMultiLLMPrompt(input: PromptAssemblyInput): { systemPrompt: string; userPrompt: string } {
  const provider = input.provider || 'gemini';
  const role = input.systemRole || 'You are an AI assistant powered by the Memory Agent Platform.';

  const systemPrompt = `${role}\n\n[CONTEXT MEMORY BANK]\n${input.contextText}\n\nInstructions: Answer accurately based on the above context memory. If details are absent, state so.`;

  if (provider === 'claude') {
    return {
      systemPrompt: `<system>${systemPrompt}</system>`,
      userPrompt: `<user>${input.query}</user>`,
    };
  }

  return {
    systemPrompt,
    userPrompt: input.query,
  };
}
