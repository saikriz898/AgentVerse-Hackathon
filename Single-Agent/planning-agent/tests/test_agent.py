"""Unit tests for PlanningAgent high-level orchestrator."""

import pytest
from app.agents.planning_agent import PlanningAgent
from app.models.project import ProjectInput
from app.models.planning_result import PlanningResult


@pytest.mark.asyncio
async def test_planning_agent_run():
    """Test PlanningAgent execution returns valid PlanningResult domain model."""
    agent = PlanningAgent()
    project_input = ProjectInput(
        project_name="AI Code Review Assistant",
        objective="Automate pull request code reviews using LLMs and static analysis.",
        research_summary="Teams spend 30% of sprint time on manual PR reviews.",
        features=["GitHub Webhook receiver", "AST parser", "LLM review generator"],
        constraints=["Max response time 2 minutes", "Zero leak of internal code"],
    )

    result = await agent.run_plan(project_input)

    assert isinstance(result, PlanningResult)
    assert result.project_summary is not None
    assert len(result.tasks) >= 1
    assert len(result.milestones) >= 1
    assert len(result.roadmap) >= 1
    assert len(result.risks) >= 1
    assert len(result.recommendations) >= 1
