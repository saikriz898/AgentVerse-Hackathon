"""Helper utility module providing timers and unique ID generators."""

import time
import uuid
from typing import Generator
from contextlib import contextmanager
from app.utils.logger import logger


@contextmanager
def ExecutionTimer(stage_name: str) -> Generator[dict, None, None]:
    """Context manager to measure and log execution duration for stages."""
    start_time = time.perf_counter()
    metrics = {"duration": 0.0}
    try:
        yield metrics
    finally:
        end_time = time.perf_counter()
        elapsed = end_time - start_time
        metrics["duration"] = elapsed
        logger.info(f"⏱️ Stage [{stage_name}] completed in {elapsed:.3f} seconds.")


def generate_short_id(prefix: str = "ID") -> str:
    """Generate a short unique identifier."""
    return f"{prefix}-{uuid.uuid4().hex[:6].upper()}"
