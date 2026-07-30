import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class QualityScore(Base):
    __tablename__ = "quality_scores"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    review_id: Mapped[str] = mapped_column(String(36), ForeignKey("reviews.id", ondelete="CASCADE"), index=True, nullable=False)
    
    accuracy: Mapped[float] = mapped_column(Float, default=100.0)
    completeness: Mapped[float] = mapped_column(Float, default=100.0)
    consistency: Mapped[float] = mapped_column(Float, default=100.0)
    correctness: Mapped[float] = mapped_column(Float, default=100.0)
    formatting: Mapped[float] = mapped_column(Float, default=100.0)
    grammar: Mapped[float] = mapped_column(Float, default=100.0)
    structure: Mapped[float] = mapped_column(Float, default=100.0)
    security: Mapped[float] = mapped_column(Float, default=100.0)
    performance: Mapped[float] = mapped_column(Float, default=100.0)
    maintainability: Mapped[float] = mapped_column(Float, default=100.0)
    compliance: Mapped[float] = mapped_column(Float, default=100.0)
    
    overall_score: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
