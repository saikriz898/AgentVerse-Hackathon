"""Task and subtask domain models."""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class TaskPriority(str, Enum):
    """Priority levels for tasks."""

    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"


class SubTask(BaseModel):
    """Subtask breakdown for a parent task."""

    id: str = Field(..., description="Unique subtask ID, e.g., TASK-1.1", examples=["TASK-1.1"])
    title: str = Field(..., description="Short title of the subtask", examples=["Setup PostgreSQL Database"])
    description: str = Field(..., description="Detailed description of what needs to be done")
    estimated_time: str = Field(..., description="Estimated effort, e.g. '4 hours'", examples=["4 hours"])


class Task(BaseModel):
    """Main project task."""

    id: str = Field(..., description="Unique task ID, e.g., TASK-1", examples=["TASK-1"])
    title: str = Field(..., description="Short task title", examples=["Database & Schema Setup"])
    description: str = Field(..., description="Detailed task requirements and implementation scope")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, description="Task priority (High, Medium, Low)")
    estimated_time: str = Field(..., description="Estimated timeline e.g. '2 days' or '16 hours'", examples=["2 days"])
    dependencies: List[str] = Field(
        default_factory=list,
        description="IDs of prerequisite tasks that must be completed first",
        examples=[[]],
    )
    subtasks: List[SubTask] = Field(
        default_factory=list,
        description="Granular subtasks under this parent task",
    )
