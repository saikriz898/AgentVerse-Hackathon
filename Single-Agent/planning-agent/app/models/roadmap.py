"""Roadmap domain model."""

from typing import List
from pydantic import BaseModel, Field


class RoadmapWeek(BaseModel):
    """Week-by-week schedule breakdown."""

    week: str = Field(..., description="Week identifier e.g. 'Week 1'", examples=["Week 1"])
    focus: str = Field(..., description="Core focus or theme for the week", examples=["Foundation & API Specs"])
    tasks: List[str] = Field(
        default_factory=list,
        description="List of task IDs or descriptions planned for this week",
        examples=[["TASK-1", "TASK-2"]],
    )
