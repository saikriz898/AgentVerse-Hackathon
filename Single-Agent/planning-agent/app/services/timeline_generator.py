"""Service for estimating timelines and task effort."""

from typing import Any, Callable, List, Optional
from app.models.project import ProjectInput
from app.models.task import Task
from app.utils.formatter import format_tasks_summary
from app.utils.logger import logger
from app.utils.parser import parse_json_from_llm


class TimelineGeneratorService:
    """Service to estimate realistic effort timelines for tasks and subtasks."""

    async def estimate_timelines(
        self,
        project_input: ProjectInput,
        tasks: List[Task],
        prompt_renderer: Callable[..., str],
        llm_invoker: Optional[Callable[[str], Any]] = None,
    ) -> List[Task]:
        """Refine task timelines and effort estimates."""
        logger.info(f"Estimating timelines for {len(tasks)} tasks.")

        rendered_prompt = prompt_renderer(
            "timeline_estimation",
            project_name=project_input.project_name,
            tasks_json=format_tasks_summary(tasks),
        )

        timeline_map = {}
        if llm_invoker:
            try:
                response = await llm_invoker(rendered_prompt)
                timeline_map = parse_json_from_llm(response)
            except Exception as e:
                logger.error(f"Timeline estimation failed via LLM: {e}. Using subtask summation fallback.")

        for task in tasks:
            if isinstance(timeline_map, dict) and task.id in timeline_map:
                task.estimated_time = str(timeline_map[task.id])
            elif not task.estimated_time:
                # Default subtask summation calculation
                task.estimated_time = f"{len(task.subtasks) * 8} hours" if task.subtasks else "2 days"

        return tasks
