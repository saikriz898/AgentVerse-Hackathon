import logging
import sys
import json
from datetime import datetime, timezone

class StructuredLogger:
    def __init__(self, name: str = "LifeOS-ReviewAgent"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        if not self.logger.handlers:
            handler = logging.StreamHandler(sys.stdout)
            formatter = logging.Formatter(
                "[%(asctime)s] [%(levelname)s] [%(name)s] - %(message)s"
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def info(self, msg: str, **kwargs):
        extra = f" | {json.dumps(kwargs)}" if kwargs else ""
        self.logger.info(f"{msg}{extra}")

    def warning(self, msg: str, **kwargs):
        extra = f" | {json.dumps(kwargs)}" if kwargs else ""
        self.logger.warning(f"{msg}{extra}")

    def error(self, msg: str, **kwargs):
        extra = f" | {json.dumps(kwargs)}" if kwargs else ""
        self.logger.error(f"{msg}{extra}")

    def debug(self, msg: str, **kwargs):
        extra = f" | {json.dumps(kwargs)}" if kwargs else ""
        self.logger.debug(f"{msg}{extra}")

logger = StructuredLogger()
