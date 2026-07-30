from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.repositories.analytics_repo import AnalyticsRepository
from app.schemas.analytics import DashboardStats

router = APIRouter(prefix="/analytics", tags=["Analytics & Reporting"])

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_analytics(db: AsyncSession = Depends(get_db)):
    """Get aggregated dashboard metrics, approval rates, agent performance, issue trends, and quality distributions."""
    repo = AnalyticsRepository(db)
    return await repo.get_dashboard_stats()

@router.get("/quality")
async def get_quality_breakdown(db: AsyncSession = Depends(get_db)):
    """Get granular quality score distribution and trends."""
    repo = AnalyticsRepository(db)
    stats = await repo.get_dashboard_stats()
    return {
        "quality_distribution": stats.quality_distribution,
        "avg_quality_score": stats.avg_quality_score,
        "approval_rate": stats.approval_rate
    }
