# ============================================================================
# MindPolis: scoring-service/app/engines/normalization.py
# Version: 1.0.0 — 2026-03-07
# Why: Core math utilities for normalizing and transforming raw Likert scores
#      into the [-1.0, 1.0] range used across all scoring engines.
#      All scoring engines depend on this module — it is the foundation.
# Env / Identity: NumPy  ·  SciPy  ·  Python 3.11+
# ============================================================================

import numpy as np
from scipy.stats import zscore


# ─────────────────────────────────────────────
# Likert scale normalization
# Maps a Likert response to [-1.0, 1.0]
# e.g. Likert-5: 1→-1.0, 3→0.0, 5→1.0
# ─────────────────────────────────────────────
def normalize_likert(value: float, scale_max: float = 5.0) -> float:
    """
    Normalizes a Likert score to the [-1.0, 1.0] range.

    Args:
        value:     Raw Likert response (e.g. 1.0 to 5.0)
        scale_max: Maximum scale value (5 for Likert-5, 7 for Likert-7)

    Returns:
        Float in range [-1.0, 1.0]
    """
    scale_min = 1.0
    midpoint = (scale_max + scale_min) / 2
    half_range = (scale_max - scale_min) / 2
    return (value - midpoint) / half_range


# ─────────────────────────────────────────────
# Reverse scoring — for negatively-keyed items
# e.g. "I distrust government" reverse-keyed on authoritarianism dimension
# ─────────────────────────────────────────────
def apply_reversal(normalized: float) -> float:
    """Flips a normalized score: 0.8 → -0.8"""
    return -normalized


# ─────────────────────────────────────────────
# Weighted mean across a dimension's responses
# ─────────────────────────────────────────────
def weighted_dimension_score(scores: list[float], weights: list[float]) -> float:
    """
    Computes the weighted mean of a set of normalized scores for one dimension.

    Args:
        scores:  List of normalized float scores
        weights: Corresponding weights for each score

    Returns:
        Weighted mean clipped to [-1.0, 1.0]
    """
    if not scores:
        return 0.0

    score_array = np.array(scores, dtype=np.float64)
    weight_array = np.array(weights, dtype=np.float64)

    # Protect against zero-weight edge case
    if weight_array.sum() == 0:
        return float(np.mean(score_array))

    result = np.average(score_array, weights=weight_array)
    # Clip to valid range — rounding errors can push slightly outside [-1, 1]
    return float(np.clip(result, -1.0, 1.0))


# ─────────────────────────────────────────────
# Z-score normalization for population-relative percentiles
# Used when computing how a user's score compares to all other users
# ─────────────────────────────────────────────
def population_zscore(score: float, population_scores: list[float]) -> float:
    """
    Returns the z-score of a single participant against a population.
    Used for percentile rank computation (future: stored in percentiles column).
    """
    if len(population_scores) < 2:
        return 0.0
    pop_array = np.array(population_scores, dtype=np.float64)
    mean = np.mean(pop_array)
    std = np.std(pop_array)
    if std == 0:
        return 0.0
    return float((score - mean) / std)
