"""Milestone domain model."""

from typing import List
from pydantic import BaseModel, Field


class Milestone(BaseModel):
    """Key project milestone."""

    id: str = Field(..., description="Unique milestone ID e.g. M1", examples=["M1"])
    title: str = Field(..., description="Milestone title", examples=["Backend & Core Infrastructure Ready"])
    description: str = Field(..., description="Milestone completion criteria and scope")
    target_timeline: str = Field(..., description="Target completion timeline e.g. 'End of Week 2'", examples=["End of Week 2"])
    associated_tasks: List[str] = Field(
        default_factory=list,
        description="Task IDs associated with achieving this milestone",
        examples=[["TASK-1", "TASK-2"]],
    )
