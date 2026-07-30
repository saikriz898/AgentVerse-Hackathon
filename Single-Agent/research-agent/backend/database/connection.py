import os
import sys
from typing import AsyncGenerator, Any
from backend.config.settings import settings
from backend.utils.logger import logger

try:
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
    from sqlalchemy.orm import declarative_base
    Base = declarative_base()
except ImportError:
    create_async_engine = None
    AsyncSession = Any
    async_sessionmaker = None
    class Base:
        metadata = None

engine = None
AsyncSessionLocal = None

if create_async_engine:
    database_url = getattr(settings, "DATABASE_URL", settings.SQLITE_FALLBACK_URL)
    
    try:
        if "postgresql" in database_url:
            if database_url.startswith("postgresql://"):
                database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
            
            engine = create_async_engine(
                database_url,
                echo=False,
                future=True,
                pool_pre_ping=True
            )
        else:
            engine = create_async_engine(settings.SQLITE_FALLBACK_URL, echo=False, future=True)
    except Exception as e:
        logger.warning(f"Database engine init warning ({e}). Falling back to SQLite.")
        engine = create_async_engine(settings.SQLITE_FALLBACK_URL, echo=False, future=True)

    AsyncSessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autocommit=False,
        autoflush=False
    )

async def get_db() -> AsyncGenerator[Any, None]:
    if not AsyncSessionLocal:
        yield None
        return
    async with AsyncSessionLocal() as session:
        try:
            yield session
            try:
                await session.commit()
            except Exception as commit_err:
                logger.warning(f"Database session commit notice: {commit_err}")
                await session.rollback()
        except Exception as e:
            await session.rollback()
            logger.warning(f"Database session exception: {e}")
        finally:
            await session.close()
