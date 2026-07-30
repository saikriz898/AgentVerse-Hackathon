from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import user_repository
from app.authentication.password import verify_password
from app.authentication.jwt import create_access_token, create_refresh_token, decode_token
from app.schemas.auth_schemas import UserRegister, UserLogin, TokenResponse, UserResponse

class AuthService:
    """Business Service managing Authentication."""

    @staticmethod
    async def register(db: AsyncSession, req: UserRegister) -> UserResponse:
        existing_user = await user_repository.get_by_username(db, req.username)
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists.")

        existing_email = await user_repository.get_by_email(db, req.email)
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered.")

        user = await user_repository.create_user(
            db=db,
            username=req.username,
            email=req.email,
            password=req.password,
            role=req.role or "user"
        )
        return UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            role=user.role,
            is_active=user.is_active,
            created_at=user.created_at
        )

    @staticmethod
    async def login(db: AsyncSession, req: UserLogin) -> TokenResponse:
        user = await user_repository.get_by_username(db, req.username)
        if not user or not verify_password(req.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password."
            )

        if not user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user account.")

        access_token = create_access_token({"sub": user.id, "username": user.username, "role": user.role})
        refresh_token = create_refresh_token({"sub": user.id, "username": user.username})

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )

    @staticmethod
    async def refresh_tokens(db: AsyncSession, refresh_token: str) -> TokenResponse:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token.")

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token subject.")

        user = await user_repository.get_by_username(db, payload.get("username", ""))
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User account disabled or not found.")

        new_access = create_access_token({"sub": user.id, "username": user.username, "role": user.role})
        new_refresh = create_refresh_token({"sub": user.id, "username": user.username})

        return TokenResponse(access_token=new_access, refresh_token=new_refresh)

auth_service = AuthService()
