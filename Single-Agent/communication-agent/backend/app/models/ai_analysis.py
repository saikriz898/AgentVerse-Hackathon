import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, Float, Boolean
from app.database.base import Base

class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    communication_id = Column(String(36), nullable=False, index=True)
    
    quality_score = Column(Float, nullable=False, default=95.0) # 0.0 - 100.0%
    confidence_score = Column(Float, nullable=False, default=0.98) # 0.0 - 1.0
    readability_index = Column(Float, nullable=False, default=85.0) # Flesch-Kincaid / Readability score
    hallucination_risk = Column(String(20), nullable=False, default="Low") # Low, Medium, High
    brand_consistency = Column(String(20), nullable=False, default="High")
    
    grammar_rating = Column(String(20), default="Excellent")
    completeness_score = Column(Float, default=0.98)
    
    improvement_suggestions = Column(JSON, nullable=True) # List of suggestions
    created_at = Column(DateTime, default=datetime.utcnow)
