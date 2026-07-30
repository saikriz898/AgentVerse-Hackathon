import time
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict

class SimpleRateLimiter(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = 120):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.client_requests = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        
        # Clean timestamps older than 60 seconds
        self.client_requests[client_ip] = [
            t for t in self.client_requests[client_ip] if now - t < 60
        ]
        
        if len(self.client_requests[client_ip]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please slow down your requests."
            )
            
        self.client_requests[client_ip].append(now)
        return await call_next(request)
