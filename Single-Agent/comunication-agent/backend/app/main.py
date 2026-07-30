from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.config.settings import settings
from app.utils.logger import logger
from app.database.session import init_db
from app.api.router import api_router

from app.middleware.security_headers import SecurityHeadersMiddleware
from app.middleware.rate_limit import RateLimitingMiddleware
from app.middleware.error_middleware import (
    http_exception_handler,
    validation_exception_handler,
    sqlalchemy_exception_handler,
    generic_exception_handler
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing LifeOS Communication Agent Clean Architecture Database...")
    await init_db()
    logger.info("Database tables initialized successfully.")
    yield
    logger.info("Shutting down Communication Agent server.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-ready AI Communication Agent for LifeOS Ecosystem",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Enterprise Exception Handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Security & Rate Limiting Middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitingMiddleware, requests_per_minute=120)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming Request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Completed Request: {request.method} {request.url.path} -> Status {response.status_code}")
    return response

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "agent": settings.PROJECT_NAME,
        "status": "active",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
