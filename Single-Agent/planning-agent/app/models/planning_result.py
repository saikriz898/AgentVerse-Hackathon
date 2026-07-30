"""Planning result domain model matching required output JSON schema."""

from typing import List
from pydantic import BaseModel, Field

from app.models.task import Task
from app.models.milestone import Milestone
from app.models.roadmap import RoadmapWeek


class RiskItem(BaseModel):
    """Identified project risk item with impact level and mitigation strategy."""

    risk: str = Field(..., description="Description of the risk")
    impact: str = Field(..., description="Impact severity (e.g. High, Medium, Low)")
    mitigation: str = Field(..., description="Actionable mitigation strategy")


class PlanningResult(BaseModel):
    """Complete structured JSON output of the Planning Agent."""

    project_summary: str = Field(
        ...,
        description="Executive summary of the project analysis and execution strategy",
    )
    tasks: List[Task] = Field(
        default_factory=list,
        description="Detailed list of prioritized, broken-down tasks with subtasks and dependencies",
    )
    milestones: List[Milestone] = Field(
        default_factory=list,
        description="List of key project milestones",
    )
    roadmap: List[RoadmapWeek] = Field(
        default_factory=list,
        description="Week-by-week roadmap schedule",
    )
    risks: List[RiskItem] = Field(
        default_factory=list,
        description="Identified potential risks and mitigations",
    )
    recommendations: List[str] = Field(
        default_factory=list,
        description="Strategic recommendations for successful execution",
    )
