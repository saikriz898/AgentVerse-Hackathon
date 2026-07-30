import datetime
from sqlalchemy import Column, String, DateTime, Text, JSON
from app.database.session import Base

class FinancialReport(Base):
    __tablename__ = "financial_reports"

    id = Column(String, primary_key=True, index=True)
    report_title = Column(String, nullable=False)
    report_type = Column(String, nullable=False) # Executive Summary, Cost Breakdown, ROI Analysis, Infra Audit
    project_id = Column(String, nullable=True)
    author = Column(String, default="AI Financial Architect")
    summary = Column(Text, nullable=True)
    report_data = Column(JSON, default=dict)
    file_format = Column(String, default="PDF")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
