"""Service for generating key project milestones from tasks."""

from typing import Any, Callable, List, Optional
from app.models.project import ProjectInput
from app.models.task import Task
from app.models.milestone import Milestone
from app.utils.formatter import format_tasks_summary
from app.utils.logger import logger
from app.utils.parser import parse_json_from_llm


class MilestoneGeneratorService:
    """Service to construct project milestones."""

    async def generate_milestones(
        self,
        project_input: ProjectInput,
        tasks: List[Task],
        prompt_renderer: Callable[..., str],
        llm_invoker: Optional[Callable[[str], Any]] = None,
    ) -> List[Milestone]:
        """Group tasks into milestones with target deadlines."""
        logger.info(f"Generating milestones for '{project_input.project_name}'.")

        rendered_prompt = prompt_renderer(
            "milestone_generation",
            project_name=project_input.project_name,
            objective=project_input.objective,
            tasks_json=format_tasks_summary(tasks),
        )

        raw_milestones = None
        if llm_invoker:
            try:
                response = await llm_invoker(rendered_prompt)
                raw_milestones = parse_json_from_llm(response)
            except Exception as e:
                logger.error(f"Milestone generation failed via LLM: {e}. Using fallback milestone builder.")

        if not raw_milestones or not isinstance(raw_milestones, list):
            raw_milestones = self._build_fallback_milestones(project_input, tasks)

        milestones: List[Milestone] = []
        for idx, item in enumerate(raw_milestones, start=1):
            m_id = item.get("id", f"M{idx}")
            milestones.append(
                Milestone(
                    id=m_id,
                    title=item.get("title", f"Milestone {idx}"),
                    description=item.get("description", "Deliver key milestone requirements"),
                    target_timeline=item.get("target_timeline", f"End of Week {idx}"),
                    associated_tasks=item.get("associated_tasks", []),
                )
            )

        return milestones

    def _build_fallback_milestones(self, project_input: ProjectInput, tasks: List[Task]) -> List[dict]:
        """Construct standard project milestones if LLM output is unavailable."""
        task_ids = [t.id for t in tasks]
        half = max(1, len(task_ids) // 2)
        
        return [
            {
                "id": "M1",
                "title": "Foundation & Core Infrastructure",
                "description": f"Architectural baseline and core feature setup for {project_input.project_name}.",
                "target_timeline": "End of Week 1",
                "associated_tasks": task_ids[:half],
            },
            {
                "id": "M2",
                "title": "API Integration & System Verification",
                "description": "Full feature integration, automated testing, and validation.",
                "target_timeline": "End of Week 2",
                "associated_tasks": task_ids[half:],
            },
        ]
