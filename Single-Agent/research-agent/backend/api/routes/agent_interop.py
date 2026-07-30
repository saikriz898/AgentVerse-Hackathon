from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
from typing import Dict, Any

from backend.database.connection import get_db
from backend.models.research import ResearchRequest, ResearchResult, ResearchSource
from backend.schemas.research import ResearchStartRequest, LifeOSResearchResponse
from backend.schemas.agent import ChiefOfStaffQueryRequest, InterAgentQueryRequest
from backend.services.research_engine.engine import ResearchEngine

router = APIRouter(prefix="/agent", tags=["Inter-Agent Interoperability"])
engine = ResearchEngine()

@router.post("/chief-of-staff/query", response_model=LifeOSResearchResponse)
async def chief_of_staff_query(
    payload: ChiefOfStaffQueryRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Dedicated entry point for Chief of Staff Agent to trigger deep research.
    """
    req = ResearchStartRequest(objective=payload.query)
    return await engine.execute_research(req, db)

@router.get("/chief-of-staff/result/{id}/summary")
async def get_result_summary_for_chief(id: str, db: AsyncSession = Depends(get_db)):
    """Chief of Staff API: Retrieve concise summary of research result."""
    try:
        req_uuid = uuid.UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format.")

    stmt = select(ResearchResult).where(ResearchResult.request_id == req_uuid)
    result = (await db.execute(stmt)).scalars().first()
    if not result:
        raise HTTPException(status_code=404, detail="Research result not found.")

    return {
        "status": "success",
        "agent": "Research",
        "request_id": id,
        "summary": result.summary,
        "executive_summary": result.executive_summary,
        "confidence": result.confidence_score
    }

@router.get("/chief-of-staff/result/{id}/references")
async def get_result_references_for_chief(id: str, db: AsyncSession = Depends(get_db)):
    """Chief of Staff API: Retrieve list of references for research result."""
    try:
        req_uuid = uuid.UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format.")

    stmt = select(ResearchResult).where(ResearchResult.request_id == req_uuid)
    res = (await db.execute(stmt)).scalars().first()
    if not res:
        raise HTTPException(status_code=404, detail="Research result not found.")

    src_stmt = select(ResearchSource).where(ResearchSource.result_id == res.id)
    sources = (await db.execute(src_stmt)).scalars().all()

    refs = []
    for s in sources:
        refs.append({
            "website_name": s.website_name,
            "article_title": s.title,
            "url": s.url,
            "published_date": s.published_date,
            "author": s.author
        })

    return {
        "status": "success",
        "agent": "Research",
        "request_id": id,
        "confidence": res.confidence_score,
        "references": refs
    }

@router.post("/interop/query")
async def inter_agent_query(
    payload: InterAgentQueryRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Generic inter-agent RPC router for Planning, Execution, Review, and Communication agents.
    """
    action = payload.action.lower()
    
    if action in ["search", "start"]:
        objective = payload.payload.get("objective") or payload.payload.get("query")
        if not objective:
            raise HTTPException(status_code=400, detail="Missing objective in payload.")
        req = ResearchStartRequest(objective=objective)
        return await engine.execute_research(req, db)
        
    elif action == "get_summary":
        req_id = payload.payload.get("request_id")
        return await get_result_summary_for_chief(req_id, db)
        
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported inter-agent action: '{payload.action}'")
