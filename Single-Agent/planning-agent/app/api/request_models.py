"""API request models and validation for FastAPI routes."""

from typing import List
from pydantic import BaseModel, Field, field_validator


class PlanRequest(BaseModel):
    """Request model for POST /plan endpoint."""

    project_name: str = Field(
        ...,
        min_length=2,
        description="Name of the project to generate a plan for",
        examples=["E-Commerce Recommendation Engine"],
    )
    objective: str = Field(
        ...,
        min_length=5,
        description="Primary goal or objective of the project",
        examples=["Build a scalable, real-time product recommendation microservice."],
    )
    research_summary: str = Field(
        ...,
        min_length=10,
        description="Structured output and research findings from Research Agent",
        examples=["High traffic store needs product recommendations with latency under 50ms."],
    )
    features: List[str] = Field(
        default_factory=list,
        description="List of project features or requirements",
        examples=[["User tracking", "Collaborative filtering", "REST API"]],
    )
    constraints: List[str] = Field(
        default_factory=list,
        description="List of technical, budget, or timeline constraints",
        examples=[["Max response latency 50ms", "Deploy on AWS"]],
    )

    @field_validator("project_name", "objective", "research_summary")
    @classmethod
    def strip_whitespaces(cls, value: str) -> str:
        """Sanitize whitespace in string fields."""
        if not value or not value.strip():
            raise ValueError("Field cannot be empty or whitespace only.")
        return value.strip()
