import hashlib
import hmac
import os

def get_password_hash(password: str) -> str:
    """Hash password securely using PBKDF2-HMAC-SHA256."""
    salt = os.urandom(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return f"pbkdf2_sha256$100000${salt.hex()}${pwd_hash.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against stored PBKDF2 hash string."""
    try:
        parts = hashed_password.split('$')
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            return False
        iterations = int(parts[1])
        salt = bytes.fromhex(parts[2])
        expected_hash = parts[3]
        
        computed = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt, iterations).hex()
        return hmac.compare_digest(computed, expected_hash)
    except Exception:
        return False
