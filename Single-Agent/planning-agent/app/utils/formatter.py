"""Formatting utilities for state serialization and summary generation."""

import json
from typing import List
from app.models.task import Task


def format_tasks_summary(tasks: List[Task]) -> str:
    """Serialize tasks into a clean JSON string for Jinja prompts."""
    task_dicts = []
    for task in tasks:
        task_dicts.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "priority": task.priority.value if hasattr(task.priority, "value") else str(task.priority),
            "estimated_time": task.estimated_time,
            "dependencies": task.dependencies,
            "subtasks": [
                {
                    "id": st.id,
                    "title": st.title,
                    "description": st.description,
                    "estimated_time": st.estimated_time,
                }
                for st in task.subtasks
            ],
        })
    return json.dumps(task_dicts, indent=2)


def format_duration(seconds: float) -> str:
    """Format duration seconds into human-readable string."""
    return f"{seconds:.2f}s"
