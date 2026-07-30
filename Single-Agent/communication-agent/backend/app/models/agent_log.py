import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, Float, ForeignKey
from app.database.base import Base

class AgentRequest(Base):
    __tablename__ = "agent_requests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(100), nullable=False, index=True)
    agent = Column(String(50), nullable=False)
    document_type = Column(String(50), nullable=False)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AgentResponse(Base):
    __tablename__ = "agent_responses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(100), nullable=False, index=True)
    status = Column(String(50), default="success")
    document_type = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    confidence = Column(Float, default=0.98)
    created_at = Column(DateTime, default=datetime.utcnow)
