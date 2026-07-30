import uuid
from datetime import datetime, timezone
from typing import Dict, Any
from sqlalchemy import String, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class ReviewHistory(Base):
    __tablename__ = "review_history"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    review_id: Mapped[str] = mapped_column(String(36), ForeignKey("reviews.id", ondelete="CASCADE"), index=True, nullable=False)
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)  # CREATED, RE_REVIEWED, STATUS_CHANGED
    changed_by: Mapped[str] = mapped_column(String(255), default="system", nullable=False)
    changes: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
