# ============================================================================
# MindPolis: scoring-service/app/engines/political_compass.py
# Version: 1.0.0 — 2026-03-07
# Why: Scoring engine for the Political Compass assessment.
#      Computes two primary axes:
#        - Economic Axis:   Left (-1.0) ↔ Right (+1.0)
#        - Social Axis:     Libertarian (-1.0) ↔ Authoritarian (+1.0)
#      Based on the canonical 2-axis political compass model.
# Env / Identity: NumPy  ·  Python 3.11+
# ============================================================================

from app.engines.normalization import normalize_likert, apply_reversal, weighted_dimension_score
from app.models.request import QuestionResponseInput
from app.models.response import DimensionScore


# ─────────────────────────────────────────────
# Interpretation thresholds for each axis
# Returns a human-readable label for a [-1.0, 1.0] score
# ─────────────────────────────────────────────
def _interpret_economic(score: float) -> str:
    if score < -0.6:
        return "Far-Left"
    if score < -0.2:
        return "Center-Left"
    if score <= 0.2:
        return "Centrist"
    if score <= 0.6:
        return "Center-Right"
    return "Far-Right"


def _interpret_social(score: float) -> str:
    if score < -0.6:
        return "Strongly Libertarian"
    if score < -0.2:
        return "Libertarian"
    if score <= 0.2:
        return "Moderate"
    if score <= 0.6:
        return "Authoritarian"
    return "Strongly Authoritarian"


# ─────────────────────────────────────────────
# Main scoring function
# Takes the full list of responses for a Political Compass submission
# Returns two DimensionScore objects
# ─────────────────────────────────────────────
def score_political_compass(
    responses: list[QuestionResponseInput],
) -> list[DimensionScore]:
    """
    Computes Economic and Social axis scores from Political Compass responses.

    Args:
        responses: All question responses for this assessment

    Returns:
        List of two DimensionScore objects (economic + social)
    """

    # Separate responses by dimension
    economic_scores: list[float] = []
    economic_weights: list[float] = []
    social_scores: list[float] = []
    social_weights: list[float] = []

    for r in responses:
        # Normalize from Likert-5 to [-1.0, 1.0]
        norm = normalize_likert(r.value, scale_max=5.0)

        # Apply reverse scoring if flagged
        if r.isReversed:
            norm = apply_reversal(norm)

        # Route to correct dimension bucket
        if "economic_axis" in r.dimensionKeys:
            economic_scores.append(norm)
            economic_weights.append(r.weight)

        if "social_axis" in r.dimensionKeys:
            social_scores.append(norm)
            social_weights.append(r.weight)

    # Compute weighted means
    econ_score = weighted_dimension_score(economic_scores, economic_weights)
    social_score = weighted_dimension_score(social_scores, social_weights)

    return [
        DimensionScore(
            key="economic_axis",
            label="Economic Axis",
            value=round(econ_score, 4),
            rawValue=round(econ_score, 4),
            interpretation=_interpret_economic(econ_score),
        ),
        DimensionScore(
            key="social_axis",
            label="Social Axis",
            value=round(social_score, 4),
            rawValue=round(social_score, 4),
            interpretation=_interpret_social(social_score),
        ),
    ]
