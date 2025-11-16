from fastapi import Request
from fastapi.security.utils import get_authorization_scheme_param
from starlette.middleware.base import BaseHTTPMiddleware

class JWTAuthMiddleware(BaseHTTPMiddleware):
    """
    Middleware to handle JWT authentication for protected routes
    """
    
    def __init__(self, app, exclude_paths: list[str] | None = None):
        super().__init__(app)
        self.exclude_paths = exclude_paths or [
            "/docs", "/redoc", "/openapi.json", 
            "/api/auth/login", "/api/auth/register",
            "/", "/health", "/static"
        ]
    
    async def dispatch(self, request: Request, call_next):
        # Skip authentication for excluded paths
        if any(request.url.path.startswith(path) for path in self.exclude_paths):
            response = await call_next(request)
            return response
        
        # Get authorization header
        authorization: str | None = request.headers.get("Authorization")
        
        if not authorization:
            # Allow request to continue, let individual endpoints handle auth
            response = await call_next(request)
            return response
            
        scheme, token = get_authorization_scheme_param(authorization)
        
        if scheme.lower() != "bearer":
            # Allow request to continue, let individual endpoints handle auth
            response = await call_next(request)
            return response
        
        try:
            # Import here to avoid circular imports
            from services.auth.auth_service import AuthService
            # Verify token (this will raise exception if invalid)
            AuthService.verify_token(token)
            response = await call_next(request)
            return response
        except Exception:
            # Let the request continue, individual endpoints will handle invalid tokens
            response = await call_next(request)
            return response

class CORSMiddleware(BaseHTTPMiddleware):
    """
    Custom CORS middleware with additional security headers
    """
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        return response