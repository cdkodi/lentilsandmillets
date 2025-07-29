"""
Logging configuration for AI Article Generation Service
"""

import logging
import sys
from typing import Optional

def setup_logging(level: str = "INFO") -> logging.Logger:
    """Setup application logging"""
    
    # Create logger
    logger = logging.getLogger("ai-article-generation")
    logger.setLevel(getattr(logging, level.upper()))
    
    # Remove existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(getattr(logging, level.upper()))
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(formatter)
    
    # Add handler to logger
    logger.addHandler(console_handler)
    
    return logger

def get_logger(name: str) -> logging.Logger:
    """Get logger instance"""
    return logging.getLogger(f"ai-article-generation.{name}")