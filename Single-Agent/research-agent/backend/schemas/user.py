from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

try:
    from pydantic import EmailStr
except ImportError:
    EmailStr = str

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: UUID
    email: str
    full_name: Optional[str] = None

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
