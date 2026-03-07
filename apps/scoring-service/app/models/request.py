# ============================================================================
# MindPolis: scoring-service/app/models/request.py
# Version: 1.0.0 — 2026-03-07
# Why: Pydantic request schemas — the contract between Next.js API and
#      this scoring service. Any change here must be mirrored in
#      apps/web/lib/scoring-client.ts (TypeScript side).
# Env / Identity: Pydantic v2  ·  Python 3.11+
# ============================================================================

from pydantic import BaseModel, Field
from typing import Optional


# ─────────────────────────────────────────────
# Individual question response as sent from Next.js
# ─────────────────────────────────────────────
class QuestionResponseInput(BaseModel):
    questionId: str
    value: float          # Normalized numeric value (e.g. 1.0–5.0)
    dimensionKeys: list[str]   # Which scoring dimensions this response affects
    isReversed: bool = False   # Whether to flip the score direction
    weight: float = 1.0        # Dimension weight from ScoringDimension table


# ─────────────────────────────────────────────
# Full scoring request — sent after user completes an assessment
# ─────────────────────────────────────────────
class ScoreRequest(BaseModel):
    assessmentSlug: str                          # e.g. "political-compass"
    assessmentVersion: str = "1.0"
    responses: list[QuestionResponseInput]
    modelVersion: str = Field(default="1.0.0")  # Allows A/B testing of scoring models


# ─────────────────────────────────────────────
# Clustering request — used for population-level analysis
# ─────────────────────────────────────────────
class ClusterRequest(BaseModel):
    resultId: str
    scoreVector: list[float]    # Flat score vector from a prior ScoreRequest
    assessmentSlug: str
    nClusters: Optional[int] = 8  # Default political cluster count


# ─────────────────────────────────────────────
# ML inference request — for future NLP / predictive models
# ─────────────────────────────────────────────
class MLPredictRequest(BaseModel):
    inputType: str              # "text" | "vector"
    textInput: Optional[str]    # For BERT-based open text models
    vectorInput: Optional[list[float]]  # For vector-based models
    modelName: str = "default"
