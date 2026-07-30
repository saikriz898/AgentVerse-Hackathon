from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.authentication.password import get_password_hash

class UserRepository:
    """Repository handling Database persistence for Users."""

    @staticmethod
    async def get_by_username(db: AsyncSession, username: str) -> Optional[User]:
        res = await db.execute(select(User).where(User.username == username))
        return res.scalar_one_or_none()

    @staticmethod
    async def get_by_email(db: AsyncSession, email: str) -> Optional[User]:
        res = await db.execute(select(User).where(User.email == email))
        return res.scalar_one_or_none()

    @staticmethod
    async def create_user(db: AsyncSession, username: str, email: str, password: str, role: str = "user") -> User:
        hashed_pwd = get_password_hash(password)
        user = User(
            username=username,
            email=email,
            hashed_password=hashed_pwd,
            role=role
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

user_repository = UserRepository()
