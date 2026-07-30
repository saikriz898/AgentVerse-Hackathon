from fastapi import APIRouter, Query
from app.services.roi_service import roi_service
from typing import Dict, Any

router = APIRouter()

@router.get("/calculate")
def calculate_roi_model(
    dev_investment: float = Query(180000.0, ge=1000.0),
    monthly_operating_cost: float = Query(8500.0, ge=100.0),
    monthly_arpu: float = Query(49.0, ge=1.0),
    target_subscribers: int = Query(1500, ge=10),
    annual_growth_rate: float = Query(0.25, ge=0.0, le=3.0)
) -> Dict[str, Any]:
    return roi_service.calculate_roi(
        dev_investment=dev_investment,
        monthly_operating_cost=monthly_operating_cost,
        monthly_arpu=monthly_arpu,
        target_subscribers=target_subscribers,
        annual_growth_rate=annual_growth_rate
    )
