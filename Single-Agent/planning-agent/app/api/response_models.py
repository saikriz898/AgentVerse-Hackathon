"""API response models for FastAPI routes."""

from typing import Dict, Any
from pydantic import BaseModel, Field

from app.models.planning_result import PlanningResult


class HealthResponse(BaseModel):
    """Response model for GET /health endpoint."""

    status: str = Field(default="healthy", description="Status of the planning agent service")
    service: str = Field(default="AI Planning Agent", description="Service name")
    version: str = Field(default="0.1.0", description="Service version")
    model: str = Field(..., description="Configured LLM model name")


# PlanResponse directly mirrors PlanningResult to strictly match the requested JSON schema
PlanResponse = PlanningResult
