from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class EstimationRequest(BaseModel):
    project_name: str = Field(..., example="SaaS AI Copilot")
    project_description: Optional[str] = Field(None, example="Enterprise document intelligence and query agent.")
    project_type: str = Field("SaaS", example="SaaS Platform")
    industry: str = Field("FinTech", example="FinTech & Banking")
    expected_users: int = Field(50000, example=50000)
    expected_timeline_months: int = Field(6, example=6)
    technology_stack: List[str] = Field(default_factory=lambda: ["React 19", "FastAPI", "PostgreSQL", "Redis", "Docker"])
    features: List[str] = Field(default_factory=lambda: ["User Management", "Subscription Billing", "AI Search", "Dashboard Analytics"])
    auth_type: str = "OAuth2 + JWT + RBAC"
    payment_gateway: str = "Stripe"
    cloud_provider: str = "AWS"
    database_type: str = "PostgreSQL + Redis"
    ai_features: List[str] = Field(default_factory=lambda: ["RAG Search", "Document Embeddings", "LLM Summarization"])
    deployment_preference: str = "Kubernetes + EKS"
    security_requirements: str = "SOC2 + HIPAA + SSL"
    scalability_requirements: str = "High (Auto-scaling & Multi-Region)"
    integrations: List[str] = Field(default_factory=lambda: ["SendGrid", "HubSpot", "Twilio"])

class LineItemCost(BaseModel):
    category: str
    item_name: str
    estimated_cost: float
    monthly_cost: float
    annual_cost: float
    percentage_of_budget: float
    risk_level: str  # Low, Medium, High
    optimization_suggestions: List[str]

class EstimationResponse(BaseModel):
    id: str
    project_name: str
    project_type: str
    industry: str
    expected_users: int
    expected_timeline_months: int

    total_estimated_cost: float
    monthly_operating_cost: float
    annual_operating_cost: float

    dev_cost: float
    infra_cost: float
    ai_cost: float
    devops_cost: float
    maintenance_cost: float

    confidence_score: float
    reasoning: str
    cost_breakdown: Dict[str, Any]
    optimization_suggestions: List[str]
    risk_assessment: List[Dict[str, Any]]
    created_at: datetime
