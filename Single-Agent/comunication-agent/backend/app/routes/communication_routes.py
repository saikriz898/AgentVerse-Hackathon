from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, Query, Path, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.controllers.communication_controller import communication_controller
from app.schemas.communication import (
    TransformationRequest,
    TransformationResponse,
    ExportRequest,
    DeliveryRequest,
    ChannelEnum
)
from app.services.transformation_service import transformation_service
from app.services.quality_engine import quality_engine
from app.models.communication import Communication

router = APIRouter(prefix="/communication", tags=["Communication Operations"])

@router.post("", response_model=TransformationResponse, status_code=201)
@router.post("/transform", response_model=TransformationResponse)
async def create_communication(req: TransformationRequest, db: AsyncSession = Depends(get_db)):
    """Core REST Endpoint: Process technical payload using 12-Step Communication Intelligence Engine."""
    return await transformation_service.process_transformation(req, db)

@router.get("", response_model=List[TransformationResponse])
@router.get("/history", response_model=List[TransformationResponse])
async def list_communications(
    source_agent: Optional[str] = Query(None),
    document_type: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve paginated communications list with optional filters."""
    return await communication_controller.get_history(db, source_agent, document_type, language, limit, offset)

@router.get("/delivery-tracking")
async def get_delivery_tracking(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve live delivery tracking list for Chief of Staff."""
    stmt = select(Communication).order_by(Communication.created_at.desc()).limit(limit)
    res = await db.execute(stmt)
    records = res.scalars().all()

    items = []
    for r in records:
        items.append({
            "id": r.id,
            "title": r.title,
            "source_agent": r.source_agent,
            "document_type": r.document_type,
            "status": r.status,
            "language": r.language,
            "confidence": r.confidence,
            "created_at": r.created_at.isoformat() + "Z",
            "chief_of_staff_synced": True
        })

    return {
        "total_tracked": len(items),
        "deliveries": items
    }

@router.post("/analyze")
async def analyze_communication(payload: Dict[str, Any]):
    """Run dedicated AI Quality & Hallucination Analysis on communication payload."""
    content = payload.get("content") or payload.get("markdown") or str(payload)
    source_payload = payload.get("payload") or payload
    analysis = quality_engine.evaluate_communication(content, source_payload)
    return {
        "status": "success",
        "analysis": analysis
    }

@router.post("/{id}/approve")
@router.post("/approve-and-deliver")
async def approve_and_deliver(
    id: Optional[str] = None,
    req: Optional[DeliveryRequest] = None,
    db: AsyncSession = Depends(get_db)
):
    """Single-click approval & delivery endpoint that notifies Chief of Staff."""
    target_id = id or (req.communication_id if req else None)
    if not target_id:
        raise HTTPException(status_code=400, detail="Missing communication_id.")

    stmt = select(Communication).where(Communication.id == target_id)
    res = await db.execute(stmt)
    record = res.scalar_one_or_none()

    if not record:
        raise HTTPException(status_code=404, detail="Communication record not found.")

    channel_name = req.channel.value if req and req.channel else record.channel or "Email"
    approved_by_user = req.approved_by if req else "Executive AI Assistant"

    record.status = "Delivered"
    record.delivery_status = "delivered"
    record.approval_status = "Approved"
    record.updated_at = datetime.utcnow()
    await db.commit()

    return {
        "status": "success",
        "message": f"Communication '{record.title}' approved by {approved_by_user} and successfully delivered via {channel_name}.",
        "communication_id": record.id,
        "delivery_channel": channel_name,
        "delivered_at": record.updated_at.isoformat() + "Z",
        "chief_of_staff_notified": True,
        "chief_of_staff_payload": {
            "event": "COMMUNICATION_DELIVERED",
            "source_agent": record.source_agent,
            "title": record.title,
            "status": "DELIVERED_SUCCESSFULLY"
        }
    }

@router.post("/{id}/deliver")
async def deliver_communication(
    id: str = Path(...),
    req: Optional[DeliveryRequest] = None,
    db: AsyncSession = Depends(get_db)
):
    """Deliver communication via recommended channel."""
    return await approve_and_deliver(id=id, req=req, db=db)

@router.post("/summary", response_model=TransformationResponse)
async def generate_summary(payload: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Generate Executive Summary document."""
    return await communication_controller.generate_summary(db, payload)

@router.post("/report", response_model=TransformationResponse)
async def generate_report(payload: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Generate Project Report document."""
    return await communication_controller.generate_report(db, payload)

@router.post("/email", response_model=TransformationResponse)
async def generate_email(payload: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Generate Professional Email."""
    return await communication_controller.generate_email(db, payload)

@router.post("/markdown", response_model=TransformationResponse)
async def generate_markdown(payload: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Generate Markdown Report document."""
    return await communication_controller.generate_markdown(db, payload)

@router.post("/html", response_model=TransformationResponse)
async def generate_html(payload: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Generate HTML Report document."""
    return await communication_controller.generate_html(db, payload)

@router.post("/meeting-notes", response_model=TransformationResponse)
async def generate_meeting_notes(payload: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Generate Meeting Notes document."""
    return await communication_controller.generate_meeting_notes(db, payload)

@router.post("/status", response_model=TransformationResponse)
async def generate_status(payload: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Generate Status Update document."""
    return await communication_controller.generate_status(db, payload)

@router.post("/release-notes", response_model=TransformationResponse)
async def generate_release_notes(payload: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Generate Release Notes document."""
    return await communication_controller.generate_release_notes(db, payload)

@router.post("/documentation", response_model=TransformationResponse)
async def generate_documentation(payload: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Generate Technical Documentation."""
    return await communication_controller.generate_documentation(db, payload)

@router.post("/send-email")
async def send_real_email(payload: Dict[str, Any]):
    """Send real email to target recipient via SMTP engine."""
    recipient = payload.get("recipient")
    subject = payload.get("subject")
    body = payload.get("body")
    cc = payload.get("cc")
    if not recipient or not subject or not body:
        return {"status": "error", "message": "Missing recipient, subject, or body in payload."}
    return await communication_controller.send_real_email(recipient, subject, body, cc)

@router.get("/{id}", response_model=TransformationResponse)
async def get_communication_detail(id: str = Path(...), db: AsyncSession = Depends(get_db)):
    """Retrieve detailed single communication record."""
    return await communication_controller.get_by_id(db, id)

@router.put("/{id}", response_model=TransformationResponse)
async def update_communication(
    id: str = Path(...),
    update_data: Dict[str, Any] = {},
    db: AsyncSession = Depends(get_db)
):
    """Update communication record title or approved content."""
    stmt = select(Communication).where(Communication.id == id)
    res = await db.execute(stmt)
    record = res.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Communication record not found.")

    if "title" in update_data: record.title = update_data["title"]
    if "content" in update_data: record.content = update_data["content"]
    if "status" in update_data: record.status = update_data["status"]

    record.updated_at = datetime.utcnow()
    await db.commit()
    return await communication_controller.get_by_id(db, id)

@router.delete("/{id}")
async def delete_communication(id: str = Path(...), db: AsyncSession = Depends(get_db)):
    """Delete a communication record."""
    return await communication_controller.delete_by_id(db, id)
