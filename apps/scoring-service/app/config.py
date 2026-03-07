# ============================================================================
# MindPolis: scoring-service/app/config.py
# Version: 1.0.0 — 2026-03-07
# Why: Centralized configuration for the Python scoring microservice.
#      Reads from environment variables — never hardcode secrets here.
# Env / Identity: Python 3.11+  ·  pydantic-settings
# ============================================================================

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENV: str = "development"

    # Only allow requests from the Next.js API server
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    # Internal secret shared between Next.js API and this service
    # Next.js sends this in the Authorization header on every request
    INTERNAL_API_SECRET: str = "change-me-in-production"

    # ML model directory (for future scikit-learn / torch model loading)
    MODEL_DIR: str = "./models"

    class Config:
        env_file = ".env"


# Singleton instance used across all modules
settings = Settings()
