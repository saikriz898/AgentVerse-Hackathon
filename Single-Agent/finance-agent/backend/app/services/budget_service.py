from sqlalchemy.orm import Session
from app.models.budget import DepartmentBudget
import uuid

class BudgetService:
    def get_all_budgets(self, db: Session):
        budgets = db.query(DepartmentBudget).all()
        if not budgets:
            # Seed default department budgets
            defaults = [
                {"department": "Frontend Engineering", "allocated": 45000.0, "spent": 28500.0},
                {"department": "Backend & DB Infrastructure", "allocated": 65000.0, "spent": 42000.0},
                {"department": "Cloud & AI Hosting", "allocated": 30000.0, "spent": 19800.0},
                {"department": "DevOps & Security", "allocated": 25000.0, "spent": 14200.0},
                {"department": "QA & Automated Testing", "allocated": 18000.0, "spent": 11500.0},
                {"department": "Emergency Reserve Fund", "allocated": 20000.0, "spent": 3500.0},
            ]
            for d in defaults:
                rem = d["allocated"] - d["spent"]
                ratio = d["spent"] / d["allocated"]
                status = "Optimal" if ratio < 0.75 else ("Warning" if ratio < 0.9 else "Critical")
                b = DepartmentBudget(
                    id=str(uuid.uuid4()),
                    department=d["department"],
                    allocated_amount=d["allocated"],
                    spent_amount=d["spent"],
                    remaining_amount=rem,
                    currency="USD",
                    status=status,
                    warnings=["Budget spent > 70% threshold"] if ratio >= 0.7 else []
                )
                db.add(b)
            db.commit()
            budgets = db.query(DepartmentBudget).all()
        return budgets

    def create_department_budget(self, db: Session, dept: str, allocated: float, spent: float = 0.0):
        rem = allocated - spent
        ratio = spent / allocated if allocated > 0 else 0.0
        status = "Optimal" if ratio < 0.75 else ("Warning" if ratio < 0.9 else "Critical")
        b = DepartmentBudget(
            id=str(uuid.uuid4()),
            department=dept,
            allocated_amount=allocated,
            spent_amount=spent,
            remaining_amount=rem,
            currency="USD",
            status=status,
            warnings=["Budget spent > 70% threshold"] if ratio >= 0.7 else []
        )
        db.add(b)
        db.commit()
        db.refresh(b)
        return b

budget_service = BudgetService()
