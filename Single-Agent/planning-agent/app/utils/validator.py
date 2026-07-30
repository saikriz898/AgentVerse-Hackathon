"""Validation utility routines including DAG dependency cycle detection."""

from typing import Dict, List, Set
from app.models.project import ProjectInput
from app.models.task import Task
from app.utils.logger import logger


def validate_project_input(project_input: ProjectInput) -> None:
    """Validate project input completeness and constraints."""
    if not project_input.project_name.strip():
        raise ValueError("Project name cannot be empty.")
    if not project_input.objective.strip():
        raise ValueError("Project objective cannot be empty.")
    if not project_input.research_summary.strip():
        raise ValueError("Research summary cannot be empty.")


def validate_dag_dependencies(tasks: List[Task]) -> bool:
    """Check for circular dependencies in task relationships using Kahn's algorithm or DFS.

    Returns True if valid DAG (no cycles), raises ValueError if cycle is detected.
    """
    task_ids: Set[str] = {t.id for t in tasks}
    graph: Dict[str, List[str]] = {t.id: [] for t in tasks}
    in_degree: Dict[str, int] = {t.id: 0 for t in tasks}

    for task in tasks:
        for dep in task.dependencies:
            if dep in task_ids:
                graph[dep].append(task.id)
                in_degree[task.id] += 1
            else:
                logger.warning(f"Task {task.id} lists non-existent dependency {dep}. Filtering out.")

    # Topological sort queue
    queue = [t_id for t_id, count in in_degree.items() if count == 0]
    visited_count = 0

    while queue:
        curr = queue.pop(0)
        visited_count += 1
        for neighbor in graph[curr]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    if visited_count != len(task_ids):
        logger.error(f"Circular dependency detected in tasks! Visited {visited_count}/{len(task_ids)}")
        raise ValueError("Circular dependency detected among generated tasks.")

    return True
