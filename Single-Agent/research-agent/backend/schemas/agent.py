from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChiefOfStaffQueryRequest(BaseModel):
    query: str
    calling_agent: str = "ChiefOfStaff"
    priority: Optional[str] = "high"

class MemorySyncPayload(BaseModel):
    agent: str = "Research"
    request_id: str
    summary: str
    references: List[Dict[str, Any]]
    confidence: int
    keywords: List[str]
    topic: str
    timestamp: str

class InterAgentQueryRequest(BaseModel):
    sender_agent: str
    target_agent: str = "Research"
    action: str = "search"  # search, summarize, get_result, fact_check
    payload: Dict[str, Any]
