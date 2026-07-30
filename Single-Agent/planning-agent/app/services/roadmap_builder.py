"""Service for building week-by-week execution roadmap."""

import json
from typing import Any, Callable, List, Optional
from app.models.project import ProjectInput
from app.models.task import Task
from app.models.milestone import Milestone
from app.models.roadmap import RoadmapWeek
from app.utils.formatter import format_tasks_summary
from app.utils.logger import logger
from app.utils.parser import parse_json_from_llm


class RoadmapBuilderService:
    """Service to schedule tasks into a week-by-week roadmap."""

    async def build_roadmap(
        self,
        project_input: ProjectInput,
        tasks: List[Task],
        milestones: List[Milestone],
        prompt_renderer: Callable[..., str],
        llm_invoker: Optional[Callable[[str], Any]] = None,
    ) -> List[RoadmapWeek]:
        """Construct week-by-week execution timeline."""
        logger.info("Building week-by-week project roadmap.")

        milestones_json = json.dumps([m.model_dump() for m in milestones], indent=2)

        rendered_prompt = prompt_renderer(
            "roadmap_generation",
            project_name=project_input.project_name,
            tasks_json=format_tasks_summary(tasks),
            milestones_json=milestones_json,
        )

        raw_roadmap = None
        if llm_invoker:
            try:
                response = await llm_invoker(rendered_prompt)
                raw_roadmap = parse_json_from_llm(response)
            except Exception as e:
                logger.error(f"Roadmap building failed via LLM: {e}. Using fallback roadmap scheduler.")

        if not raw_roadmap or not isinstance(raw_roadmap, list):
            raw_roadmap = self._build_fallback_roadmap(tasks)

        roadmap: List[RoadmapWeek] = []
        for idx, item in enumerate(raw_roadmap, start=1):
            w_name = item.get("week", f"Week {idx}")
            roadmap.append(
                RoadmapWeek(
                    week=w_name,
                    focus=item.get("focus", f"Week {idx} Implementation Focus"),
                    tasks=item.get("tasks", []),
                )
            )

        return roadmap

    def _build_fallback_roadmap(self, tasks: List[Task]) -> List[dict]:
        """Generate week breakdown if LLM is offline."""
        task_ids = [t.id for t in tasks]
        mid = max(1, len(task_ids) // 2)

        return [
            {
                "week": "Week 1",
                "focus": "Initial Architecture & Core Services Implementation",
                "tasks": task_ids[:mid],
            },
            {
                "week": "Week 2",
                "focus": "API Endpoints, Integration Testing & Production Delivery",
                "tasks": task_ids[mid:],
            },
        ]
