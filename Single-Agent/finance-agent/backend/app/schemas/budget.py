from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DepartmentBudgetBase(BaseModel):
    department: str
    allocated_amount: float
    spent_amount: float = 0.0
    currency: str = "USD"

class DepartmentBudgetCreate(DepartmentBudgetBase):
    project_id: Optional[str] = None

class DepartmentBudgetResponse(DepartmentBudgetBase):
    id: str
    remaining_amount: float
    status: str
    warnings: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class BudgetOverviewResponse(BaseModel):
    total_budget: float
    total_spent: float
    remaining_budget: float
    currency: str
    department_allocations: List[DepartmentBudgetResponse]
    budget_warnings: List[str]
    optimization_recommendations: List[str]
