export interface IssueItem {
  code: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  message: string;
  field?: string;
  suggestion?: string;
}

export interface QualityScoreBreakdown {
  accuracy: number;
  completeness: number;
  consistency: number;
  correctness: number;
  formatting: number;
  grammar: number;
  structure: number;
  security: number;
  performance: number;
  maintainability: number;
  compliance: number;
  overall_score: number;
}

export interface StandardReviewOutput {
  status: 'approved' | 'rejected';
  quality_score: number;
  confidence: number;
  issues: IssueItem[];
  warnings: string[];
  suggestions: string[];
  summary: string;
  score_breakdown?: QualityScoreBreakdown;
}

export interface ReviewRecord {
  id: string;
  agent_name: string;
  review_type: string;
  input_data: any;
  review_result: StandardReviewOutput;
  quality_score: number;
  confidence: number;
  issues: IssueItem[];
  warnings: string[];
  suggestions: string[];
  status: 'approved' | 'rejected' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface AgentPerformanceStat {
  agent_name: string;
  total_reviews: number;
  approved_count: number;
  rejected_count: number;
  approval_rate: number;
  avg_quality_score: number;
}

export interface IssueTrendStat {
  category: string;
  count: number;
  percentage: number;
}

export interface QualityDistributionStat {
  tier: string;
  count: number;
  percentage: number;
}

export interface DashboardStats {
  total_reviews: number;
  approved_reviews: number;
  rejected_reviews: number;
  approval_rate: number;
  avg_quality_score: number;
  recent_reviews: Array<{
    id: string;
    agent_name: string;
    review_type: string;
    quality_score: number;
    status: 'approved' | 'rejected';
    created_at: string;
  }>;
  agent_performance: AgentPerformanceStat[];
  issue_trends: IssueTrendStat[];
  quality_distribution: QualityDistributionStat[];
}

export interface ReviewRule {
  id: string;
  name: string;
  agent_name: string;
  review_type: string;
  rule_config: any;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}
