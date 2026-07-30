import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, Boolean, Float
from app.database.base import Base

class Communication(Base):
    __tablename__ = "communications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    communication_id = Column(String(50), nullable=True, index=True)
    title = Column(String(250), nullable=False)
    source_agent = Column(String(50), nullable=False, index=True)
    document_type = Column(String(50), nullable=False, index=True)
    communication_type = Column(String(50), nullable=True)
    priority = Column(String(20), nullable=False, default="Normal")
    audience = Column(String(50), nullable=False, default="Manager")
    tone = Column(String(50), nullable=False, default="Professional")
    channel = Column(String(50), nullable=False, default="Email")
    language = Column(String(50), nullable=False, default="English")
    
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    markdown = Column(Text, nullable=False)
    html = Column(Text, nullable=True)
    email_subject = Column(String(250), nullable=True)
    email_body = Column(Text, nullable=True)
    generated_content = Column(Text, nullable=True)
    
    status = Column(String(50), nullable=False, default="Generated") # Draft, Queued, Processing, Generated, Pending Review, Approved, Rejected, Scheduled, Delivered, Failed, Archived
    review_status = Column(String(50), nullable=False, default="VALIDATED")
    approval_status = Column(String(50), nullable=False, default="pending_approval")
    delivery_status = Column(String(50), nullable=False, default="pending_approval")
    
    generated_by = Column(String(100), nullable=False, default="Communication Agent")
    created_by = Column(String(100), nullable=False, default="System User")
    confidence = Column(Float, default=0.98)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
