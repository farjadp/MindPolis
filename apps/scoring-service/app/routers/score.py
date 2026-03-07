# ============================================================================
# MindPolis: scoring-service/app/routers/score.py
# Version: 1.0.0 — 2026-03-07
# Why: Main scoring router — the primary endpoint called by Next.js API
#      after a user completes an assessment. Routes to the correct engine
#      based on assessmentSlug, then returns a ScoreResult.
# Env / Identity: FastAPI  ·  Python 3.11+
# ============================================================================

from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException

from app.models.request import ScoreRequest
from app.models.response import ScoreResult
from app.engines.political_compass import score_political_compass
from app.engines.moral_foundations import score_moral_foundations

router = APIRouter()

# ─────────────────────────────────────────────
# Registry maps assessment slugs to scoring engine functions
# Adding a new assessment = add one entry here + implement the engine
# ─────────────────────────────────────────────
SCORING_ENGINES = {
    "political-compass": score_political_compass,
    "moral-foundations": score_moral_foundations,
}


@router.post("/", response_model=ScoreResult)
def compute_score(payload: ScoreRequest) -> ScoreResult:
    """
    Main scoring endpoint.
    Called by Next.js API route POST /api/assessments/submit after
    raw responses are persisted to the database.

    Flow:
      1. Validate assessment slug is known
      2. Route to correct scoring engine
      3. Build flat score dict and summary
      4. Return ScoreResult to Next.js for DB persistence
    """

    # Look up the correct engine for this assessment type
    engine = SCORING_ENGINES.get(payload.assessmentSlug)
    if not engine:
        raise HTTPException(
            status_code=422,
            detail=f"No scoring engine registered for assessment: {payload.assessmentSlug}"
        )

    # Run the engine — returns list[DimensionScore]
    dimensions = engine(payload.responses)

    # Build a flat dict for fast DB storage and charting
    scores_flat = {d.key: d.value for d in dimensions}

    # Build a human-readable summary
    summary = {
        "label": _build_summary_label(dimensions),
        "interpretation": [
            f"{d.label}: {d.interpretation}" for d in dimensions
        ],
        "highlights": _extract_highlights(dimensions),
    }

    return ScoreResult(
        assessmentSlug=payload.assessmentSlug,
        modelVersion=payload.modelVersion,
        dimensions=dimensions,
        scoresFlat=scores_flat,
        summary=summary,
        computedAt=datetime.now(timezone.utc).isoformat(),
    )


# ─────────────────────────────────────────────
# Internal helpers
# ─────────────────────────────────────────────

def _build_summary_label(dimensions) -> str:
    """
    Builds a composite human-readable label from dimension interpretations.
    E.g. "Center-Left / Libertarian"
    """
    labels = [d.interpretation for d in dimensions]
    return " / ".join(labels)


def _extract_highlights(dimensions) -> list[str]:
    """
    Extracts the most extreme (highest absolute value) dimensions for
    callout display in the results UI.
    """
    sorted_dims = sorted(dimensions, key=lambda d: abs(d.value), reverse=True)
    return [
        f"Strong {d.interpretation} tendency on {d.label}"
        for d in sorted_dims[:2]  # Top 2 most extreme dimensions
        if abs(d.value) > 0.4     # Only include meaningfully extreme scores
    ]
