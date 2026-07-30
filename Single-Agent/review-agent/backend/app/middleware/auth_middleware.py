from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.core.security import decode_access_token
from app.repositories.user_repo import UserRepository
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """Dependency to get current authenticated user. Returns None if unauthenticated (allows public demo execution)."""
    if not token:
        return None

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        return None

    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id)
    return user

async def get_required_user(
    user: Optional[User] = Depends(get_current_user)
) -> User:
    """Dependency to enforce authenticated user presence."""
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to access this resource",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
