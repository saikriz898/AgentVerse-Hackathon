import hashlib
import os

try:
    import bcrypt
    def get_password_hash(password: str) -> str:
        pwd_bytes = password[:72].encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(pwd_bytes, salt)
        return hashed.decode('utf-8')

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        try:
            pwd_bytes = plain_password[:72].encode('utf-8')
            hash_bytes = hashed_password.encode('utf-8')
            return bcrypt.checkpw(pwd_bytes, hash_bytes)
        except Exception:
            return False
except ImportError:
    def get_password_hash(password: str) -> str:
        salt = hashlib.sha256(os.urandom(16)).hexdigest()
        pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
        return f"pbkdf2:{salt}:{pwd_hash}"

    def verify_password(plain_password: str, hashed_password: str) -> bool:
        if not hashed_password.startswith("pbkdf2:"):
            return False
        parts = hashed_password.split(":")
        if len(parts) != 3:
            return False
        salt, expected_hash = parts[1], parts[2]
        pwd_hash = hashlib.pbkdf2_hmac('sha256', plain_password.encode('utf-8'), salt.encode('utf-8'), 100000).hex()
        return pwd_hash == expected_hash
