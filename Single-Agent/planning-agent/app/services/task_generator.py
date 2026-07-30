"""Service for generating tasks and subtasks."""

from typing import Any, Callable, List, Optional
from app.models.project import ProjectInput
from app.models.task import Task, SubTask, TaskPriority
from app.utils.logger import logger
from app.utils.parser import parse_json_from_llm


class TaskGeneratorService:
    """Service to generate detailed top-level tasks and subtasks."""

    async def generate_tasks(
        self,
        project_input: ProjectInput,
        project_summary: str,
        prompt_renderer: Callable[..., str],
        llm_invoker: Optional[Callable[[str], Any]] = None,
    ) -> List[Task]:
        """Decompose project objective and features into structured tasks and subtasks."""
        logger.info(f"Generating tasks for project: '{project_input.project_name}'")

        rendered_prompt = prompt_renderer(
            "task_generation",
            project_name=project_input.project_name,
            objective=project_input.objective,
            project_summary=project_summary,
            features=project_input.features,
            constraints=project_input.constraints,
        )

        raw_tasks = None
        if llm_invoker:
            try:
                response = await llm_invoker(rendered_prompt)
                raw_tasks = parse_json_from_llm(response)
            except Exception as e:
                logger.error(f"Error generating tasks via LLM: {e}. Using intelligent fallback task breakdown.")

        if not raw_tasks or not isinstance(raw_tasks, list):
            raw_tasks = self._build_fallback_tasks(project_input)

        tasks: List[Task] = []
        for idx, item in enumerate(raw_tasks, start=1):
            task_id = item.get("id", f"TASK-{idx}")
            subtasks_raw = item.get("subtasks", [])
            subtasks = [
                SubTask(
                    id=st.get("id", f"{task_id}.{st_idx}"),
                    title=st.get("title", f"Subtask {st_idx}"),
                    description=st.get("description", "Execute subtask implementation"),
                    estimated_time=st.get("estimated_time", "4 hours"),
                )
                for st_idx, st in enumerate(subtasks_raw, start=1)
            ]

            tasks.append(
                Task(
                    id=task_id,
                    title=item.get("title", f"Task {idx}"),
                    description=item.get("description", "Implementation task description"),
                    priority=TaskPriority(item.get("priority", "Medium")),
                    estimated_time=item.get("estimated_time", "2 days"),
                    dependencies=item.get("dependencies", []),
                    subtasks=subtasks,
                )
            )

        return tasks

    def _build_fallback_tasks(self, project_input: ProjectInput) -> List[dict]:
        """Generate standard high quality project tasks if LLM is unavailable."""
        feature_list = project_input.features or ["Core Functionality"]
        
        fallback = [
            {
                "id": "TASK-1",
                "title": "System Architecture & Foundation Setup",
                "description": f"Design backend architecture, data models, and API interfaces for {project_input.project_name}.",
                "priority": "High",
                "estimated_time": "3 days",
                "dependencies": [],
                "subtasks": [
                    {
                        "id": "TASK-1.1",
                        "title": "Project Initialization & Config",
                        "description": "Setup repository, linting, environment variables, and Docker context.",
                        "estimated_time": "4 hours",
                    },
                    {
                        "id": "TASK-1.2",
                        "title": "Database & Data Models Definition",
                        "description": "Design Pydantic and database schemas.",
                        "estimated_time": "8 hours",
                    },
                ],
            },
            {
                "id": "TASK-2",
                "title": "Core Feature Development",
                "description": f"Implement core domain logic and features: {', '.join(feature_list)}.",
                "priority": "High",
                "estimated_time": "5 days",
                "dependencies": ["TASK-1"],
                "subtasks": [
                    {
                        "id": "TASK-2.1",
                        "title": "Business Logic Implementation",
                        "description": "Build primary service methods and domain workflow.",
                        "estimated_time": "16 hours",
                    },
                    {
                        "id": "TASK-2.2",
                        "title": "External Service & API Integrations",
                        "description": "Integrate third-party models and data providers.",
                        "estimated_time": "12 hours",
                    },
                ],
            },
            {
                "id": "TASK-3",
                "title": "REST API & Endpoints Integration",
                "description": "Expose FastAPI endpoints with validation, logging, and OpenAPI docs.",
                "priority": "Medium",
                "estimated_time": "2 days",
                "dependencies": ["TASK-2"],
                "subtasks": [
                    {
                        "id": "TASK-3.1",
                        "title": "Route Handlers & DTOs",
                        "description": "Create FastAPI routes and request/response models.",
                        "estimated_time": "8 hours",
                    },
                ],
            },
            {
                "id": "TASK-4",
                "title": "Testing, Optimization & Deployment",
                "description": f"Conduct unit testing, performance optimization, and container deployment adhering to constraints: {', '.join(project_input.constraints or ['Production readiness'])}.",
                "priority": "Medium",
                "estimated_time": "3 days",
                "dependencies": ["TASK-3"],
                "subtasks": [
                    {
                        "id": "TASK-4.1",
                        "title": "Automated Pytest Suite",
                        "description": "Write comprehensive unit and integration tests.",
                        "estimated_time": "8 hours",
                    },
                    {
                        "id": "TASK-4.2",
                        "title": "CI/CD & Container Deployment",
                        "description": "Configure deployment pipeline and verify health metrics.",
                        "estimated_time": "8 hours",
                    },
                ],
            },
        ]
        return fallback
