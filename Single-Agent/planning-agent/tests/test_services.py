"""Unit tests for individual domain services."""

import pytest
from app.models.project import ProjectInput
from app.models.task import Task, SubTask, TaskPriority
from app.agents.prompts import PromptLoader
from app.services.planner import ProjectAnalysisService
from app.services.task_generator import TaskGeneratorService
from app.services.priority_engine import PriorityEngineService
from app.services.dependency_manager import DependencyManagerService
from app.utils.validator import validate_dag_dependencies

prompt_loader = PromptLoader()


def render_prompt(template_name: str, **kwargs):
    return prompt_loader.render(template_name, **kwargs)


@pytest.fixture
def sample_project():
    return ProjectInput(
        project_name="Data Pipeline Service",
        objective="Build high-throughput ETL data pipeline.",
        research_summary="Data warehouse ingestion requires streaming ETL pipeline.",
        features=["Kafka ingestion", "Spark transformation", "Snowflake sink"],
        constraints=["10k events/sec", "99.9% SLA"],
    )


@pytest.mark.asyncio
async def test_project_analysis_service(sample_project):
    service = ProjectAnalysisService()
    summary = await service.analyze(sample_project, prompt_renderer=render_prompt)
    assert isinstance(summary, str)
    assert "Data Pipeline Service" in summary


@pytest.mark.asyncio
async def test_task_generator_service(sample_project):
    service = TaskGeneratorService()
    tasks = await service.generate_tasks(
        sample_project,
        "Sample summary",
        prompt_renderer=render_prompt,
    )
    assert len(tasks) >= 2
    assert all(isinstance(t, Task) for t in tasks)
    assert all(len(t.subtasks) >= 1 for t in tasks)


@pytest.mark.asyncio
async def test_priority_engine_service(sample_project):
    service = PriorityEngineService()
    tasks = [
        Task(id="TASK-1", title="Task 1", description="Desc 1", estimated_time="1d"),
        Task(id="TASK-2", title="Task 2", description="Desc 2", estimated_time="2d"),
    ]
    updated = await service.assign_priorities(sample_project, tasks, prompt_renderer=render_prompt)
    assert updated[0].priority in [TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW]


@pytest.mark.asyncio
async def test_dependency_manager_dag_validation():
    tasks = [
        Task(id="TASK-1", title="T1", description="D1", estimated_time="1d", dependencies=[]),
        Task(id="TASK-2", title="T2", description="D2", estimated_time="1d", dependencies=["TASK-1"]),
    ]
    assert validate_dag_dependencies(tasks) is True


def test_dependency_manager_circular_detection():
    tasks = [
        Task(id="TASK-1", title="T1", description="D1", estimated_time="1d", dependencies=["TASK-2"]),
        Task(id="TASK-2", title="T2", description="D2", estimated_time="1d", dependencies=["TASK-1"]),
    ]
    with pytest.raises(ValueError, match="Circular dependency"):
        validate_dag_dependencies(tasks)
