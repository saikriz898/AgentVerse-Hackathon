"""Service for technical risk analysis and mitigation formulation."""

from typing import Any, Callable, List, Optional
from app.models.project import ProjectInput
from app.models.task import Task
from app.models.planning_result import RiskItem
from app.utils.formatter import format_tasks_summary
from app.utils.logger import logger
from app.utils.parser import parse_json_from_llm


class RiskAnalyzerService:
    """Service to evaluate project risks, impacts, and mitigation plans."""

    async def analyze_risks(
        self,
        project_input: ProjectInput,
        tasks: List[Task],
        prompt_renderer: Callable[..., str],
        llm_invoker: Optional[Callable[[str], Any]] = None,
    ) -> List[RiskItem]:
        """Perform technical and operational risk assessment."""
        logger.info("Analyzing potential project risks and mitigation strategies.")

        rendered_prompt = prompt_renderer(
            "risk_analysis",
            project_name=project_input.project_name,
            objective=project_input.objective,
            constraints=project_input.constraints,
            tasks_json=format_tasks_summary(tasks),
        )

        raw_risks = None
        if llm_invoker:
            try:
                response = await llm_invoker(rendered_prompt)
                raw_risks = parse_json_from_llm(response)
            except Exception as e:
                logger.error(f"Risk analysis failed via LLM: {e}. Using rule-based fallback risks.")

        if not raw_risks or not isinstance(raw_risks, list):
            raw_risks = self._build_fallback_risks(project_input)

        risks: List[RiskItem] = []
        for item in raw_risks:
            risks.append(
                RiskItem(
                    risk=item.get("risk", "Potential scope creep or technical complexity"),
                    impact=item.get("impact", "Medium"),
                    mitigation=item.get("mitigation", "Establish clear milestones and automated integration testing"),
                )
            )

        return risks

    def _build_fallback_risks(self, project_input: ProjectInput) -> List[dict]:
        """Generate standard project risks if LLM output fails."""
        constraints_desc = ", ".join(project_input.constraints) if project_input.constraints else "performance limits"
        return [
            {
                "risk": f"Integration latency exceeding constraints ({constraints_desc}).",
                "impact": "High",
                "mitigation": "Implement Redis caching, async request processing, and early benchmark profiling.",
            },
            {
                "risk": "Third-party service failure or rate limiting during high traffic.",
                "impact": "Medium",
                "mitigation": "Implement exponential backoff retry policy, circuit breaker pattern, and fallback response.",
            },
            {
                "risk": "Scope expansion during implementation phase.",
                "impact": "Medium",
                "mitigation": "Strict adherence to agreed weekly roadmap and milestone acceptance criteria.",
            },
        ]
