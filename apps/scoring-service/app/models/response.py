# ============================================================================
# MindPolis: scoring-service/app/models/response.py
# Version: 1.0.0 — 2026-03-07
# Why: Pydantic response schemas returned by this service to Next.js API.
#      These directly map to the `scores` and `summary` JSON columns in
#      the AssessmentResult DB table.
# Env / Identity: Pydantic v2  ·  Python 3.11+
# ============================================================================

from pydantic import BaseModel
from typing import Optional


# ─────────────────────────────────────────────
# A single computed dimension score
# ─────────────────────────────────────────────
class DimensionScore(BaseModel):
    key: str          # "economic_axis"
    label: str        # "Economic Axis"
    value: float      # Normalized score: -1.0 to 1.0
    rawValue: float   # Pre-normalization score
    interpretation: str  # Human-readable: "Center-Left"


# ─────────────────────────────────────────────
# Complete scoring result returned to Next.js
# ─────────────────────────────────────────────
class ScoreResult(BaseModel):
    assessmentSlug: str
    modelVersion: str
    dimensions: list[DimensionScore]
    # Flat dict for fast DB storage: { "economic_axis": -0.32, ... }
    scoresFlat: dict[str, float]
    summary: dict                # { label, interpretation, highlights }
    computedAt: str              # ISO timestamp


# ─────────────────────────────────────────────
# Clustering result
# ─────────────────────────────────────────────
class ClusterResult(BaseModel):
    resultId: str
    clusterLabel: str       # e.g. "Libertarian-Left"
    clusterIndex: int       # Numeric cluster ID
    confidence: float       # 0.0–1.0 — how well the point fits its cluster
    nearestNeighbors: Optional[list[str]] = None  # Future: similar participant IDs


# ─────────────────────────────────────────────
# ML inference result
# ─────────────────────────────────────────────
class MLPredictResult(BaseModel):
    modelName: str
    prediction: str           # Label or value
    confidence: float
    rawOutput: Optional[dict] # Full model output for research logging
