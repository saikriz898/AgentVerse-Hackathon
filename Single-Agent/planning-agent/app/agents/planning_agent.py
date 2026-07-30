"""Planning Agent high-level orchestration class."""

from typing import Any, Optional
from langchain_openai import ChatOpenAI

from app.config.settings import get_settings, Settings
from app.agents.state import PlanningState
from app.agents.prompts import PromptLoader
from app.agents.workflow import create_planning_workflow
from app.models.project import ProjectInput
from app.models.planning_result import PlanningResult
from app.utils.logger import logger
from app.utils.helpers import ExecutionTimer


class PlanningAgent:
    """Production-ready AI Planning Agent orchestrator."""

    def __init__(self, settings: Optional[Settings] = None):
        self.settings = settings or get_settings()
        self.prompt_loader = PromptLoader()
        self.llm: Optional[ChatOpenAI] = None

        if self.settings.OPENAI_API_KEY:
            try:
                self.llm = ChatOpenAI(
                    model_name=self.settings.OPENAI_MODEL_NAME,
                    temperature=self.settings.OPENAI_TEMPERATURE,
                    api_key=self.settings.OPENAI_API_KEY,
                )
                logger.info(f"Initialized ChatOpenAI model: '{self.settings.OPENAI_MODEL_NAME}'")
            except Exception as e:
                logger.warning(f"Could not initialize ChatOpenAI: {e}. Running with fallback service logic.")

        # Compile LangGraph Workflow Graph
        self.workflow_graph = create_planning_workflow(
            prompt_loader=self.prompt_loader,
            llm_invoker=self._invoke_llm if self.llm else None,
        )

    async def _invoke_llm(self, prompt_text: str) -> str:
        """Helper to invoke LLM with log recording."""
        if not self.llm:
            raise RuntimeError("LLM is unconfigured or unavailable.")

        logger.debug(f"Invoking LLM prompt snippet: {prompt_text[:100]}...")
        response = await self.llm.ainvoke(prompt_text)
        content = response.content if hasattr(response, "content") else str(response)
        logger.debug(f"LLM response received ({len(content)} chars).")
        return content

    async def run_plan(self, project_input: ProjectInput) -> PlanningResult:
        """Execute the LangGraph planning graph and return complete structured JSON report.

        Args:
            project_input: Input research and project constraints.

        Returns:
            PlanningResult domain model matching required final output schema.
        """
        logger.info(f"🚀 Executing Planning Agent workflow for '{project_input.project_name}'")

        initial_state: PlanningState = {
            "project_input": project_input,
            "errors": [],
            "current_step": "init",
            "execution_metrics": {},
        }

        with ExecutionTimer("total_planning_workflow") as total_timer:
            final_state = await self.workflow_graph.ainvoke(initial_state)

        total_duration = total_timer["duration"]
        logger.info(f"✅ Planning Workflow completed successfully in {total_duration:.2f}s.")

        final_report: Optional[PlanningResult] = final_state.get("final_report")
        if not final_report:
            raise RuntimeError("Workflow completed but final_report state is missing.")

        return final_report
