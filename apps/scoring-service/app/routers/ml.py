# ============================================================================
# MindPolis: scoring-service/app/routers/ml.py
# Version: 1.0.0 — 2026-03-07
# Why: ML inference endpoint — placeholder for future NLP and predictive
#      models. Currently returns a stub response. The architecture and
#      schema are production-ready so ML engineers can plug in real models
#      without changing the API contract.
# Env / Identity: FastAPI  ·  Python 3.11+
# ============================================================================

from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone

from app.models.request import MLPredictRequest
from app.models.response import MLPredictResult

router = APIRouter()

# ─────────────────────────────────────────────
# Model registry — maps model names to loader functions
# Populated when real models are trained and saved to MODEL_DIR
# ─────────────────────────────────────────────
MODEL_REGISTRY: dict = {}


@router.post("/predict", response_model=MLPredictResult)
def ml_predict(payload: MLPredictRequest) -> MLPredictResult:
    """
    ML inference endpoint. Currently a stub — returns a placeholder.
    Future models to integrate:
      - "sentiment-bert":  Political sentiment from open-text responses
      - "consistency-rf":  Detects low-quality / inconsistent response patterns
      - "ideology-lgbm":   Gradient boosted ideology prediction from vectors

    To add a model:
      1. Train and serialize model to apps/scoring-service/models/
      2. Add a loader to MODEL_REGISTRY
      3. Replace the stub below with real inference
    """

    if payload.modelName not in MODEL_REGISTRY and payload.modelName != "default":
        raise HTTPException(
            status_code=404,
            detail=f"ML model '{payload.modelName}' is not registered."
        )

    # Stub response — replace with real inference when models are ready
    return MLPredictResult(
        modelName=payload.modelName,
        prediction="stub-pending-model-training",
        confidence=0.0,
        rawOutput={
            "note": "ML models will be integrated in v2.0",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )
