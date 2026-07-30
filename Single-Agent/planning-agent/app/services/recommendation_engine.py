"""Service for generating strategic execution recommendations."""

import json
from typing import Any, Callable, List, Optional
from app.models.project import ProjectInput
from app.models.task import Task
from app.models.planning_result import RiskItem
from app.utils.formatter import format_tasks_summary
from app.utils.logger import logger
from app.utils.parser import parse_json_from_llm


class RecommendationEngineService:
    """Service generating actionable execution recommendations."""

    async def generate_recommendations(
        self,
        project_input: ProjectInput,
        project_summary: str,
        tasks: List[Task],
        risks: List[RiskItem],
        prompt_renderer: Callable[..., str],
        llm_invoker: Optional[Callable[[str], Any]] = None,
    ) -> List[str]:
        """Generate high-level strategic recommendations for project leadership."""
        logger.info("Generating project execution recommendations.")

        risks_json = json.dumps([r.model_dump() for r in risks], indent=2)

        rendered_prompt = prompt_renderer(
            "final_report",
            project_name=project_input.project_name,
            objective=project_input.objective,
            project_summary=project_summary,
            tasks_json=format_tasks_summary(tasks),
            risks_json=risks_json,
        )

        raw_recs = None
        if llm_invoker:
            try:
                response = await llm_invoker(rendered_prompt)
                raw_recs = parse_json_from_llm(response)
            except Exception as e:
                logger.error(f"Recommendation engine failed via LLM: {e}. Using fallback recommendations.")

        if not raw_recs or not isinstance(raw_recs, list):
            raw_recs = self._build_fallback_recommendations(project_input)

        return [str(rec) for rec in raw_recs]

    def _build_fallback_recommendations(self, project_input: ProjectInput) -> List[str]:
        """Generate standard recommendations if LLM is unavailable."""
        return [
            "Establish continuous integration testing to validate project features early in the lifecycle.",
            "Prioritize high-dependency architectural tasks in Week 1 to unblock downstream development.",
            "Monitor system performance against constraints continuously during dev iterations.",
            "Maintain modular code separation to facilitate future multi-agent tool integrations.",
        ]
