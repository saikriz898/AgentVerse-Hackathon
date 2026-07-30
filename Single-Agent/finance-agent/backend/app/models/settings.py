import datetime
from sqlalchemy import Column, String, Float, DateTime, JSON
from app.database.session import Base

class SystemSettings(Base):
    __tablename__ = "system_settings"

    id = Column(String, primary_key=True, default="default")
    currency = Column(String, default="USD") # USD, EUR, GBP, INR
    default_dev_hourly_rate = Column(Float, default=85.0)
    default_cloud_provider = Column(String, default="AWS")
    ai_provider = Column(String, default="OpenAI")
    api_key_configured = Column(String, default="No")
    risk_threshold = Column(Float, default=15.0) # Percentage tolerance
    custom_rates = Column(JSON, default=dict)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
