export interface PromptTemplate {
  id: string;
  name: string;
  category: 'Summarization' | 'Coding' | 'Writing' | 'Analysis' | 'Translation' | 'Documentation' | 'Custom';
  promptText: string;
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  version: number;
  updatedAt: string;
}

export interface PromptEvaluation {
  clarityScore: number;
  tokenCount: number;
  estimatedCost: string;
  optimizationScore: number;
  suggestions: string[];
  errors: string[];
  warnings: string[];
  variablesFound: string[];
  missingVariables: string[];
}

export class PromptService {
  private templates: PromptTemplate[] = [
    {
      id: 'tmpl-1',
      name: 'Executive Memory Synthesizer',
      category: 'Summarization',
      promptText: 'Synthesize the following active memory entries into a structured executive brief:\n\nWORKSPACE: {{workspace}}\nUSER QUERY: {{user_query}}',
      model: 'Gemini 2.5 Pro',
      temperature: 0.2,
      topP: 0.95,
      maxTokens: 4096,
      version: 3,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tmpl-2',
      name: 'Graph Entity & Edge Extractor',
      category: 'Analysis',
      promptText: 'Extract all primary entity nodes and directed relationship edges from the input text:\n\nPROJECT: {{project}}\nINPUT: {{user_query}}',
      model: 'Gemini 2.5 Pro',
      temperature: 0.1,
      topP: 0.9,
      maxTokens: 2048,
      version: 2,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tmpl-3',
      name: 'Semantic QA Assistant',
      category: 'Writing',
      promptText: 'Answer the user query accurately based on verified workspace context:\n\nUSER ROLE: {{user_role}}\nDATE: {{date}}\nQUERY: {{user_query}}',
      model: 'Gemini 1.5 Flash',
      temperature: 0.3,
      topP: 0.95,
      maxTokens: 2048,
      version: 4,
      updatedAt: new Date().toISOString(),
    },
  ];

  async listTemplates(): Promise<PromptTemplate[]> {
    return this.templates;
  }

  async getTemplate(id: string): Promise<PromptTemplate | null> {
    return this.templates.find((t) => t.id === id) || null;
  }

  async evaluatePrompt(promptText: string, providedVars: Record<string, string> = {}): Promise<PromptEvaluation> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const trimmed = promptText ? promptText.trim() : '';

    // 1. Check for empty prompt
    if (!trimmed) {
      errors.push('Prompt text cannot be empty or whitespace only.');
    }

    // 2. Syntax validation: unclosed braces {{ without }}
    const lines = (promptText || '').split('\n');
    lines.forEach((line, idx) => {
      if ((line.match(/\{\{/g) || []).length > (line.match(/\}\}/g) || []).length) {
        errors.push(`Syntax Error (Line ${idx + 1}): Unclosed variable placeholder '{{'.`);
      }
    });

    // 3. Extract variables
    const matches = Array.from(promptText.matchAll(/\{\{([^}]+)\}\}/g));
    const variablesFound = Array.from(new Set(matches.map((m) => m[1].trim())));

    // 4. Missing variables check
    const missingVariables = variablesFound.filter((v) => !providedVars[v] || !providedVars[v].trim());
    missingVariables.forEach((mv) => {
      errors.push(`Missing required variable: {{${mv}}}`);
    });

    if (variablesFound.length === 0 && trimmed.length > 0) {
      warnings.push('No dynamic variables found in prompt. Consider using placeholders like {{user_query}}.');
    }

    const tokenCount = Math.ceil((promptText || '').length / 4);
    if (tokenCount > 2000) {
      warnings.push('Prompt length exceeds 2,000 tokens. Consider optimizing context brevity.');
    }

    const clarityScore = errors.length > 0 ? 0 : promptText.length > 50 ? 94 : 78;
    const optimizationScore = errors.length > 0 ? 0 : missingVariables.length === 0 ? 98 : 60;

    const suggestions: string[] = [];
    if (errors.length === 0) {
      suggestions.push('Prompt syntax and variable placeholders are valid.');
      suggestions.push(`Token usage estimate: ${tokenCount} tokens.`);
    } else {
      suggestions.push(`Fix ${errors.length} validation error(s) before executing model prompt.`);
    }

    return {
      clarityScore,
      tokenCount,
      estimatedCost: `$${(tokenCount * 0.000002).toFixed(5)}`,
      optimizationScore,
      suggestions,
      errors,
      warnings,
      variablesFound,
      missingVariables,
    };
  }

  async testExecution(promptText: string, variables: Record<string, string>, model: string) {
    const evaluation = await this.evaluatePrompt(promptText, variables);

    if (evaluation.errors.length > 0) {
      return {
        model,
        substitutedPrompt: promptText,
        status: 'error',
        errors: evaluation.errors,
        warnings: evaluation.warnings,
        output: `PROMPT VALIDATION FAILED\n\nErrors encountered:\n- ${evaluation.errors.join('\n- ')}`,
        stats: {
          tokens: evaluation.tokenCount,
          latencyMs: 0,
          cost: '$0.00000',
        },
      };
    }

    let substituted = promptText;
    for (const [key, val] of Object.entries(variables)) {
      substituted = substituted.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val);
    }

    const tokens = Math.ceil(substituted.length / 4) + 120;
    return {
      model,
      substitutedPrompt: substituted,
      status: 'success',
      errors: [],
      warnings: evaluation.warnings,
      output: `MODEL EXECUTION RESPONSE (${model})\n\nSubstituted System Prompt:\n${substituted}\n\nGenerated Completion:\nBased on the provided context, the operation completed successfully with zero validation errors.`,
      stats: {
        tokens,
        latencyMs: Math.floor(Math.random() * 80) + 320,
        cost: `$${(tokens * 0.000002).toFixed(5)}`,
      },
    };
  }
}

export const promptService = new PromptService();
