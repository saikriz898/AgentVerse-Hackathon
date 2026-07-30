import os
import sys
import logging
from logging.handlers import RotatingFileHandler
from app.config.settings import settings

# Ensure logs directory exists
LOGS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

def setup_logger(name: str = "communication_agent", log_filename: str = "app.log") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        level_str = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
        logger.setLevel(level_str)
        
        # Console Formatter
        console_handler = logging.StreamHandler(sys.stdout)
        console_formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        console_handler.setFormatter(console_formatter)
        logger.addHandler(console_handler)

        # Rotating File Handler (10MB per file, max 5 backups)
        file_path = os.path.join(LOGS_DIR, log_filename)
        file_handler = RotatingFileHandler(file_path, maxBytes=10*1024*1024, backupCount=5, encoding="utf-8")
        file_formatter = logging.Formatter(
            '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "module": "%(name)s", "message": "%(message)s"}',
            datefmt="%Y-%m-%dT%H:%M:%SZ"
        )
        file_handler.setFormatter(file_formatter)
        logger.addHandler(file_handler)

        # Error File Handler (logs errors to error.log specifically)
        if log_filename != "error.log":
            error_file_path = os.path.join(LOGS_DIR, "error.log")
            error_handler = RotatingFileHandler(error_file_path, maxBytes=10*1024*1024, backupCount=5, encoding="utf-8")
            error_handler.setLevel(logging.ERROR)
            error_handler.setFormatter(file_formatter)
            logger.addHandler(error_handler)

    return logger

def get_logger(name: str = "communication_agent") -> logging.Logger:
    return setup_logger(name, "app.log")

logger = setup_logger("communication_agent", "app.log")
auth_logger = setup_logger("communication_agent.auth", "auth.log")
gemini_logger = setup_logger("communication_agent.gemini", "gemini.log")
db_logger = setup_logger("communication_agent.db", "db.log")
