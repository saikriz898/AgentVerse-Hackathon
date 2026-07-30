from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError
from app.utils.logger import logger

def format_error_response(message: str, error_code: str, status_code: int, details: Optional[Dict[str, Any]] = None) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "status": "error",
            "error_code": error_code,
            "message": message,
            "details": details or {},
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
    )

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.warning(f"HTTP Error {exc.status_code} on {request.url.path}: {exc.detail}")
    error_code = "HTTP_ERROR"
    if exc.status_code == status.HTTP_401_UNAUTHORIZED:
        error_code = "UNAUTHORIZED_ACCESS"
    elif exc.status_code == status.HTTP_403_FORBIDDEN:
        error_code = "FORBIDDEN_RESOURCE"
    elif exc.status_code == status.HTTP_404_NOT_FOUND:
        error_code = "RESOURCE_NOT_FOUND"
    elif exc.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY:
        error_code = "VALIDATION_FAILED"

    return format_error_response(str(exc.detail), error_code, exc.status_code)

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation Error on {request.url.path}: {exc.errors()}")
    errors_summary = "; ".join([f"{e.get('loc', [])}: {e.get('msg', '')}" for e in exc.errors()])
    return format_error_response(f"Validation failure: {errors_summary}", "INVALID_REQUEST_SCHEMA", status.HTTP_422_UNPROCESSABLE_ENTITY, details={"errors": exc.errors()})

async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database Exception on {request.url.path}: {str(exc)}")
    return format_error_response("Database transaction failed cleanly.", "DATABASE_ERROR", status.HTTP_500_INTERNAL_SERVER_ERROR)

async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.url.path}: {str(exc)}", exc_info=True)
    return format_error_response("An unexpected server error occurred.", "INTERNAL_SERVER_ERROR", status.HTTP_500_INTERNAL_SERVER_ERROR)
