from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.controllers.auth_controller import auth_controller
from app.schemas.auth_schemas import UserRegister, UserLogin, RefreshTokenRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
async def register_user(req: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    return await auth_controller.register(db, req)

@router.post("/login", response_model=TokenResponse)
async def login_user(req: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate credentials & return Access/Refresh JWT tokens."""
    return await auth_controller.login(db, req)

@router.post("/refresh", response_model=TokenResponse)
async def refresh_tokens(req: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """Refresh Access Token using valid Refresh Token."""
    return await auth_controller.refresh_tokens(db, req)
