from fastapi import APIRouter
from app.routes import auth_routes, communication_routes, queue_routes
from app.api.endpoints import health, templates

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth_routes.router)
api_router.include_router(communication_routes.router)
api_router.include_router(queue_routes.router)
api_router.include_router(templates.router)
