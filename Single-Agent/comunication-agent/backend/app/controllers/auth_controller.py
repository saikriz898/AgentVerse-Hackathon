from sqlalchemy.ext.asyncio import AsyncSession
from app.services.auth_service import auth_service
from app.schemas.auth_schemas import UserRegister, UserLogin, RefreshTokenRequest, TokenResponse, UserResponse

class AuthController:
    """Controller handling User Authentication endpoints."""

    @staticmethod
    async def register(db: AsyncSession, req: UserRegister) -> UserResponse:
        return await auth_service.register(db, req)

    @staticmethod
    async def login(db: AsyncSession, req: UserLogin) -> TokenResponse:
        return await auth_service.login(db, req)

    @staticmethod
    async def refresh_tokens(db: AsyncSession, req: RefreshTokenRequest) -> TokenResponse:
        return await auth_service.refresh_tokens(db, req.refresh_token)

auth_controller = AuthController()
