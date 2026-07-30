from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import text
from app.core.config import settings
from app.database.base import Base

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
        # Ensure SQLite table column migration for v2.0 fields
        columns = [
            ("communication_id", "VARCHAR(50)"),
            ("communication_type", "VARCHAR(50)"),
            ("priority", "VARCHAR(20) DEFAULT 'Normal'"),
            ("audience", "VARCHAR(50) DEFAULT 'Manager'"),
            ("tone", "VARCHAR(50) DEFAULT 'Professional'"),
            ("channel", "VARCHAR(50) DEFAULT 'Email'"),
            ("generated_content", "TEXT"),
            ("review_status", "VARCHAR(50) DEFAULT 'VALIDATED'"),
            ("approval_status", "VARCHAR(50) DEFAULT 'pending_approval'"),
            ("delivery_status", "VARCHAR(50) DEFAULT 'pending_approval'"),
            ("created_by", "VARCHAR(100) DEFAULT 'System User'")
        ]
        
        for col_name, col_type in columns:
            try:
                await conn.execute(text(f"ALTER TABLE communications ADD COLUMN {col_name} {col_type};"))
            except Exception:
                pass # Column already exists

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
