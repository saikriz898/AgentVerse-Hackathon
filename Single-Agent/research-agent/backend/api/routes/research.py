from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional
import uuid
import time
from datetime import datetime, timezone

from backend.database.connection import get_db
from backend.models.user import User
from backend.models.research import ResearchRequest, ResearchResult, ResearchSource
from backend.schemas.research import (
    ResearchStartRequest,
    QuickSearchRequest,
    SummarizeRequest,
    CompareRequest,
    FactCheckRequest,
    LifeOSResearchResponse,
    ResearchHistoryResponse,
    ResearchHistoryItem
)
from backend.services.research_engine.engine import ResearchEngine
from backend.services.research_engine.search.multi_source_search import MultiSourceSearcher
from backend.services.research_engine.summarizer.gemini_summarizer import GeminiSummarizer
from backend.services.research_engine.fact_checker.fact_checker import FactChecker
from backend.authentication.jwt_handler import get_current_user

router = APIRouter(prefix="/research", tags=["Research"])
engine = ResearchEngine()
searcher = MultiSourceSearcher()
summarizer = GeminiSummarizer()

@router.post("/start", response_model=LifeOSResearchResponse)
async def start_research(
    payload: ResearchStartRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id_str = str(current_user.id) if current_user else None
    return await engine.execute_research(payload, db, user_id=user_id_str)

@router.post("/search")
async def quick_search(payload: QuickSearchRequest):
    start_time = time.time()
    results = await searcher.execute_multi_search(
        queries=[payload.query],
        max_results_per_query=6
    )
    elapsed = time.time() - start_time
    return {
        "status": "success",
        "agent": "Research",
        "query": payload.query,
        "results_count": len(results),
        "execution_time": f"{elapsed:.2f}s",
        "results": results
    }

@router.post("/summarize")
async def summarize_content(payload: SummarizeRequest):
    start_time = time.time()
    dummy_source = [{
        "title": "Submitted Article",
        "website_name": "Direct Content",
        "url": payload.url or "https://direct-input.local",
        "content_snippet": payload.content[:1500]
    }]
    summary, exec_summary, keywords, recs = await summarizer.synthesize_research(
        objective="Summarize content",
        sources=dummy_source
    )
    elapsed = time.time() - start_time
    return {
        "status": "success",
        "agent": "Research",
        "summary": summary,
        "executive_summary": exec_summary,
        "keywords": keywords,
        "recommendations": recs,
        "execution_time": f"{elapsed:.2f}s"
    }

@router.post("/compare")
async def compare_topics(payload: CompareRequest):
    start_time = time.time()
    combined_query = " vs ".join(payload.topics)
    search_results = await searcher.execute_multi_search([combined_query], max_results_per_query=6)
    
    summary, exec_summary, keywords, recs = await summarizer.synthesize_research(
        objective=f"Compare {payload.topics}",
        sources=search_results
    )
    elapsed = time.time() - start_time
    return {
        "status": "success",
        "agent": "Research",
        "compared_topics": payload.topics,
        "summary": summary,
        "executive_summary": exec_summary,
        "keywords": keywords,
        "recommendations": recs,
        "sources_count": len(search_results),
        "execution_time": f"{elapsed:.2f}s"
    }

@router.post("/fact-check")
async def fact_check_claim(payload: FactCheckRequest):
    start_time = time.time()
    search_results = await searcher.execute_multi_search([payload.claim], max_results_per_query=5)
    verification = FactChecker.verify_facts(payload.claim, search_results, claim=payload.claim)
    elapsed = time.time() - start_time
    return {
        "status": "success",
        "agent": "Research",
        "claim": payload.claim,
        "verification": verification,
        "execution_time": f"{elapsed:.2f}s"
    }

@router.get("/history", response_model=ResearchHistoryResponse)
async def get_history(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ResearchRequest, ResearchResult).join(
        ResearchResult, ResearchRequest.id == ResearchResult.request_id
    ).order_by(desc(ResearchRequest.created_at))

    if search:
        stmt = stmt.where(ResearchRequest.objective.ilike(f"%{search}%"))

    result = await db.execute(stmt.offset(offset).limit(limit))
    rows = result.all()

    items = []
    for req, res in rows:
        exec_sec = f"{req.execution_time_ms / 1000:.2f}s" if req.execution_time_ms else "0.0s"
        items.append(ResearchHistoryItem(
            id=req.id,
            objective=req.objective,
            confidence=res.confidence_score,
            summary=res.executive_summary or res.summary[:150] + "...",
            created_at=req.created_at.isoformat() if req.created_at else datetime.now(timezone.utc).isoformat(),
            execution_time=exec_sec,
            source_count=len(res.sources) if hasattr(res, "sources") and res.sources else 3
        ))

    return ResearchHistoryResponse(
        status="success",
        total=len(items),
        items=items
    )

@router.get("/result/{id}", response_model=LifeOSResearchResponse)
async def get_result_by_id(id: str, db: AsyncSession = Depends(get_db)):
    try:
        req_uuid = uuid.UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format.")

    stmt = select(ResearchRequest, ResearchResult).join(
        ResearchResult, ResearchRequest.id == ResearchResult.request_id
    ).where(ResearchRequest.id == req_uuid)
    
    res_pair = (await db.execute(stmt)).first()
    if not res_pair:
        raise HTTPException(status_code=404, detail="Research result not found.")

    req, res = res_pair

    # Fetch sources
    src_stmt = select(ResearchSource).where(ResearchSource.result_id == res.id)
    sources_db = (await db.execute(src_stmt)).scalars().all()

    refs = []
    for s in sources_db:
        refs.append({
            "website_name": s.website_name,
            "article_title": s.title,
            "url": s.url,
            "published_date": s.published_date or "2026",
            "author": s.author or "N/A",
            "credibility_score": s.credibility_score or 0.85
        })

    exec_time_str = f"{req.execution_time_ms / 1000:.2f}s" if req.execution_time_ms else "1.5s"

    return LifeOSResearchResponse(
        status="success",
        agent="Research",
        request_id=str(req.id),
        timestamp=req.created_at.isoformat() if req.created_at else datetime.now(timezone.utc).isoformat(),
        confidence=res.confidence_score,
        summary=res.summary,
        executive_summary=res.executive_summary,
        keywords=res.keywords or [],
        references=refs,
        recommendations=res.recommendations or [],
        execution_time=exec_time_str
    )

@router.delete("/{id}")
async def delete_research(id: str, db: AsyncSession = Depends(get_db)):
    try:
        req_uuid = uuid.UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format.")

    result = await db.execute(select(ResearchRequest).where(ResearchRequest.id == req_uuid))
    req = result.scalars().first()
    if not req:
        raise HTTPException(status_code=404, detail="Research request not found.")

    await db.delete(req)
    await db.commit()

    return {"status": "success", "message": f"Deleted research record {id} successfully."}
