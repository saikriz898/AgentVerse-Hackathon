"""Service responsible for project analysis and executive summary generation."""

from typing import Any, Callable, Optional
from app.models.project import ProjectInput
from app.utils.logger import logger


class ProjectAnalysisService:
    """Business logic service for analyzing project inputs and research summaries."""

    async def analyze(
        self,
        project_input: ProjectInput,
        prompt_renderer: Callable[..., str],
        llm_invoker: Optional[Callable[[str], Any]] = None,
    ) -> str:
        """Analyze project input and generate high-level project summary."""
        logger.info(f"Analyzing project: '{project_input.project_name}'")

        rendered_prompt = prompt_renderer(
            "project_analysis",
            project_name=project_input.project_name,
            objective=project_input.objective,
            research_summary=project_input.research_summary,
            features=project_input.features,
            constraints=project_input.constraints,
        )

        if llm_invoker:
            response = await llm_invoker(rendered_prompt)
            if isinstance(response, str) and response.strip():
                return response.strip()

        # Fallback / Default response if LLM is offline or unconfigured
        return (
            f"Executive Planning Analysis for '{project_input.project_name}': "
            f"The objective is to {project_input.objective}. "
            f"Based on research findings ({project_input.research_summary[:100]}...), "
            f"the implementation strategy focuses on delivering core features ({', '.join(project_input.features[:3])}) "
            f"while strictly respecting operational constraints ({', '.join(project_input.constraints[:2])})."
        )
