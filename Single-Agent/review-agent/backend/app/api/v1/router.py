from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.review import router as review_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.rules import router as rules_router
from app.api.v1.logs import router as logs_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(review_router)
api_router.include_router(analytics_router)
api_router.include_router(rules_router)
api_router.include_router(logs_router)
