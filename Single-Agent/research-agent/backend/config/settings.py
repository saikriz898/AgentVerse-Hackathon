import os
from typing import Optional

try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        class BaseSettings:
            def __init__(self, **data):
                for k, v in data.items():
                    setattr(self, k, v)

# Compute absolute SQLite database path
_db_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../lifeos_research.db')).replace('\\', '/')
_default_sqlite_url = f"sqlite+aiosqlite:///{_db_dir}"

class Settings(BaseSettings):
    APP_NAME: str = "LifeOS Research Agent"
    ROLE: str = "AI Research Specialist"
    VERSION: str = "1.0.0"
    ENV: str = "development"
    DEBUG: bool = True
    API_PREFIX: str = "/api"
    
    # Database (Default to SQLite for zero-config local runs, overridden by ENV in Docker)
    DATABASE_URL: str = os.getenv("DATABASE_URL", _default_sqlite_url)
    SQLITE_FALLBACK_URL: str = _default_sqlite_url
    
    # JWT Authentication
    SECRET_KEY: str = os.getenv("SECRET_KEY", "lifeos_research_agent_super_secret_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # External APIs
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    TAVILY_API_KEY: Optional[str] = os.getenv("TAVILY_API_KEY", None)
    
    # Inter-agent endpoints
    MEMORY_AGENT_URL: str = os.getenv("MEMORY_AGENT_URL", "http://localhost:8001/api/memory")
    CHIEF_OF_STAFF_URL: str = os.getenv("CHIEF_OF_STAFF_URL", "http://localhost:8000/api/agent")
    
    # Redis Caching
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CACHE_EXPIRE_SECONDS: int = 3600 * 12  # 12 hours
    
    # Scraping & Search Configuration
    MAX_SEARCH_RESULTS: int = 8
    HTTP_TIMEOUT_SECONDS: float = 15.0
    TAVILY_MAX_RETRIES: int = 3
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
