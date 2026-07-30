from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.settings import SystemSettings
from app.schemas.settings import SystemSettingsResponse, SystemSettingsUpdate

router = APIRouter()

@router.get("/", response_model=SystemSettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(SystemSettings).filter(SystemSettings.id == "default").first()
    if not settings:
        settings = SystemSettings(
            id="default",
            currency="USD",
            default_dev_hourly_rate=85.0,
            default_cloud_provider="AWS",
            ai_provider="OpenAI",
            api_key_configured="No",
            risk_threshold=15.0,
            custom_rates={"Frontend": 85.0, "Backend": 95.0, "DevOps": 110.0, "AI Architect": 125.0}
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.put("/", response_model=SystemSettingsResponse)
def update_settings(update_data: SystemSettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(SystemSettings).filter(SystemSettings.id == "default").first()
    if not settings:
        settings = SystemSettings(id="default")
        db.add(settings)

    if update_data.currency:
        settings.currency = update_data.currency
    if update_data.default_dev_hourly_rate:
        settings.default_dev_hourly_rate = update_data.default_dev_hourly_rate
    if update_data.default_cloud_provider:
        settings.default_cloud_provider = update_data.default_cloud_provider
    if update_data.ai_provider:
        settings.ai_provider = update_data.ai_provider
    if update_data.risk_threshold:
        settings.risk_threshold = update_data.risk_threshold
    if update_data.custom_rates:
        settings.custom_rates = update_data.custom_rates

    db.commit()
    db.refresh(settings)
    return settings
