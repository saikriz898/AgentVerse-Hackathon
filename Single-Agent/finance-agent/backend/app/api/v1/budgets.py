from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.budget_service import budget_service
from app.schemas.budget import DepartmentBudgetResponse, BudgetOverviewResponse, DepartmentBudgetCreate
from typing import List

router = APIRouter()

@router.get("/", response_model=BudgetOverviewResponse)
def get_budget_overview(db: Session = Depends(get_db)):
    budgets = budget_service.get_all_budgets(db)
    total_allocated = sum(b.allocated_amount for b in budgets)
    total_spent = sum(b.spent_amount for b in budgets)
    remaining = total_allocated - total_spent

    warnings = []
    for b in budgets:
        if b.status in ["Warning", "Critical"]:
            warnings.append(f"{b.department}: Spent ${b.spent_amount:,.2f} of ${b.allocated_amount:,.2f} ({round((b.spent_amount/b.allocated_amount)*100, 1)}%)")

    recommendations = [
        "Reallocate $5,000 from Emergency Reserve to Cloud & AI Hosting to absorb token surge.",
        "Consolidate CI/CD pipelines to optimize DevOps budget usage.",
        "Implement automated cloud resource scheduling to lower weekend environment spend."
    ]

    return {
        "total_budget": total_allocated,
        "total_spent": total_spent,
        "remaining_budget": remaining,
        "currency": "USD",
        "department_allocations": budgets,
        "budget_warnings": warnings,
        "optimization_recommendations": recommendations
    }

@router.post("/", response_model=DepartmentBudgetResponse)
def create_budget(item: DepartmentBudgetCreate, db: Session = Depends(get_db)):
    b = budget_service.create_department_budget(db, item.department, item.allocated_amount, item.spent_amount)
    return b
