import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer, Float
from app.database.base import Base

class GenerationLog(Base):
    __tablename__ = "generation_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    request_id = Column(String(100), nullable=True, index=True)
    agent = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False, default="gemini-2.5-flash")
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    latency = Column(Float, default=0.0) # in ms
    status = Column(String(50), default="success")
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
