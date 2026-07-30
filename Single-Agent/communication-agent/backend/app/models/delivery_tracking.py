import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, Integer, Boolean
from app.database.base import Base

class DeliveryTracking(Base):
    __tablename__ = "delivery_tracking"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    communication_id = Column(String(36), nullable=False, index=True)
    
    channel = Column(String(50), nullable=False) # Email, Slack, Teams, SMS, PDF, etc.
    recipient = Column(String(200), nullable=False)
    status = Column(String(50), nullable=False, default="Delivered") # Queued, Delivered, Failed, Retrying
    
    retry_count = Column(Integer, default=0)
    error_log = Column(Text, nullable=True)
    
    delivered_at = Column(DateTime, default=datetime.utcnow)
    chief_of_staff_notified = Column(Boolean, default=True)
    chief_of_staff_synced_at = Column(DateTime, default=datetime.utcnow)
