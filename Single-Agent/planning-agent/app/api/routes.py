"""FastAPI router endpoints for planning agent API."""

import time
from fastapi import APIRouter, HTTPException, status
from app.api.request_models import PlanRequest
from app.api.response_models import PlanResponse, HealthResponse
from app.agents.planning_agent import PlanningAgent
from app.models.project import ProjectInput
from app.config.settings import get_settings
from app.utils.logger import logger

router = APIRouter()
agent = PlanningAgent()
settings = get_settings()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Service Health Check",
    tags=["System"],
)
async def health_check() -> HealthResponse:
    """Return health status, service metadata, and configured LLM model."""
    return HealthResponse(
        status="healthy",
        service=settings.APP_NAME,
        version="0.1.0",
        model=settings.OPENAI_MODEL_NAME,
    )


@router.post(
    "/plan",
    response_model=PlanResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Execution Plan",
    description="Accept structured Research Agent output and return a comprehensive, week-by-week execution plan.",
    tags=["Planning"],
)
async def create_plan(request: PlanRequest) -> PlanResponse:
    """POST /plan endpoint generating detailed execution plan."""
    start_time = time.perf_counter()
    logger.info(f"Incoming POST /plan request for project: '{request.project_name}'")

    try:
        project_input = ProjectInput(
            project_name=request.project_name,
            objective=request.objective,
            research_summary=request.research_summary,
            features=request.features,
            constraints=request.constraints,
        )

        result = await agent.run_plan(project_input)

        elapsed = time.perf_counter() - start_time
        logger.info(f"POST /plan request completed in {elapsed:.2f} seconds.")
        return result

    except ValueError as val_err:
        logger.error(f"Validation error handling /plan request: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid request input: {str(val_err)}",
        )
    except Exception as err:
        logger.error(f"Unexpected error executing /plan workflow: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating the project plan: {str(err)}",
        )
