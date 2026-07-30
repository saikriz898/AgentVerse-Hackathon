import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, Float
from app.database.base import Base

class CommunicationQueue(Base):
    __tablename__ = "communication_queue"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(250), nullable=False)
    source_agent = Column(String(50), nullable=False, index=True)
    priority = Column(String(20), nullable=False, default="Normal")
    audience = Column(String(50), nullable=False, default="Manager")
    status = Column(String(50), nullable=False, default="Pending") # Pending, Processing, Approved, Rejected, Archived
    confidence = Column(Float, default=0.98)
    payload = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
