from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.logger import logger
from app.database.session import init_db
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event handler for database initialization."""
    logger.info("Initializing LifeOS Review Agent backend database tables...")
    await init_db()
    logger.info("Database initialization completed.")
    yield
    logger.info("Shutting down LifeOS Review Agent backend service.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global structured error handler."""
    logger.error(f"Unhandled Server Exception: {str(exc)}", path=request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "rejected",
            "quality_score": 0.0,
            "confidence": 0.0,
            "issues": [
                {
                    "code": "INTERNAL_SERVER_ERROR",
                    "severity": "critical",
                    "message": f"Server encountered an unexpected error: {str(exc)}",
                    "field": "server"
                }
            ],
            "warnings": ["Server error occurred during processing."],
            "suggestions": ["Check backend application logs."],
            "summary": f"Review execution failed due to server exception: {str(exc)}"
        }
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
