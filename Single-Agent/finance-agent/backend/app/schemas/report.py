from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class ReportCreateRequest(BaseModel):
    report_title: str
    report_type: str  # Project Cost Report, Budget Report, Infrastructure Report, ROI Statement, Executive Summary
    project_id: Optional[str] = None
    file_format: str = "PDF"

class FinancialReportResponse(BaseModel):
    id: str
    report_title: str
    report_type: str
    project_id: Optional[str]
    author: str
    summary: str
    report_data: Dict[str, Any]
    file_format: str
    created_at: datetime

    class Config:
        from_attributes = True
