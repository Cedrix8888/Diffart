"""
Dependency injection utilities for FastAPI application
Provides database sessions, authentication, and other common dependencies
"""

from typing import Generator, Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import SQLAlchemyError
import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from datetime import datetime, timezone

from models.db_models import Base, User
from utils.security import get_api_key
from config import DATABASE_URL, SECRET_KEY, ALGORITHM

# Database setup
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=False  # Set to True for SQL debugging
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Security setup
security = HTTPBearer(auto_error=False)

def create_tables():
    """
    Create all database tables
    Called during application startup
    """
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise

# core dependency
def get_db() -> Generator[Session, None, None]:
    """
    Dependency for getting database session
    Automatically handles session cleanup
    """
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    finally:
        db.close()

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency for getting current authenticated user
    Validates JWT token and returns user object
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user: User | None = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )

    return user

def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Dependency for optionally getting current user
    Returns None if no valid token is provided
    """
    if not credentials:
        return None
    
    try:
        return get_current_user(credentials, db)
    except HTTPException:
        return None

def get_active_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency that ensures user is active
    """
    if current_user.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )
    return current_user

def require_api_key(api_key: str = Depends(get_api_key)) -> str:
    """
    Dependency that requires valid API key
    """
    return api_key

def get_client_ip(request: Request) -> str:
    """
    Dependency for getting client IP address
    Handles proxy headers
    """
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    return request.client.host if request.client else "unknown"

def get_user_agent(request: Request) -> str:
    """
    Dependency for getting user agent string
    """
    return request.headers.get("User-Agent", "Unknown")

class RateLimitDependency:
    """
    Rate limiting dependency
    Can be extended with Redis or other storage backends
    """
    def __init__(self, calls: int, period: int):
        self.calls = calls
        self.period = period
        self._requests = {}

    def __call__(self, client_ip: str = Depends(get_client_ip)):
        now = datetime.now(timezone.utc).timestamp()
        
        if client_ip not in self._requests:
            self._requests[client_ip] = []
        
        # Clean old requests
        self._requests[client_ip] = [
            req_time for req_time in self._requests[client_ip]
            if now - req_time < self.period
        ]
        
        if len(self._requests[client_ip]) >= self.calls:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded: {self.calls} calls per {self.period} seconds"
            )
        
        self._requests[client_ip].append(now)
        return True

# Common rate limiters
rate_limit_strict = RateLimitDependency(calls=5, period=60)  # 5 calls per minute
rate_limit_moderate = RateLimitDependency(calls=20, period=60)  # 20 calls per minute
rate_limit_relaxed = RateLimitDependency(calls=100, period=60)  # 100 calls per minute

def validate_content_type(
    request: Request,
    allowed_types: list = ["application/json"]
) -> bool:
    """
    Dependency to validate request content type
    """
    content_type = request.headers.get("content-type", "").lower()
    
    if not any(allowed_type in content_type for allowed_type in allowed_types):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Content type must be one of: {', '.join(allowed_types)}"
        )
    
    return True

def get_pagination_params(
    page: int = 1,
    limit: int = 20,
    max_limit: int = 100
) -> dict:
    """
    Dependency for pagination parameters
    """
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page number must be greater than 0"
        )
    
    if limit < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Limit must be greater than 0"
        )
    
    if limit > max_limit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Limit cannot exceed {max_limit}"
        )
    
    offset = (page - 1) * limit
    
    return {
        "page": page,
        "limit": limit,
        "offset": offset
    }

# Health check dependencies
def check_database_health(db: Session = Depends(get_db)) -> bool:
    """
    Dependency to check database connectivity
    """
    try:
        # Simple query to test connection
        db.execute(text("SELECT 1"))
        return True
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is unavailable"
        )

def check_disk_space(min_free_gb: float = 1.0) -> bool:
    """
    Dependency to check available disk space
    """
    try:
        import shutil
        free_bytes = shutil.disk_usage('.').free
        free_gb = free_bytes / (1024 ** 3)
        
        if free_gb < min_free_gb:
            raise HTTPException(
                status_code=status.HTTP_507_INSUFFICIENT_STORAGE,
                detail=f"Insufficient disk space: {free_gb:.2f}GB available, {min_free_gb}GB required"
            )
        return True
    except Exception as e:
        if isinstance(e, HTTPException):
            raise
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to check disk space"
        )