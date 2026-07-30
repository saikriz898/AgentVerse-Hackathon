import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON
from app.database.base import Base

class AudienceProfile(Base):
    __tablename__ = "audience_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), unique=True, nullable=False)
    role_description = Column(Text, nullable=False)
    preferred_tone = Column(String(50), nullable=False, default="Professional")
    preferred_channel = Column(String(50), nullable=False, default="Email")
    detail_level = Column(String(50), nullable=False, default="Summary")
    key_concerns = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ToneProfile(Base):
    __tablename__ = "tone_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(50), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    formality_level = Column(String(20), nullable=False, default="High")
    key_characteristics = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
