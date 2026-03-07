# ============================================================================
# MindPolis: scoring-service/app/engines/moral_foundations.py
# Version: 1.0.0 — 2026-03-07
# Why: Scoring engine for the Moral Foundations Theory (MFT) assessment.
#      Implements Haidt's six moral foundations:
#        Care/Harm · Fairness/Reciprocity · Loyalty/Betrayal
#        Authority/Subversion · Sanctity/Degradation · Liberty/Oppression
#      Scores each foundation from 0.0 (low) to 1.0 (high).
# Env / Identity: NumPy  ·  Python 3.11+
# ============================================================================

from app.engines.normalization import normalize_likert, apply_reversal, weighted_dimension_score
from app.models.request import QuestionResponseInput
from app.models.response import DimensionScore

# ─────────────────────────────────────────────
# The six MFT foundations and their axis keys
# These must match the dimensionKeys stored in the Question DB records
# ─────────────────────────────────────────────
MFT_FOUNDATIONS = {
    "mft_care":       "Care / Harm",
    "mft_fairness":   "Fairness / Reciprocity",
    "mft_loyalty":    "Loyalty / Betrayal",
    "mft_authority":  "Authority / Subversion",
    "mft_sanctity":   "Sanctity / Degradation",
    "mft_liberty":    "Liberty / Oppression",
}


def _interpret_mft(score: float) -> str:
    """Returns a verbal intensity label for a 0.0–1.0 MFT foundation score."""
    if score < 0.25:
        return "Very Low"
    if score < 0.45:
        return "Low"
    if score < 0.60:
        return "Moderate"
    if score < 0.80:
        return "High"
    return "Very High"


def score_moral_foundations(
    responses: list[QuestionResponseInput],
) -> list[DimensionScore]:
    """
    Scores all six Moral Foundations from MFT assessment responses.
    MFT scores are in [0.0, 1.0] — higher = stronger endorsement of that foundation.

    Args:
        responses: All question responses for this MFT assessment

    Returns:
        List of six DimensionScore objects, one per foundation
    """

    # Bucket scores by foundation key
    buckets: dict[str, tuple[list[float], list[float]]] = {
        key: ([], []) for key in MFT_FOUNDATIONS
    }

    for r in responses:
        # MFT uses Likert-6 in the original MFQ, but we support 5 here
        norm = normalize_likert(r.value, scale_max=5.0)

        if r.isReversed:
            norm = apply_reversal(norm)

        for key in r.dimensionKeys:
            if key in buckets:
                buckets[key][0].append(norm)
                buckets[key][1].append(r.weight)

    results: list[DimensionScore] = []

    for key, label in MFT_FOUNDATIONS.items():
        scores, weights = buckets[key]
        raw = weighted_dimension_score(scores, weights)

        # Convert from [-1.0, 1.0] → [0.0, 1.0] for MFT representation
        mapped = (raw + 1.0) / 2.0

        results.append(DimensionScore(
            key=key,
            label=label,
            value=round(mapped, 4),
            rawValue=round(raw, 4),
            interpretation=_interpret_mft(mapped),
        ))

    return results
