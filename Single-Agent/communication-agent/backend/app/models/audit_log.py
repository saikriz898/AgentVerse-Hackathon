import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, Integer
from app.database.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_or_agent = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False) # APPROVE, REJECT, TRANSFORM, DELIVER
    resource = Column(String(100), nullable=False)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class PromptHistory(Base):
    __tablename__ = "prompt_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    communication_id = Column(String(36), nullable=True, index=True)
    prompt_text = Column(Text, nullable=False)
    response_text = Column(Text, nullable=False)
    tokens_used = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
