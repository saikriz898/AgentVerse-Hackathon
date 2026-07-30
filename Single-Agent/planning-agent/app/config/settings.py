"""Application settings and configuration loader."""

from functools import lru_cache
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration settings loaded from environment variables or .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "AI Planning Agent"
    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # OpenAI LLM Settings
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL_NAME: str = "gpt-4o"
    OPENAI_TEMPERATURE: float = 0.2
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
