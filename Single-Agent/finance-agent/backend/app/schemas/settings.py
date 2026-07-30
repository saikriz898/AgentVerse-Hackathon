from pydantic import BaseModel
from typing import Dict, Any, Optional

class SystemSettingsUpdate(BaseModel):
    currency: Optional[str] = "USD"
    default_dev_hourly_rate: Optional[float] = 85.0
    default_cloud_provider: Optional[str] = "AWS"
    ai_provider: Optional[str] = "OpenAI"
    risk_threshold: Optional[float] = 15.0
    custom_rates: Optional[Dict[str, float]] = None

class SystemSettingsResponse(BaseModel):
    id: str
    currency: str
    default_dev_hourly_rate: float
    default_cloud_provider: str
    ai_provider: str
    api_key_configured: str
    risk_threshold: float
    custom_rates: Dict[str, float]

    class Config:
        from_attributes = True
