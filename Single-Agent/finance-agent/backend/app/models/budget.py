import datetime
from sqlalchemy import Column, String, Float, DateTime, JSON
from app.database.session import Base

class DepartmentBudget(Base):
    __tablename__ = "department_budgets"

    id = Column(String, primary_key=True, index=True)
    project_id = Column(String, index=True, nullable=True)
    department = Column(String, nullable=False) # Frontend, Backend, Cloud, AI, Security, Emergency
    allocated_amount = Column(Float, default=0.0)
    spent_amount = Column(Float, default=0.0)
    remaining_amount = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    status = Column(String, default="Optimal") # Optimal, Warning, Critical
    warnings = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
