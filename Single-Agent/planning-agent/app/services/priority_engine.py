"""Service for evaluating and assigning task priorities (High, Medium, Low)."""

from typing import Any, Callable, List, Optional
from app.models.project import ProjectInput
from app.models.task import Task, TaskPriority
from app.utils.formatter import format_tasks_summary
from app.utils.logger import logger
from app.utils.parser import parse_json_from_llm


class PriorityEngineService:
    """Service evaluating critical path and constraints to assign task priorities."""

    async def assign_priorities(
        self,
        project_input: ProjectInput,
        tasks: List[Task],
        prompt_renderer: Callable[..., str],
        llm_invoker: Optional[Callable[[str], Any]] = None,
    ) -> List[Task]:
        """Assign priorities (High, Medium, Low) to each task."""
        logger.info(f"Assigning priorities across {len(tasks)} tasks.")

        rendered_prompt = prompt_renderer(
            "priority_assignment",
            objective=project_input.objective,
            constraints=project_input.constraints,
            tasks_json=format_tasks_summary(tasks),
        )

        priority_map = {}
        if llm_invoker:
            try:
                response = await llm_invoker(rendered_prompt)
                priority_map = parse_json_from_llm(response)
            except Exception as e:
                logger.error(f"Priority evaluation failed via LLM: {e}. Applying heuristic priority scoring.")

        updated_tasks: List[Task] = []
        for idx, task in enumerate(tasks):
            p_val = priority_map.get(task.id) if isinstance(priority_map, dict) else None
            
            if not p_val:
                # Heuristic fallback: early tasks or tasks with many subtasks get High priority
                if idx == 0 or len(task.dependencies) == 0:
                    assigned = TaskPriority.HIGH
                elif idx < len(tasks) // 2:
                    assigned = TaskPriority.HIGH if "Core" in task.title else TaskPriority.MEDIUM
                else:
                    assigned = TaskPriority.LOW
            else:
                p_clean = str(p_val).capitalize()
                assigned = TaskPriority(p_clean) if p_clean in [p.value for p in TaskPriority] else TaskPriority.MEDIUM

            task.priority = assigned
            updated_tasks.append(task)

        return updated_tasks
