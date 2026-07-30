import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Boolean
from app.database.base import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(250), nullable=False)
    message = Column(Text, nullable=False)
    recipient = Column(String(100), nullable=False, default="Chief of Staff")
    category = Column(String(50), nullable=False, default="System") # Delivery, Approval, Alert, Quality
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
