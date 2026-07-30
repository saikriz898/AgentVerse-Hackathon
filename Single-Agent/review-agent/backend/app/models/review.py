import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy import String, Float, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    agent_name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    review_type: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    
    input_data: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)
    review_result: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False, default=dict)
    
    quality_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    
    issues: Mapped[List[Any]] = mapped_column(JSON, default=list, nullable=False)
    warnings: Mapped[List[Any]] = mapped_column(JSON, default=list, nullable=False)
    suggestions: Mapped[List[Any]] = mapped_column(JSON, default=list, nullable=False)
    
    status: Mapped[str] = mapped_column(String(50), default="pending", index=True, nullable=False)  # approved, rejected, pending
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
