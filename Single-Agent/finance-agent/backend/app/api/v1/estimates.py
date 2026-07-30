from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.estimate import EstimationRequest, EstimationResponse
from app.services.estimation_service import estimation_service
from app.models.settings import SystemSettings
from typing import List

router = APIRouter()

@router.post("/generate", response_model=EstimationResponse)
def generate_project_estimate(request: EstimationRequest, db: Session = Depends(get_db)):
    settings = db.query(SystemSettings).filter(SystemSettings.id == "default").first()
    hourly_rate = settings.default_dev_hourly_rate if settings else 85.0
    estimate = estimation_service.create_estimate(db, request, hourly_rate=hourly_rate)
    return estimate

@router.get("/", response_model=List[EstimationResponse])
def list_estimates(limit: int = Query(10, ge=1, le=50), db: Session = Depends(get_db)):
    estimates = estimation_service.get_estimates(db, limit=limit)
    return estimates

@router.get("/{estimate_id}", response_model=EstimationResponse)
def get_estimate(estimate_id: str, db: Session = Depends(get_db)):
    estimate = estimation_service.get_estimate_by_id(db, estimate_id)
    if not estimate:
        raise HTTPException(status_code=404, detail="Estimate not found")
    return estimate
