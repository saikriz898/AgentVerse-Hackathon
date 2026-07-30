from typing import List, Optional, Tuple, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc, or_, and_
from app.models.review import Review
from app.models.review_log import ReviewLog
from app.models.quality_score import QualityScore
from app.models.review_history import ReviewHistory
from app.models.agent_review import AgentReview
from app.schemas.review import StandardReviewOutput

class ReviewRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def save_review(
        self,
        agent_name: str,
        review_type: str,
        input_data: Dict[str, Any],
        review_result: StandardReviewOutput,
        user_id: Optional[str] = None
    ) -> Review:
        """Persist a completed review record and update logs, quality score, history, and agent stats."""
        # 1. Create main Review record
        issues_dict = [i.model_dump() for i in review_result.issues]
        result_dict = review_result.model_dump()

        db_review = Review(
            agent_name=agent_name,
            review_type=review_type,
            input_data=input_data if isinstance(input_data, dict) else {"raw": str(input_data)},
            review_result=result_dict,
            quality_score=review_result.quality_score,
            confidence=review_result.confidence,
            issues=issues_dict,
            warnings=review_result.warnings,
            suggestions=review_result.suggestions,
            status=review_result.status
        )
        self.db.add(db_review)
        await self.db.flush()  # populate db_review.id

        # 2. Create QualityScore record if breakdown present
        if review_result.score_breakdown:
            sb = review_result.score_breakdown
            db_score = QualityScore(
                review_id=db_review.id,
                accuracy=sb.accuracy,
                completeness=sb.completeness,
                consistency=sb.consistency,
                correctness=sb.correctness,
                formatting=sb.formatting,
                grammar=sb.grammar,
                structure=sb.structure,
                security=sb.security,
                performance=sb.performance,
                maintainability=sb.maintainability,
                compliance=sb.compliance,
                overall_score=sb.overall_score
            )
            self.db.add(db_score)

        # 3. Create ReviewLog record
        db_log = ReviewLog(
            review_id=db_review.id,
            log_level="INFO",
            message=f"Executed QA Review for '{agent_name}'. Status: {review_result.status}, Score: {review_result.quality_score}",
            metadata_json={"issues_count": len(review_result.issues), "status": review_result.status}
        )
        self.db.add(db_log)

        # 4. Create ReviewHistory entry
        db_history = ReviewHistory(
            review_id=db_review.id,
            version=1,
            action="CREATED",
            changed_by=user_id or "system",
            changes={"status": review_result.status, "quality_score": review_result.quality_score}
        )
        self.db.add(db_history)

        # 5. Update AgentReview aggregated stats
        stmt = select(AgentReview).where(AgentReview.agent_name == agent_name)
        res = await self.db.execute(stmt)
        agent_stat = res.scalars().first()

        if not agent_stat:
            agent_stat = AgentReview(
                agent_name=agent_name,
                total_reviews=1,
                approved_count=1 if review_result.status == "approved" else 0,
                rejected_count=1 if review_result.status == "rejected" else 0,
                avg_quality_score=review_result.quality_score
            )
            self.db.add(agent_stat)
        else:
            old_total = agent_stat.total_reviews
            new_total = old_total + 1
            agent_stat.total_reviews = new_total
            if review_result.status == "approved":
                agent_stat.approved_count += 1
            else:
                agent_stat.rejected_count += 1
            agent_stat.avg_quality_score = ((agent_stat.avg_quality_score * old_total) + review_result.quality_score) / new_total
            agent_stat.last_reviewed_at = datetime.now(timezone.utc)

        await self.db.commit()
        await self.db.refresh(db_review)
        return db_review

    async def get_by_id(self, review_id: str) -> Optional[Review]:
        result = await self.db.execute(select(Review).where(Review.id == review_id))
        return result.scalars().first()

    async def delete_review(self, review_id: str) -> bool:
        review = await self.get_by_id(review_id)
        if review:
            await self.db.delete(review)
            await self.db.commit()
            return True
        return False

    async def search_reviews(
        self,
        agent_name: Optional[str] = None,
        review_type: Optional[str] = None,
        status: Optional[str] = None,
        min_score: Optional[float] = None,
        max_score: Optional[float] = None,
        query: Optional[str] = None,
        skip: int = 0,
        limit: int = 50
    ) -> Tuple[List[Review], int]:
        filters = []
        if agent_name:
            filters.append(Review.agent_name.ilike(f"%{agent_name}%"))
        if review_type:
            filters.append(Review.review_type.ilike(f"%{review_type}%"))
        if status:
            filters.append(Review.status == status.lower())
        if min_score is not None:
            filters.append(Review.quality_score >= min_score)
        if max_score is not None:
            filters.append(Review.quality_score <= max_score)

        stmt = select(Review)
        if filters:
            stmt = stmt.where(and_(*filters))

        # Count total
        count_stmt = select(func.count(Review.id))
        if filters:
            count_stmt = count_stmt.where(and_(*filters))
        total_res = await self.db.execute(count_stmt)
        total = total_res.scalar() or 0

        # Execute query with pagination
        stmt = stmt.order_by(desc(Review.created_at)).offset(skip).limit(limit)
        results = await self.db.execute(stmt)
        reviews = list(results.scalars().all())

        return reviews, total
