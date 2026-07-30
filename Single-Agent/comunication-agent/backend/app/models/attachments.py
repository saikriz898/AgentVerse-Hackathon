import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from app.database.base import Base

class Attachment(Base):
    __tablename__ = "attachments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    communication_id = Column(String(36), nullable=False, index=True)
    file_name = Column(String(250), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)
    size_bytes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
