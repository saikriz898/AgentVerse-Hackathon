from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

class ResearchFilterSchema(BaseModel):
    date_range: Optional[str] = "all"
    sources: Optional[List[str]] = Field(default_factory=lambda: ["web", "docs", "github", "papers"])
    min_confidence: Optional[int] = 0
    category: Optional[str] = "General"

class ResearchStartRequest(BaseModel):
    objective: str = Field(..., description="The user's research goal or question")
    filters: Optional[ResearchFilterSchema] = Field(default_factory=ResearchFilterSchema)
    max_results: Optional[int] = 8

class QuickSearchRequest(BaseModel):
    query: str
    search_type: Optional[str] = "all"

class SummarizeRequest(BaseModel):
    content: str
    url: Optional[str] = None
    target_length: Optional[str] = "medium"

class CompareRequest(BaseModel):
    topics: List[str] = Field(..., min_items=2)
    aspects: Optional[List[str]] = None

class FactCheckRequest(BaseModel):
    claim: str
    context: Optional[str] = None

class ReferenceSchema(BaseModel):
    website_name: str
    article_title: str
    url: str
    published_date: Optional[str] = "N/A"
    author: Optional[str] = "N/A"
    credibility_score: Optional[float] = 0.85

class LifeOSResearchResponse(BaseModel):
    status: str = "success"
    agent: str = "Research"
    request_id: str
    timestamp: str
    confidence: int = Field(..., ge=0, le=100)
    summary: str
    executive_summary: Optional[str] = None
    keywords: List[str] = Field(default_factory=list)
    references: List[ReferenceSchema] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    execution_time: str
    fact_check_details: Optional[Dict[str, Any]] = None

class ResearchHistoryItem(BaseModel):
    id: UUID
    objective: str
    confidence: int
    summary: str
    created_at: str
    execution_time: str
    source_count: int

class ResearchHistoryResponse(BaseModel):
    status: str = "success"
    total: int
    items: List[ResearchHistoryItem]
