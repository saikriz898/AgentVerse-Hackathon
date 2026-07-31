/**
 * LifeOS Core - Prompt Optimizer Engine
 * Analyzes incoming user prompts, detects missing constraints, requirements, stakeholders,
 * deliverables, and assumptions, and expands the prompt into an optimized execution plan.
 */

export interface OptimizedPromptPlan {
  originalPrompt: string;
  expandedPrompt: string;
  detectedGaps: {
    missingRequirements: string[];
    missingStakeholders: string[];
    missingConstraints: string[];
    missingDeliverables: string[];
    missingAssumptions: string[];
  };
  complexityScore: number;
  estimatedTokens: number;
  recommendedModel: string;
  targetAgents: string[];
  timestamp: string;
}

class PromptOptimizer {
  public optimize(rawPrompt: string): OptimizedPromptPlan {
    const timestamp = new Date().toISOString();
    const promptLower = rawPrompt.toLowerCase();

    // 1. Analyze prompt intent and detect gaps
    const missingRequirements: string[] = [];
    const missingStakeholders: string[] = [];
    const missingConstraints: string[] = [];
    const missingDeliverables: string[] = [];
    const missingAssumptions: string[] = [];

    if (!promptLower.includes('security') && !promptLower.includes('auth')) {
      missingRequirements.push('Authentication & Security Access Control');
    }
    if (!promptLower.includes('database') && !promptLower.includes('storage') && !promptLower.includes('schema')) {
      missingRequirements.push('Database Schema & Data Retention Boundaries');
    }

    if (!promptLower.includes('user') && !promptLower.includes('admin') && !promptLower.includes('client')) {
      missingStakeholders.push('Target User Persona & Admin Role Definitions');
    }

    if (!promptLower.includes('budget') && !promptLower.includes('cost') && !promptLower.includes('latency')) {
      missingConstraints.push('Latency Thresholds (<200ms) & Token Cost Limits');
    }

    if (!promptLower.includes('doc') && !promptLower.includes('prd') && !promptLower.includes('api')) {
      missingDeliverables.push('OpenAPI v3 Specification & 10-Stage PRD Document');
    }

    missingAssumptions.push('Assumes Multi-Tenant Architecture with pgvector RRF Hybrid Memory');

    // 2. Expand prompt with full technical specification parameters
    const expandedPrompt = `[OPTIMIZED EXECUTION PLAN]
Goal: ${rawPrompt}

Target Deliverables:
- Enterprise Software Architecture with OpenAPI v3 API Contracts
- Neon pgvector 768-Dim RRF Hybrid Vector Memory Integration
- 18-Stage AIDLC Autonomous Execution Pipeline
- Automated Quality Assurance Gate (Security Score >= 80)

Technical Constraints:
- Latency Target: <150ms per microservice call
- Security Audit: Zero SQLi, Secret Leakage, or OWASP Risk
- State Management: Live WebSocket Gateway Synchronization

Target Microservice Fleet: Chief of Staff, Research Agent, Planning Agent, Review Agent, Finance Agent, Memory Agent`;

    // 3. Target agent routing & model recommendation
    const targetAgents = ['Chief of Staff'];
    if (promptLower.includes('research') || promptLower.includes('search') || promptLower.includes('market')) {
      targetAgents.push('Research Agent');
    }
    if (promptLower.includes('plan') || promptLower.includes('task') || promptLower.includes('build')) {
      targetAgents.push('Planning Agent');
    }
    if (promptLower.includes('security') || promptLower.includes('review') || promptLower.includes('qa')) {
      targetAgents.push('Review Agent');
    }
    if (promptLower.includes('cost') || promptLower.includes('finance') || promptLower.includes('budget')) {
      targetAgents.push('Finance Agent');
    }
    targetAgents.push('Memory Agent');

    return {
      originalPrompt: rawPrompt,
      expandedPrompt,
      detectedGaps: {
        missingRequirements,
        missingStakeholders,
        missingConstraints,
        missingDeliverables,
        missingAssumptions,
      },
      complexityScore: Math.min(100, Math.max(45, rawPrompt.length * 2)),
      estimatedTokens: Math.max(1200, rawPrompt.length * 8),
      recommendedModel: 'gemini-3.6-pro',
      targetAgents,
      timestamp,
    };
  }
}

export const promptOptimizer = new PromptOptimizer();
