import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
try:
    from sqlalchemy.ext.asyncio import AsyncSession
    from sqlalchemy import select
except ImportError:
    AsyncSession = Any
    select = None

from backend.config.settings import settings
from backend.database.connection import get_db
from backend.models.user import User
from backend.utils.logger import logger

try:
    from fastapi import Depends, HTTPException, status
    from fastapi.security import OAuth2PasswordBearer
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/login", auto_error=False)
except ImportError:
    Depends = lambda x=None: x
    HTTPException = Exception
    status = None
    oauth2_scheme = None

try:
    from jose import jwt, JWTError
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": int(expire.timestamp())})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except JWTError:
            return None
except ImportError:
    import base64
    import hmac
    import json
    import time

    def _b64e(b: bytes) -> str:
        return base64.urlsafe_b64encode(b).decode('utf-8').rstrip('=')

    def _b64d(s: str) -> bytes:
        padding = '=' * (4 - (len(s) % 4))
        return base64.urlsafe_b64decode(s + padding)

    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": int(expire.timestamp())})
        
        header = {"alg": "HS256", "typ": "JWT"}
        h_bytes = _b64e(json.dumps(header).encode('utf-8'))
        p_bytes = _b64e(json.dumps(to_encode).encode('utf-8'))
        sig = hmac.new(settings.SECRET_KEY.encode('utf-8'), f"{h_bytes}.{p_bytes}".encode('utf-8'), 'sha256').digest()
        s_bytes = _b64e(sig)
        return f"{h_bytes}.{p_bytes}.{s_bytes}"

    def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
        try:
            parts = token.split('.')
            if len(parts) != 3:
                return None
            h_bytes, p_bytes, s_bytes = parts
            expected_sig = _b64e(hmac.new(settings.SECRET_KEY.encode('utf-8'), f"{h_bytes}.{p_bytes}".encode('utf-8'), 'sha256').digest())
            if not hmac.compare_digest(s_bytes, expected_sig):
                return None
            payload = json.loads(_b64d(p_bytes).decode('utf-8'))
            if payload.get("exp") and time.time() > payload["exp"]:
                return None
            return payload
        except Exception:
            return None


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    if not token or not db:
        return None
    payload = decode_access_token(token)
    if not payload:
        return None
    user_id_val = payload.get("sub")
    if not user_id_val:
        return None
    
    try:
        req_uuid = uuid.UUID(str(user_id_val))
        result = await db.execute(select(User).where(User.id == req_uuid))
        user = result.scalars().first()
        return user
    except Exception as e:
        logger.warning(f"get_current_user could not fetch user for sub '{user_id_val}': {e}")
        return None
