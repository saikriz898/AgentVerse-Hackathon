"""Main application entry point for AI Planning Agent FastAPI service."""

from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse

from app.api.routes import router as api_router
from app.config.settings import get_settings
from app.utils.logger import logger

settings = get_settings()

TEMPLATES_DIR = Path(__file__).parent / "templates"
INDEX_HTML_PATH = TEMPLATES_DIR / "index.html"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan event handler for startup and shutdown logging."""
    logger.info("==================================================")
    logger.info(f"🚀 Starting {settings.APP_NAME}")
    logger.info(f"   Environment: {settings.APP_ENV}")
    logger.info(f"   LLM Model:   {settings.OPENAI_MODEL_NAME}")
    logger.info("==================================================")
    yield
    logger.info(f"🛑 Shutting down {settings.APP_NAME}")


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Production-ready AI Planning Agent built using FastAPI, LangGraph, LangChain, and OpenAI. "
        "Transforms structured research output into detailed project execution plans."
    ),
    version="0.1.0",
    docs_url=None,  # Disabled default Swagger UI to present custom custom dashboard
    redoc_url=None,
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse, include_in_schema=False)
@app.get("/docs", response_class=HTMLResponse, include_in_schema=False)
async def serve_custom_ui():
    """Serve custom interactive web dashboard for AI Planning Agent."""
    if INDEX_HTML_PATH.exists():
        content = INDEX_HTML_PATH.read_text(encoding="utf-8")
        return HTMLResponse(content=content, status_code=status.HTTP_200_OK)
    return HTMLResponse(
        content="<h1>AI Planning Agent UI</h1><p>Index template not found.</p>",
        status_code=status.HTTP_404_NOT_FOUND,
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global unhandled exception handler logging errors and returning standard JSON."""
    logger.error(f"Global unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred while processing the request."},
    )


# Include API Routes directly on app so /plan and /health match requested endpoints
app.include_router(api_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
