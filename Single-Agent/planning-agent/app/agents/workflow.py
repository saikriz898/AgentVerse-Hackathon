"""LangGraph workflow definition for the AI Planning Agent."""

from typing import Any, Callable, Dict, Optional
from langgraph.graph import StateGraph, START, END

from app.agents.state import PlanningState
from app.agents.prompts import PromptLoader
from app.models.planning_result import PlanningResult
from app.services.planner import ProjectAnalysisService
from app.services.task_generator import TaskGeneratorService
from app.services.priority_engine import PriorityEngineService
from app.services.timeline_generator import TimelineGeneratorService
from app.services.dependency_manager import DependencyManagerService
from app.services.milestone_generator import MilestoneGeneratorService
from app.services.roadmap_builder import RoadmapBuilderService
from app.services.risk_analyzer import RiskAnalyzerService
from app.services.recommendation_engine import RecommendationEngineService
from app.utils.logger import logger
from app.utils.validator import validate_project_input
from app.utils.helpers import ExecutionTimer


def create_planning_workflow(
    prompt_loader: PromptLoader,
    llm_invoker: Optional[Callable[[str], Any]] = None,
) -> StateGraph:
    """Create and configure the LangGraph workflow graph for AI Planning Agent execution.

    Sequence:
    Validate Input -> Analyze Project -> Generate Tasks -> Generate Subtasks -> Assign Priorities ->
    Estimate Timelines -> Identify Dependencies -> Generate Milestones -> Build Roadmap ->
    Analyze Risks -> Generate Recommendations -> Build Final JSON.
    """

    planner_service = ProjectAnalysisService()
    task_service = TaskGeneratorService()
    priority_service = PriorityEngineService()
    timeline_service = TimelineGeneratorService()
    dependency_service = DependencyManagerService()
    milestone_service = MilestoneGeneratorService()
    roadmap_service = RoadmapBuilderService()
    risk_service = RiskAnalyzerService()
    recommendation_service = RecommendationEngineService()

    def render_prompt(template: str, **kwargs: Any) -> str:
        return prompt_loader.render(template, **kwargs)

    # 1. Validate Input Node
    async def validate_input_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 1/12: Validating Input")
        with ExecutionTimer("validate_input") as timer:
            project_input = state["project_input"]
            validate_project_input(project_input)
        metrics = state.get("execution_metrics", {})
        metrics["validate_input"] = timer["duration"]
        return {"current_step": "validate_input", "execution_metrics": metrics}

    # 2. Analyze Project Node
    async def analyze_project_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 2/12: Analyzing Project")
        with ExecutionTimer("analyze_project") as timer:
            summary = await planner_service.analyze(
                state["project_input"],
                prompt_renderer=render_prompt,
                llm_invoker=llm_invoker,
            )
        metrics = state.get("execution_metrics", {})
        metrics["analyze_project"] = timer["duration"]
        return {"project_summary": summary, "current_step": "analyze_project", "execution_metrics": metrics}

    # 3. Generate Tasks Node
    async def generate_tasks_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 3/12: Generating Top-Level Tasks")
        with ExecutionTimer("generate_tasks") as timer:
            tasks = await task_service.generate_tasks(
                state["project_input"],
                state["project_summary"],
                prompt_renderer=render_prompt,
                llm_invoker=llm_invoker,
            )
        metrics = state.get("execution_metrics", {})
        metrics["generate_tasks"] = timer["duration"]
        return {"tasks": tasks, "current_step": "generate_tasks", "execution_metrics": metrics}

    # 4. Generate Subtasks Node
    async def generate_subtasks_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 4/12: Verifying & Generating Subtasks Breakdown")
        with ExecutionTimer("generate_subtasks") as timer:
            tasks = state.get("tasks", [])
            # Subtasks are populated during task generation; ensure subtasks exist for each task
            for t in tasks:
                if not t.subtasks:
                    t.subtasks = task_service._build_fallback_tasks(state["project_input"])[0]["subtasks"]
        metrics = state.get("execution_metrics", {})
        metrics["generate_subtasks"] = timer["duration"]
        return {"tasks": tasks, "current_step": "generate_subtasks", "execution_metrics": metrics}

    # 5. Assign Priorities Node
    async def assign_priorities_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 5/12: Assigning Priorities")
        with ExecutionTimer("assign_priorities") as timer:
            tasks = await priority_service.assign_priorities(
                state["project_input"],
                state.get("tasks", []),
                prompt_renderer=render_prompt,
                llm_invoker=llm_invoker,
            )
        metrics = state.get("execution_metrics", {})
        metrics["assign_priorities"] = timer["duration"]
        return {"tasks": tasks, "current_step": "assign_priorities", "execution_metrics": metrics}

    # 6. Estimate Timelines Node
    async def estimate_timelines_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 6/12: Estimating Timelines")
        with ExecutionTimer("estimate_timelines") as timer:
            tasks = await timeline_service.estimate_timelines(
                state["project_input"],
                state.get("tasks", []),
                prompt_renderer=render_prompt,
                llm_invoker=llm_invoker,
            )
        metrics = state.get("execution_metrics", {})
        metrics["estimate_timelines"] = timer["duration"]
        return {"tasks": tasks, "current_step": "estimate_timelines", "execution_metrics": metrics}

    # 7. Identify Dependencies Node
    async def identify_dependencies_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 7/12: Identifying Dependencies")
        with ExecutionTimer("identify_dependencies") as timer:
            tasks = await dependency_service.detect_dependencies(
                state.get("tasks", []),
                prompt_renderer=render_prompt,
                llm_invoker=llm_invoker,
            )
        metrics = state.get("execution_metrics", {})
        metrics["identify_dependencies"] = timer["duration"]
        return {"tasks": tasks, "current_step": "identify_dependencies", "execution_metrics": metrics}

    # 8. Generate Milestones Node
    async def generate_milestones_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 8/12: Generating Milestones")
        with ExecutionTimer("generate_milestones") as timer:
            milestones = await milestone_service.generate_milestones(
                state["project_input"],
                state.get("tasks", []),
                prompt_renderer=render_prompt,
                llm_invoker=llm_invoker,
            )
        metrics = state.get("execution_metrics", {})
        metrics["generate_milestones"] = timer["duration"]
        return {"milestones": milestones, "current_step": "generate_milestones", "execution_metrics": metrics}

    # 9. Build Roadmap Node
    async def build_roadmap_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 9/12: Building Week-by-Week Roadmap")
        with ExecutionTimer("build_roadmap") as timer:
            roadmap = await roadmap_service.build_roadmap(
                state["project_input"],
                state.get("tasks", []),
                state.get("milestones", []),
                prompt_renderer=render_prompt,
                llm_invoker=llm_invoker,
            )
        metrics = state.get("execution_metrics", {})
        metrics["build_roadmap"] = timer["duration"]
        return {"roadmap": roadmap, "current_step": "build_roadmap", "execution_metrics": metrics}

    # 10. Analyze Risks Node
    async def analyze_risks_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 10/12: Analyzing Project Risks")
        with ExecutionTimer("analyze_risks") as timer:
            risks = await risk_service.analyze_risks(
                state["project_input"],
                state.get("tasks", []),
                prompt_renderer=render_prompt,
                llm_invoker=llm_invoker,
            )
        metrics = state.get("execution_metrics", {})
        metrics["analyze_risks"] = timer["duration"]
        return {"risks": risks, "current_step": "analyze_risks", "execution_metrics": metrics}

    # 11. Generate Recommendations Node
    async def generate_recommendations_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 11/12: Generating Strategic Recommendations")
        with ExecutionTimer("generate_recommendations") as timer:
            recommendations = await recommendation_service.generate_recommendations(
                state["project_input"],
                state.get("project_summary", ""),
                state.get("tasks", []),
                state.get("risks", []),
                prompt_renderer=render_prompt,
                llm_invoker=llm_invoker,
            )
        metrics = state.get("execution_metrics", {})
        metrics["generate_recommendations"] = timer["duration"]
        return {"recommendations": recommendations, "current_step": "generate_recommendations", "execution_metrics": metrics}

    # 12. Build Final JSON Node
    async def build_final_json_step(state: PlanningState) -> Dict[str, Any]:
        logger.info("📍 Step 12/12: Building Final Structured JSON Planning Report")
        with ExecutionTimer("build_final_json") as timer:
            final_report = PlanningResult(
                project_summary=state.get("project_summary", ""),
                tasks=state.get("tasks", []),
                milestones=state.get("milestones", []),
                roadmap=state.get("roadmap", []),
                risks=state.get("risks", []),
                recommendations=state.get("recommendations", []),
            )
        metrics = state.get("execution_metrics", {})
        metrics["build_final_json"] = timer["duration"]
        return {"final_report": final_report, "current_step": "build_final_json", "execution_metrics": metrics}

    # Assemble LangGraph Workflow Graph
    builder = StateGraph(PlanningState)

    builder.add_node("validate_input", validate_input_step)
    builder.add_node("analyze_project", analyze_project_step)
    builder.add_node("generate_tasks", generate_tasks_step)
    builder.add_node("generate_subtasks", generate_subtasks_step)
    builder.add_node("assign_priorities", assign_priorities_step)
    builder.add_node("estimate_timelines", estimate_timelines_step)
    builder.add_node("identify_dependencies", identify_dependencies_step)
    builder.add_node("generate_milestones", generate_milestones_step)
    builder.add_node("build_roadmap", build_roadmap_step)
    builder.add_node("analyze_risks", analyze_risks_step)
    builder.add_node("generate_recommendations", generate_recommendations_step)
    builder.add_node("build_final_json", build_final_json_step)

    # Set up linear workflow sequence
    builder.add_edge(START, "validate_input")
    builder.add_edge("validate_input", "analyze_project")
    builder.add_edge("analyze_project", "generate_tasks")
    builder.add_edge("generate_tasks", "generate_subtasks")
    builder.add_edge("generate_subtasks", "assign_priorities")
    builder.add_edge("assign_priorities", "estimate_timelines")
    builder.add_edge("estimate_timelines", "identify_dependencies")
    builder.add_edge("identify_dependencies", "generate_milestones")
    builder.add_edge("generate_milestones", "build_roadmap")
    builder.add_edge("build_roadmap", "analyze_risks")
    builder.add_edge("analyze_risks", "generate_recommendations")
    builder.add_edge("generate_recommendations", "build_final_json")
    builder.add_edge("build_final_json", END)

    return builder.compile()
