import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select
from backend.database.connection import engine, Base, AsyncSessionLocal
from backend.config.settings import settings
from backend.models.user import User
from backend.models.research import ResearchRequest, ResearchResult, ResearchSource, ResearchCache, AgentLog
from backend.authentication.security import get_password_hash
from backend.utils.logger import logger

async def init_db():
    current_engine = engine
    current_sessionmaker = AsyncSessionLocal

    try:
        async with current_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        logger.warning(f"PostgreSQL connection failed ({e}). Falling back to SQLite DB engine.")
        sqlite_engine = create_async_engine(settings.SQLITE_FALLBACK_URL, echo=False, future=True)
        async with sqlite_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        current_sessionmaker = async_sessionmaker(bind=sqlite_engine, class_=AsyncSession, expire_on_commit=False)

    # Seed default user if not exists
    try:
        async with current_sessionmaker() as session:
            result = await session.execute(select(User).where(User.email == "researcher@lifeos.ai"))
            user = result.scalars().first()
            if not user:
                default_user = User(
                    email="researcher@lifeos.ai",
                    password_hash=get_password_hash("LifeOS2026!"),
                    full_name="Lead Research Specialist"
                )
                session.add(default_user)
                await session.commit()
                logger.info("Initialized database and seeded default user (researcher@lifeos.ai).")
            else:
                logger.info("Database initialized. Seed user researcher@lifeos.ai already exists.")
    except Exception as err:
        logger.warning(f"Seed user setup warning: {err}")

if __name__ == "__main__":
    asyncio.run(init_db())
