# ============================================================================
# MindPolis: scoring-service/app/main.py
# Version: 1.0.0 — 2026-03-07
# Why: FastAPI entrypoint for the Python scoring microservice.
#      This service is the ONLY place mathematical scoring logic lives.
#      It is intentionally isolated from the Next.js layer for clean separation.
# Env / Identity: Python 3.11+  ·  FastAPI  ·  Docker container
# ============================================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import score, cluster, ml

# ─────────────────────────────────────────────
# App initialization
# ─────────────────────────────────────────────
app = FastAPI(
    title="MindPolis Scoring Service",
    version="1.0.0",
    description="Internal microservice for political cognition scoring and ML inference.",
    # Disable docs in production — this service is not public-facing
    docs_url="/docs" if settings.ENV == "development" else None,
    redoc_url=None,
)

# ─────────────────────────────────────────────
# CORS: only allow Next.js API server to call this service
# ─────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_methods=["POST", "GET"],
    allow_headers=["Authorization", "Content-Type"],
)

# ─────────────────────────────────────────────
# Router registration
# ─────────────────────────────────────────────
app.include_router(score.router, prefix="/score", tags=["Scoring"])
app.include_router(cluster.router, prefix="/cluster", tags=["Clustering"])
app.include_router(ml.router, prefix="/ml", tags=["ML Inference"])


# ─────────────────────────────────────────────
# Health check — used by Docker and Next.js before sending payloads
# ─────────────────────────────────────────────
@app.get("/health")
def health_check():
    """Simple health probe for load balancers and CI checks."""
    return {"status": "ok", "service": "mindpolis-scoring", "version": "1.0.0"}
