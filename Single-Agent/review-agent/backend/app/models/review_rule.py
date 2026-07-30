import uuid
from datetime import datetime, timezone
from typing import Dict, Any
from sqlalchemy import String, Boolean, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class ReviewRule(Base):
    __tablename__ = "review_rules"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    agent_name: Mapped[str] = mapped_column(String(100), default="ALL", nullable=False)
    review_type: Mapped[str] = mapped_column(String(100), default="ALL", nullable=False)
    rule_config: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
