import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.database.base import Base

class DocumentRecord(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    communication_id = Column(String(36), ForeignKey("communications.id", ondelete="CASCADE"), nullable=False, index=True)
    file_path = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False) # markdown, html, pdf, docx, txt
    created_at = Column(DateTime, default=datetime.utcnow)
