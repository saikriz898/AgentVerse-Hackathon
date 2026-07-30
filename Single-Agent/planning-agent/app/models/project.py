"""Project input domain model."""

from typing import List
from pydantic import BaseModel, Field


class ProjectInput(BaseModel):
    """Structured input model received from Research Agent or API request."""

    project_name: str = Field(
        ...,
        description="Name of the project to generate plan for",
        examples=["AI Customer Support Automation"],
    )
    objective: str = Field(
        ...,
        description="Primary goal or objective of the project",
        examples=["Automate tier-1 support tickets using RAG and LLM agents."],
    )
    research_summary: str = Field(
        ...,
        description="Structured output and findings from the Research Agent",
        examples=["High volumes of repetitive tickets. RAG architecture with vector database recommended."],
    )
    features: List[str] = Field(
        default_factory=list,
        description="Key features or requirements identified during research",
        examples=[["Knowledge Base RAG", "Ticket Escalation", "Admin Dashboard"]],
    )
    constraints: List[str] = Field(
        default_factory=list,
        description="Technical, budget, or timeline constraints",
        examples=[["Must deploy within 4 weeks", "SOC2 compliance required"]],
    )
