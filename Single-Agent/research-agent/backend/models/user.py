import uuid
from datetime import datetime, timezone

try:
    from sqlalchemy import Column, String, DateTime
    from sqlalchemy.dialects.postgresql import UUID as PG_UUID
    from sqlalchemy.types import TypeDecorator, CHAR
    from backend.database.connection import Base
    
    class GUID(TypeDecorator):
        """Platform-independent GUID type. Uses PostgreSQL's UUID type, otherwise CHAR(36)."""
        impl = CHAR
        cache_ok = True

        def load_dialect_impl(self, dialect):
            if dialect.name == 'postgresql':
                return dialect.type_descriptor(PG_UUID(as_uuid=True))
            else:
                return dialect.type_descriptor(CHAR(36))

        def process_bind_param(self, value, dialect):
            if value is None:
                return value
            elif dialect.name == 'postgresql':
                return str(value)
            else:
                if not isinstance(value, uuid.UUID):
                    try:
                        return str(uuid.UUID(str(value)))
                    except Exception:
                        return str(value)
                else:
                    return str(value)

        def process_result_value(self, value, dialect):
            if value is None:
                return value
            else:
                if not isinstance(value, uuid.UUID):
                    return uuid.UUID(value)
                else:
                    return value

    class User(Base):
        __tablename__ = "users"

        id = Column(GUID(), primary_key=True, default=uuid.uuid4)
        email = Column(String(255), unique=True, nullable=False, index=True)
        password_hash = Column(String(255), nullable=False)
        full_name = Column(String(255), nullable=True)
        created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
        updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
except ImportError:
    class GUID:
        pass
    class User:
        pass

