/**
 * LifeOS Platform & Multi-Agent Architecture Type Definitions
 * 
 * Strict, production-ready interfaces for Chief of Staff and 6 specialist agents:
 * Research, Planning, Execution, Finance, Review, Communication, and Memory Engine.
 */

// ============================================================================
// SYSTEM ROLES & AGENT FLEET
// ============================================================================

export type AgentRole =
  | 'chief_of_staff'
  | 'research_agent'
  | 'planning_agent'
  | 'execution_agent'
  | 'finance_agent'
  | 'review_agent'
  | 'communication_agent';

export type AgentStatus = 'idle' | 'analyzing' | 'executing' | 'verifying' | 'completed' | 'error';

export interface AgentMetadata {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  version: string;
  status: AgentStatus;
  capabilities: string[];
  supportedOutputs: string[];
  lastActive: string;
}

// ============================================================================
// CHIEF OF STAFF & WORKFLOW ORCHESTRATION
// ============================================================================

export interface WorkflowStep {
  id: string;
  agentRole: AgentRole;
  title: string;
  status: AgentStatus;
  dependsOn?: string[];
  payload?: Record<string, unknown>;
  result?: Record<string, unknown>;
  qualityScore?: number;
  durationMs?: number;
}

export interface OrchestrationPlan {
  id: string;
  userPrompt: string;
  objective: string;
  assignedAgents: AgentRole[];
  steps: WorkflowStep[];
  status: 'pending' | 'in_progress' | 'passed_qa' | 'rejected' | 'completed';
  overallScore?: number;
  createdAt: string;
}

// ============================================================================
// SPECIALIST AGENT PAYLOADS & RESPONSES
// ============================================================================

// 1. Research Agent Payload
export interface ResearchReference {
  title: string;
  url: string;
  publishedDate?: string;
  credibilityScore: number;
}

export interface ResearchPayload {
  topic: string;
  summary: string;
  executiveSummary: string;
  confidenceScore: number;
  keywords: string[];
  references: ResearchReference[];
  recommendations: string[];
}

// 2. Planning Agent Payload
export interface TaskBreakdown {
  taskId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedHours: number;
  dependencies: string[];
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  deliverables: string[];
}

export interface PlanningPayload {
  projectName: string;
  objective: string;
  tasks: TaskBreakdown[];
  milestones: Milestone[];
  timelineWeeks: number;
  risks: string[];
}

// 3. Finance Agent Payload
export interface CostParameter {
  category: 'frontend' | 'backend' | 'database' | 'ai_api' | 'devops' | 'qa' | 'cloud' | 'maintenance';
  name: string;
  monthlyCost: number;
  oneTimeCost: number;
}

export interface CloudProviderComparison {
  provider: 'AWS' | 'Azure' | 'GCP' | 'DigitalOcean' | 'Vercel' | 'Supabase' | 'Neon';
  estimatedMonthly: number;
  pros: string[];
  cons: string[];
}

export interface FinancePayload {
  projectName: string;
  totalEstimatedCost: number;
  parameters: CostParameter[];
  cloudComparisons: CloudProviderComparison[];
  roiPaybackMonths: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
}

// 4. Review Agent (QA Verification) Payload
export interface QAValidationIssue {
  code: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  field?: string;
  message: string;
  suggestion: string;
}

export interface ReviewPayload {
  status: 'approved' | 'rejected';
  qualityScore: number; // 0 - 100 (Threshold >= 80 for approval)
  confidence: number;
  issues: QAValidationIssue[];
  warnings: string[];
  suggestions: string[];
  summary: string;
}

// 5. Communication Agent Payload
export type DocumentFormat =
  | 'executive_summary'
  | 'project_report'
  | 'markdown'
  | 'html'
  | 'presentation_slide'
  | 'daily_standup'
  | 'api_documentation'
  | 'release_notes';

export interface CommunicationPayload {
  documentType: DocumentFormat;
  title: string;
  summary: string;
  contentMarkdown: string;
  contentHtml: string;
  emailSubject?: string;
  emailBody?: string;
  targetAudience: 'executive' | 'client' | 'developer' | 'manager' | 'team';
}

// ============================================================================
// MEMORY ENGINE & VECTOR SEARCH
// ============================================================================

export interface MemoryEntry {
  id: string;
  partition: 'working' | 'long_term' | 'knowledge_base' | 'project_workspace';
  title: string;
  content: string;
  vectorEmbeddingId?: string;
  importance: number; // 1 - 10
  relevanceScore?: number; // 0.0 - 1.0
  tags: string[];
  createdAt: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'concept' | 'agent' | 'project' | 'task' | 'memory';
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  label?: string;
}

export interface TopologyGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ============================================================================
// UI SYSTEM & USER SETTINGS
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  theme: ThemeMode;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  activeAgentsCount: number;
}
