import time
from collections import defaultdict
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from datetime import datetime

class RateLimitingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = 120):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.client_requests = defaultdict(list)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint):
        client_ip = request.client.host if request.client else "127.0.0.1"
        now = time.time()
        
        # Clean request timestamps older than 60s
        self.client_requests[client_ip] = [
            t for t in self.client_requests[client_ip] if now - t < 60
        ]

        if len(self.client_requests[client_ip]) >= self.requests_per_minute:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "status": "error",
                    "message": "Rate limit exceeded. Maximum 120 requests per minute allowed.",
                    "error_code": "RATE_LIMIT_EXCEEDED",
                    "timestamp": datetime.utcnow().isoformat() + "Z"
                }
            )

        self.client_requests[client_ip].append(now)
        response = await call_next(request)
        return response
