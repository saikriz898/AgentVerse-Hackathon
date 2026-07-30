from fastapi import APIRouter, Query
from typing import Dict, Any, List

router = APIRouter()

@router.get("/predict")
def predict_financial_growth(
    horizon_months: int = Query(24, ge=6, le=36),
    initial_monthly_expense: float = Query(7500.0, ge=500.0),
    growth_scenario: str = Query("Base", examples=["Base"]) # Conservative, Base, Aggressive
) -> Dict[str, Any]:
    mult_map = {"Conservative": 0.015, "Base": 0.035, "Aggressive": 0.075}
    rate = mult_map.get(growth_scenario, 0.035)

    forecast_items: List[Dict[str, Any]] = []
    cum_expenses = 0.0
    cum_revenue = 0.0

    for m in range(1, horizon_months + 1):
        infra_cost = initial_monthly_expense * 0.40 * (1 + rate * m)
        maintenance_cost = initial_monthly_expense * 0.25 * (1 + 0.01 * m)
        cloud_ai_cost = initial_monthly_expense * 0.20 * (1 + rate * 1.2 * m)
        support_cost = initial_monthly_expense * 0.15 * (1 + 0.008 * m)

        total_mo_exp = round(infra_cost + maintenance_cost + cloud_ai_cost + support_cost, 2)
        rev_mo = round(initial_monthly_expense * 0.80 * (1 + rate * 2.2 * m), 2)

        cum_expenses += total_mo_exp
        cum_revenue += rev_mo

        forecast_items.append({
            "month": f"Month {m}",
            "infrastructure_cost": round(infra_cost, 2),
            "maintenance_cost": round(maintenance_cost, 2),
            "cloud_ai_cost": round(cloud_ai_cost, 2),
            "support_cost": round(support_cost, 2),
            "total_monthly_expenses": total_mo_exp,
            "projected_revenue": rev_mo,
            "cumulative_expenses": round(cum_expenses, 2),
            "cumulative_revenue": round(cum_revenue, 2),
            "net_cashflow": round(rev_mo - total_mo_exp, 2)
        })

    return {
        "scenario": growth_scenario,
        "horizon_months": horizon_months,
        "monthly_expense_growth_rate": f"{rate*100:.1f}%",
        "total_forecasted_expenses": round(cum_expenses, 2),
        "total_forecasted_revenue": round(cum_revenue, 2),
        "forecast_timeline": forecast_items
    }
