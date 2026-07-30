import sys
from pathlib import Path

# Ensure research-agent root directory is in sys.path
_root_dir = str(Path(__file__).resolve().parent.parent)
if _root_dir not in sys.path:
    sys.path.insert(0, _root_dir)

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from backend.config.settings import settings
from backend.database.init_db import init_db
from backend.middleware.cors import setup_cors
from backend.middleware.logging_middleware import LoggingMiddleware
from backend.middleware.rate_limiter import SimpleRateLimiter
from backend.api.routes import auth, research, analytics, agent_interop
from backend.utils.logger import logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} v{settings.VERSION}...")
    # Initialize DB tables & seed data
    try:
        await init_db()
    except Exception as e:
        logger.warning(f"DB auto-init warning: {e}")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}...")

app = FastAPI(
    title=settings.APP_NAME,
    description="Production-ready AI Research Specialist for LifeOS Multi-Agent AI System",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup Middlewares
setup_cors(app)
app.add_middleware(LoggingMiddleware)
app.add_middleware(SimpleRateLimiter, requests_per_minute=200)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(research.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)
app.include_router(agent_interop.router, prefix=settings.API_PREFIX)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "agent": settings.APP_NAME,
        "role": settings.ROLE,
        "version": settings.VERSION,
        "environment": settings.ENV
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception caught on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "agent": "Research",
            "message": "Internal server error occurred.",
            "detail": str(exc) if settings.DEBUG else "Please check system logs."
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
