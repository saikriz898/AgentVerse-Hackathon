export interface Reference {
  website_name: string;
  article_title: string;
  url: string;
  published_date?: string;
  author?: string;
  credibility_score?: number;
}

export interface ResearchFilters {
  date_range?: string;
  sources?: string[];
  min_confidence?: number;
  category?: string;
}

export interface ResearchResponse {
  status: string;
  agent: string;
  request_id: string;
  timestamp: string;
  confidence: number;
  summary: string;
  executive_summary?: string;
  keywords: string[];
  references: Reference[];
  recommendations: string[];
  execution_time: string;
  fact_check_details?: {
    verified: boolean;
    confidence_level: string;
    matching_source_count: number;
    contradictions_count: number;
    verification_status: string;
    details: any[];
  };
}

export interface HistoryItem {
  id: string;
  objective: string;
  confidence: number;
  summary: string;
  created_at: string;
  execution_time: string;
  source_count: number;
}

export interface AnalyticsMetrics {
  total_requests: number;
  todays_searches: number;
  sources_used: number;
  average_confidence: number;
  average_response_time: string;
}

export interface AnalyticsData {
  metrics: AnalyticsMetrics;
  charts: {
    source_distribution: { name: string; value: number; color: string }[];
    confidence_distribution: { range: string; count: number }[];
    top_topics: { topic: string; count: number }[];
    most_used_sources: { domain: string; count: number }[];
  };
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
}
