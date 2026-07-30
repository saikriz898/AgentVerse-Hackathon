"""Unit tests for LangGraph state workflow graph execution."""

import pytest
from app.agents.prompts import PromptLoader
from app.agents.workflow import create_planning_workflow
from app.models.project import ProjectInput
from app.models.planning_result import PlanningResult

prompt_loader = PromptLoader()


@pytest.mark.asyncio
async def test_workflow_execution():
    """Test full LangGraph compiled graph step execution from START to END."""
    graph = create_planning_workflow(prompt_loader=prompt_loader)

    project_input = ProjectInput(
        project_name="AI Analytics Dashboard",
        objective="Provide real-time telemetry analytics using LLM summaries.",
        research_summary="Users need instant insights on app usage metrics.",
        features=["Metrics collector", "LLM insight engine", "React Dashboard"],
        constraints=["Max query latency 500ms"],
    )

    initial_state = {
        "project_input": project_input,
        "errors": [],
        "current_step": "init",
        "execution_metrics": {},
    }

    final_state = await graph.ainvoke(initial_state)

    assert final_state["current_step"] == "build_final_json"
    assert "final_report" in final_state
    report = final_state["final_report"]
    assert isinstance(report, PlanningResult)
    assert report.project_summary is not None
    assert len(report.tasks) > 0
    assert len(report.milestones) > 0
    assert len(report.roadmap) > 0
    assert len(report.risks) > 0
    assert len(report.recommendations) > 0
