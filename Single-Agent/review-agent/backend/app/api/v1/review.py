from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.agents.review_agent import review_agent
from app.repositories.review_repo import ReviewRepository
from app.schemas.review import (
    GenericReviewCreate,
    CodeReviewCreate,
    JSONReviewCreate,
    DocumentReviewCreate,
    ResearchReviewCreate,
    ExecutionReviewCreate,
    PlanningReviewCreate,
    MemoryReviewCreate,
    CommunicationReviewCreate,
    ChiefOfStaffReviewCreate,
    StandardReviewOutput,
    ReviewResponseRecord
)
from app.middleware.auth_middleware import get_current_user
from app.models.user import User

router = APIRouter(prefix="/review", tags=["Review Agent Operations"])

@router.post("", response_model=StandardReviewOutput)
async def create_generic_review(
    req: GenericReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Universal Review endpoint for any agent output."""
    review_output = await review_agent.execute_review(
        agent_name=req.agent_name,
        review_type=req.review_type,
        content=req.content,
        metadata=req.metadata
    )
    # Persist review to DB
    repo = ReviewRepository(db)
    user_id = current_user.id if current_user else "system"
    await repo.save_review(
        agent_name=req.agent_name,
        review_type=req.review_type,
        input_data={"content": req.content, "metadata": req.metadata},
        review_result=review_output,
        user_id=user_id
    )
    return review_output

@router.post("/code", response_model=StandardReviewOutput)
async def review_code_output(
    req: CodeReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Specialized Code Review endpoint for Python, Java, JS, TS, HTML, CSS, SQL."""
    metadata = {"language": req.language, "context": req.context}
    review_output = await review_agent.execute_review(
        agent_name=req.agent_name,
        review_type="Code Review",
        content=req.code,
        metadata=metadata
    )
    repo = ReviewRepository(db)
    user_id = current_user.id if current_user else "system"
    await repo.save_review(
        agent_name=req.agent_name,
        review_type="Code Review",
        input_data={"code": req.code, "language": req.language},
        review_result=review_output,
        user_id=user_id
    )
    return review_output

@router.post("/json", response_model=StandardReviewOutput)
async def review_json_output(
    req: JSONReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Specialized JSON Validation endpoint."""
    metadata = {
        "required_keys": req.required_keys,
        "schema_definition": req.schema_definition
    }
    review_output = await review_agent.execute_review(
        agent_name=req.agent_name,
        review_type="JSON Review",
        content=req.json_data,
        metadata=metadata
    )
    repo = ReviewRepository(db)
    user_id = current_user.id if current_user else "system"
    await repo.save_review(
        agent_name=req.agent_name,
        review_type="JSON Review",
        input_data={"json_data": req.json_data},
        review_result=review_output,
        user_id=user_id
    )
    return review_output

@router.post("/document", response_model=StandardReviewOutput)
async def review_document_output(
    req: DocumentReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Specialized Document & Markdown Review endpoint."""
    metadata = {"document_type": req.document_type, "title": req.title}
    review_output = await review_agent.execute_review(
        agent_name=req.agent_name,
        review_type="Document Review",
        content=req.content,
        metadata=metadata
    )
    repo = ReviewRepository(db)
    user_id = current_user.id if current_user else "system"
    await repo.save_review(
        agent_name=req.agent_name,
        review_type="Document Review",
        input_data={"content": req.content, "document_type": req.document_type},
        review_result=review_output,
        user_id=user_id
    )
    return review_output

@router.post("/research", response_model=StandardReviewOutput)
async def review_research_output(
    req: ResearchReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Specialized Research Output Review endpoint."""
    metadata = {"topic": req.topic, "sources": req.sources}
    review_output = await review_agent.execute_review(
        agent_name=req.agent_name,
        review_type="Research Review",
        content=req.findings,
        metadata=metadata
    )
    repo = ReviewRepository(db)
    user_id = current_user.id if current_user else "system"
    await repo.save_review(
        agent_name=req.agent_name,
        review_type="Research Review",
        input_data={"findings": req.findings, "topic": req.topic, "sources": req.sources},
        review_result=review_output,
        user_id=user_id
    )
    return review_output

@router.post("/execution", response_model=StandardReviewOutput)
async def review_execution_output(
    req: ExecutionReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Specialized Execution Output Review endpoint."""
    metadata = {"execution_type": req.execution_type}
    review_output = await review_agent.execute_review(
        agent_name=req.agent_name,
        review_type="Execution Review",
        content=req.output,
        metadata=metadata
    )
    repo = ReviewRepository(db)
    user_id = current_user.id if current_user else "system"
    await repo.save_review(
        agent_name=req.agent_name,
        review_type="Execution Review",
        input_data={"output": req.output, "execution_type": req.execution_type},
        review_result=review_output,
        user_id=user_id
    )
    return review_output

@router.post("/planning", response_model=StandardReviewOutput)
async def review_planning_output(
    req: PlanningReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Specialized Planning Output Review endpoint."""
    metadata = {"goal": req.goal, "milestones": req.milestones}
    review_output = await review_agent.execute_review(
        agent_name=req.agent_name,
        review_type="Planning Review",
        content=req.plan,
        metadata=metadata
    )
    repo = ReviewRepository(db)
    user_id = current_user.id if current_user else "system"
    await repo.save_review(
        agent_name=req.agent_name,
        review_type="Planning Review",
        input_data={"plan": req.plan, "goal": req.goal},
        review_result=review_output,
        user_id=user_id
    )
    return review_output

@router.post("/memory", response_model=StandardReviewOutput)
async def review_memory_output(
    req: MemoryReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Specialized Memory Agent Entry Review endpoint."""
    content_payload = {
        "category": req.category,
        "tags": req.tags,
        "importance_score": req.importance_score,
        "summary": req.summary,
        **(req.data or {})
    }
    review_output = await review_agent.execute_review(
        agent_name=req.agent_name,
        review_type="Memory Review",
        content=content_payload
    )
    repo = ReviewRepository(db)
    user_id = current_user.id if current_user else "system"
    await repo.save_review(
        agent_name=req.agent_name,
        review_type="Memory Review",
        input_data=content_payload,
        review_result=review_output,
        user_id=user_id
    )
    return review_output

@router.post("/communication", response_model=StandardReviewOutput)
async def review_communication_output(
    req: CommunicationReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Specialized Communication Output Review endpoint."""
    metadata = {"comm_type": req.comm_type, "subject": req.subject}
    review_output = await review_agent.execute_review(
        agent_name=req.agent_name,
        review_type="Communication Review",
        content=req.content,
        metadata=metadata
    )
    repo = ReviewRepository(db)
    user_id = current_user.id if current_user else "system"
    await repo.save_review(
        agent_name=req.agent_name,
        review_type="Communication Review",
        input_data={"content": req.content, "comm_type": req.comm_type, "subject": req.subject},
        review_result=review_output,
        user_id=user_id
    )
    return review_output

@router.post("/chief-of-staff", response_model=StandardReviewOutput)
async def review_chief_of_staff_output(
    req: ChiefOfStaffReviewCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Specialized Chief of Staff Output Review endpoint."""
    metadata = {"task_summary": req.task_summary, "delegated_agents": req.delegated_agents}
    review_output = await review_agent.execute_review(
        agent_name=req.agent_name,
        review_type="Chief of Staff Review",
        content=req.content,
        metadata=metadata
    )
    repo = ReviewRepository(db)
    user_id = current_user.id if current_user else "system"
    await repo.save_review(
        agent_name=req.agent_name,
        review_type="Chief of Staff Review",
        input_data={"content": req.content, "task_summary": req.task_summary, "delegated_agents": req.delegated_agents},
        review_result=review_output,
        user_id=user_id
    )
    return review_output

@router.get("/history")
async def get_review_history(
    agent_name: Optional[str] = Query(None),
    review_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    min_score: Optional[float] = Query(None),
    max_score: Optional[float] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get paginated and filterable review history."""
    repo = ReviewRepository(db)
    reviews, total = await repo.search_reviews(
        agent_name=agent_name,
        review_type=review_type,
        status=status,
        min_score=min_score,
        max_score=max_score,
        skip=skip,
        limit=limit
    )
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "items": [
            {
                "id": r.id,
                "agent_name": r.agent_name,
                "review_type": r.review_type,
                "quality_score": r.quality_score,
                "confidence": r.confidence,
                "status": r.status,
                "issues_count": len(r.issues) if isinstance(r.issues, list) else 0,
                "created_at": r.created_at.isoformat()
            }
            for r in reviews
        ]
    }

@router.get("/{id}")
async def get_review_by_id(id: str, db: AsyncSession = Depends(get_db)):
    """Get detailed review record by UUID."""
    repo = ReviewRepository(db)
    review = await repo.get_by_id(id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review with id '{id}' not found"
        )
    return {
        "id": review.id,
        "agent_name": review.agent_name,
        "review_type": review.review_type,
        "input_data": review.input_data,
        "review_result": review.review_result,
        "quality_score": review.quality_score,
        "confidence": review.confidence,
        "issues": review.issues,
        "warnings": review.warnings,
        "suggestions": review.suggestions,
        "status": review.status,
        "created_at": review.created_at.isoformat(),
        "updated_at": review.updated_at.isoformat()
    }

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(id: str, db: AsyncSession = Depends(get_db)):
    """Delete review record by ID."""
    repo = ReviewRepository(db)
    deleted = await repo.delete_review(id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review with id '{id}' not found"
        )
    return None
