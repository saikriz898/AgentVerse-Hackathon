"""Service for identifying prerequisite dependencies between tasks."""

from typing import Any, Callable, List, Optional
from app.models.task import Task
from app.utils.formatter import format_tasks_summary
from app.utils.logger import logger
from app.utils.parser import parse_json_from_llm
from app.utils.validator import validate_dag_dependencies


class DependencyManagerService:
    """Service to detect task dependencies and validate non-circular DAG properties."""

    async def detect_dependencies(
        self,
        tasks: List[Task],
        prompt_renderer: Callable[..., str],
        llm_invoker: Optional[Callable[[str], Any]] = None,
    ) -> List[Task]:
        """Detect and validate task dependency relationships."""
        logger.info("Detecting task dependencies and verifying DAG structure.")

        rendered_prompt = prompt_renderer(
            "dependency_detection",
            tasks_json=format_tasks_summary(tasks),
        )

        dep_map = {}
        if llm_invoker:
            try:
                response = await llm_invoker(rendered_prompt)
                dep_map = parse_json_from_llm(response)
            except Exception as e:
                logger.error(f"Dependency detection failed via LLM: {e}. Using natural sequential dependencies.")

        valid_ids = {t.id for t in tasks}

        for idx, task in enumerate(tasks):
            if isinstance(dep_map, dict) and task.id in dep_map:
                raw_deps = dep_map[task.id]
                if isinstance(raw_deps, list):
                    # Filter out self-dependencies or invalid task IDs
                    task.dependencies = [d for d in raw_deps if d in valid_ids and d != task.id]
            else:
                # Sequential dependency fallback: TASK-N depends on TASK-(N-1)
                if idx > 0 and not task.dependencies:
                    task.dependencies = [tasks[idx - 1].id]

        # Verify DAG structure (raises error or logs warning if circular dependency occurs)
        try:
            validate_dag_dependencies(tasks)
        except ValueError as e:
            logger.warning(f"DAG cycle validation failed: {e}. Resolving circular dependencies.")
            # Clear dependencies if cycle is found to guarantee DAG property
            for t in tasks:
                t.dependencies = [d for d in t.dependencies if int(d.split("-")[-1]) < int(t.id.split("-")[-1])]

        return tasks
