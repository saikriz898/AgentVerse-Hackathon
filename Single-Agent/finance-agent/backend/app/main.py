from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import Base, engine
from app.api.v1 import estimates, budgets, infrastructure, roi, forecasting, reports, analytics, settings as sys_settings

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(estimates.router, prefix=f"{settings.API_V1_STR}/estimates", tags=["Estimates"])
app.include_router(budgets.router, prefix=f"{settings.API_V1_STR}/budgets", tags=["Budgets"])
app.include_router(infrastructure.router, prefix=f"{settings.API_V1_STR}/infrastructure", tags=["Infrastructure"])
app.include_router(roi.router, prefix=f"{settings.API_V1_STR}/roi", tags=["ROI Analysis"])
app.include_router(forecasting.router, prefix=f"{settings.API_V1_STR}/forecasting", tags=["Forecasting"])
app.include_router(reports.router, prefix=f"{settings.API_V1_STR}/reports", tags=["Financial Reports"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Analytics"])
app.include_router(sys_settings.router, prefix=f"{settings.API_V1_STR}/settings", tags=["Settings"])

@app.get("/")
def root():
    return {
        "message": "Enterprise AI Finance Agent API operational",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "finance-agent-backend"}
