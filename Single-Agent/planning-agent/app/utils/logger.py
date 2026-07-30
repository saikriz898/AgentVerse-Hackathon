"""Rich logging module for structured, styled console and diagnostics logs."""

import logging
import sys
from rich.console import Console
from rich.logging import RichHandler
from app.config.settings import get_settings

settings = get_settings()

console = Console()

# Configure root logger with RichHandler
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(message)s",
    datefmt="[%X]",
    handlers=[
        RichHandler(
            console=console,
            rich_tracebacks=True,
            tracebacks_show_locals=False,
            show_time=True,
            show_path=False,
        )
    ],
)

logger = logging.getLogger("planning_agent")
logger.setLevel(settings.LOG_LEVEL)
