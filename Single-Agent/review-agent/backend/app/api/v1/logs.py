from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from app.database.session import get_db
from app.models.review_log import ReviewLog

router = APIRouter(prefix="/logs", tags=["System Logs"])

@router.get("")
async def get_system_logs(
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve recent API and review operational logs."""
    stmt = select(ReviewLog).order_by(desc(ReviewLog.timestamp)).limit(limit)
    res = await db.execute(stmt)
    logs = list(res.scalars().all())
    return [
        {
            "id": l.id,
            "review_id": l.review_id,
            "log_level": l.log_level,
            "message": l.message,
            "metadata": l.metadata_json,
            "timestamp": l.timestamp.isoformat()
        }
        for l in logs
    ]
