from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, Query, Path, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.queue import CommunicationQueue
from app.models.communication import Communication

router = APIRouter(prefix="/communication/queue", tags=["Communication Queue"])

@router.get("", response_model=List[Dict[str, Any]])
async def get_queue_items(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all incoming validated communications in the Communication Queue."""
    stmt = select(CommunicationQueue).order_by(CommunicationQueue.created_at.desc())
    if status:
        stmt = stmt.where(CommunicationQueue.status == status)
    if priority:
        stmt = stmt.where(CommunicationQueue.priority == priority)

    res = await db.execute(stmt)
    items = res.scalars().all()

    # Seed default queue items if table is empty for instant demonstration
    if not items and not status and not priority:
        defaults = [
            {
                "title": "LifeOS Ecosystem Core Security Audit",
                "source_agent": "Review Agent",
                "priority": "Critical",
                "audience": "CEO",
                "status": "Pending",
                "confidence": 0.99,
                "payload": {
                    "project": "LifeOS Security Release",
                    "review_status": "PASSED_WITH_EXCELLENCE",
                    "vulnerabilities": "Zero Critical",
                    "test_pass_rate": "100%"
                }
            },
            {
                "title": "Subagent Pipeline Handshake Performance Benchmark",
                "source_agent": "Execution Agent",
                "priority": "High",
                "audience": "Developer",
                "status": "Pending",
                "confidence": 0.97,
                "payload": {
                    "project": "Parallel Subagent Pipeline",
                    "latency_ms": 14,
                    "subtasks_completed": ["DB Pool Verified", "Retry Policy Active"]
                }
            },
            {
                "title": "Q3 Enterprise Roadmap Milestone Plan",
                "source_agent": "Planning Agent",
                "priority": "Normal",
                "audience": "Manager",
                "status": "Pending",
                "confidence": 0.95,
                "payload": {
                    "project": "Integration Roadmap",
                    "phases": ["Phase 1 Complete", "Phase 2 Active"]
                }
            }
        ]
        for d in defaults:
            q_item = CommunicationQueue(**d)
            db.add(q_item)
        await db.commit()

        res = await db.execute(select(CommunicationQueue).order_by(CommunicationQueue.created_at.desc()))
        items = res.scalars().all()

    output = []
    for item in items:
        output.append({
            "id": item.id,
            "title": item.title,
            "source_agent": item.source_agent,
            "priority": item.priority,
            "audience": item.audience,
            "status": item.status,
            "confidence": item.confidence,
            "payload": item.payload,
            "created_at": item.created_at.isoformat() + "Z"
        })
    return output

@router.post("/{id}/approve")
async def approve_queue_item(id: str = Path(...), db: AsyncSession = Depends(get_db)):
    """Approve incoming queue item."""
    stmt = select(CommunicationQueue).where(CommunicationQueue.id == id)
    res = await db.execute(stmt)
    item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Queue item not found.")

    item.status = "Approved"
    item.updated_at = datetime.utcnow()
    await db.commit()
    return {"status": "success", "message": f"Queue item '{item.title}' approved."}

@router.post("/{id}/reject")
async def reject_queue_item(id: str = Path(...), db: AsyncSession = Depends(get_db)):
    """Reject incoming queue item."""
    stmt = select(CommunicationQueue).where(CommunicationQueue.id == id)
    res = await db.execute(stmt)
    item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Queue item not found.")

    item.status = "Rejected"
    item.updated_at = datetime.utcnow()
    await db.commit()
    return {"status": "success", "message": f"Queue item '{item.title}' rejected."}

@router.post("/{id}/archive")
async def archive_queue_item(id: str = Path(...), db: AsyncSession = Depends(get_db)):
    """Archive queue item."""
    stmt = select(CommunicationQueue).where(CommunicationQueue.id == id)
    res = await db.execute(stmt)
    item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Queue item not found.")

    item.status = "Archived"
    item.updated_at = datetime.utcnow()
    await db.commit()
    return {"status": "success", "message": f"Queue item '{item.title}' archived."}
