import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from app.database.base import Base

class CommunicationTemplate(Base):
    __tablename__ = "templates"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    template_name = Column(String(100), nullable=False, unique=True)
    template_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    template_content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
