from typing import List, Dict, Any
from pydantic import BaseModel

class AgentPerformanceStat(BaseModel):
    agent_name: str
    total_reviews: int
    approved_count: int
    rejected_count: int
    approval_rate: float
    avg_quality_score: float

class IssueTrendStat(BaseModel):
    category: str
    count: int
    percentage: float

class QualityDistributionStat(BaseModel):
    tier: str  # Excellent (90-100), Good (80-89), Acceptable (70-79), Needs Improvement (50-69), Rejected (<50)
    count: int
    percentage: float

class DashboardStats(BaseModel):
    total_reviews: int
    approved_reviews: int
    rejected_reviews: int
    approval_rate: float
    avg_quality_score: float
    recent_reviews: List[Dict[str, Any]]
    agent_performance: List[AgentPerformanceStat]
    issue_trends: List[IssueTrendStat]
    quality_distribution: List[QualityDistributionStat]
