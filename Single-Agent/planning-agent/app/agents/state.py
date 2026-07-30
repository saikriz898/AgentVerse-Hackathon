"""LangGraph State definition for AI Planning Agent execution workflow."""

from typing import Dict, List, Optional, TypedDict, Any
from app.models.project import ProjectInput
from app.models.task import Task
from app.models.milestone import Milestone
from app.models.roadmap import RoadmapWeek
from app.models.planning_result import RiskItem, PlanningResult


class PlanningState(TypedDict, total=False):
    """TypedDict state passed through each node in the LangGraph workflow sequence.

    Sequence:
    Receive Input -> Validate Input -> Analyze Project -> Generate Tasks -> Generate Subtasks ->
    Assign Priorities -> Estimate Timelines -> Identify Dependencies -> Generate Milestones ->
    Build Roadmap -> Analyze Risks -> Generate Recommendations -> Build Final JSON -> Return Response.
    """

    # Input Data
    project_input: ProjectInput

    # Stage Outputs
    project_summary: str
    tasks: List[Task]
    milestones: List[Milestone]
    roadmap: List[RoadmapWeek]
    risks: List[RiskItem]
    recommendations: List[str]

    # Final Output
    final_report: PlanningResult

    # Diagnostic & Operational State
    errors: List[str]
    current_step: str
    execution_metrics: Dict[str, float]
