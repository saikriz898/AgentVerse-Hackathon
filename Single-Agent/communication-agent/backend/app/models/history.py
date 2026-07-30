import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, Float, ForeignKey
from app.database.base import Base

class CommunicationHistory(Base):
    __tablename__ = "communication_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    communication_id = Column(String(36), ForeignKey("communications.id", ondelete="SET NULL"), nullable=True, index=True)
    agent_name = Column(String(50), nullable=False)
    request = Column(JSON, nullable=False)
    response = Column(JSON, nullable=False)
    execution_time = Column(Float, default=0.0) # in ms or seconds
    status = Column(String(50), default="success")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
