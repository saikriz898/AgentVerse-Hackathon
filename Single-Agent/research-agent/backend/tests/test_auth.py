import pytest
from backend.authentication.security import get_password_hash, verify_password
from backend.authentication.jwt_handler import create_access_token, decode_access_token

def test_password_hashing():
    raw_pass = "LifeOS2026_Secure!"
    hashed = get_password_hash(raw_pass)
    assert hashed != raw_pass
    assert verify_password(raw_pass, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_lifecycle():
    data = {"sub": "12345678-1234-1234-1234-1234567890ab", "email": "test@lifeos.ai"}
    token = create_access_token(data)
    assert isinstance(token, str)
    
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == data["sub"]
    assert decoded["email"] == data["email"]
