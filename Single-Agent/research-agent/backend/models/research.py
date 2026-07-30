import uuid
from datetime import datetime, timezone

try:
    from sqlalchemy import Column, String, Text, Integer, Float, DateTime, ForeignKey, JSON
    from sqlalchemy.orm import relationship
    from backend.database.connection import Base
    from backend.models.user import GUID

    class ResearchRequest(Base):
        __tablename__ = "research_requests"

        id = Column(GUID(), primary_key=True, default=uuid.uuid4)
        user_id = Column(GUID(), ForeignKey("users.id"), nullable=True)
        objective = Column(Text, nullable=False)
        filters = Column(JSON, nullable=True, default=dict)
        status = Column(String(50), nullable=False, default="completed")
        execution_time_ms = Column(Integer, nullable=True, default=0)
        created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

        results = relationship("ResearchResult", back_populates="request", cascade="all, delete-orphan")

    class ResearchResult(Base):
        __tablename__ = "research_results"

        id = Column(GUID(), primary_key=True, default=uuid.uuid4)
        request_id = Column(GUID(), ForeignKey("research_requests.id"), nullable=False)
        confidence_score = Column(Integer, nullable=False, default=85)
        summary = Column(Text, nullable=False)
        executive_summary = Column(Text, nullable=True)
        keywords = Column(JSON, nullable=True, default=list)
        recommendations = Column(JSON, nullable=True, default=list)
        status = Column(String(50), nullable=False, default="success")
        created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

        request = relationship("ResearchRequest", back_populates="results")
        sources = relationship("ResearchSource", back_populates="result", cascade="all, delete-orphan")

    class ResearchSource(Base):
        __tablename__ = "research_sources"

        id = Column(GUID(), primary_key=True, default=uuid.uuid4)
        result_id = Column(GUID(), ForeignKey("research_results.id"), nullable=False)
        title = Column(String(512), nullable=False)
        website_name = Column(String(255), nullable=False)
        url = Column(Text, nullable=False)
        published_date = Column(String(100), nullable=True)
        author = Column(String(255), nullable=True)
        content_snippet = Column(Text, nullable=True)
        credibility_score = Column(Float, nullable=True, default=0.85)
        created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

        result = relationship("ResearchResult", back_populates="sources")

    class ResearchCache(Base):
        __tablename__ = "research_cache"

        id = Column(GUID(), primary_key=True, default=uuid.uuid4)
        query_hash = Column(String(255), unique=True, nullable=False, index=True)
        results_json = Column(JSON, nullable=False)
        expires_at = Column(DateTime(timezone=True), nullable=False)
        created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    class AgentLog(Base):
        __tablename__ = "agent_logs"

        id = Column(GUID(), primary_key=True, default=uuid.uuid4)
        request_id = Column(GUID(), nullable=True)
        agent_name = Column(String(100), nullable=False, default="Research")
        log_level = Column(String(50), nullable=False, default="INFO")
        message = Column(Text, nullable=False)
        metadata_json = Column(JSON, nullable=True, default=dict)
        created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

except ImportError:
    class ResearchRequest: pass
    class ResearchResult: pass
    class ResearchSource: pass
    class ResearchCache: pass
    class AgentLog: pass

