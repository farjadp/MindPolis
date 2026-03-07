# ============================================================================
# MindPolis: scoring-service/app/routers/cluster.py
# Version: 1.0.0 — 2026-03-07
# Why: Ideological clustering endpoint — groups participants into political
#      archetypes using K-means on their score vectors.
#      Initially uses a static label map; future versions will use a trained
#      scikit-learn model loaded from disk.
# Env / Identity: FastAPI  ·  scikit-learn  ·  NumPy  ·  Python 3.11+
# ============================================================================

import numpy as np
from fastapi import APIRouter, HTTPException

from app.models.request import ClusterRequest
from app.models.response import ClusterResult

router = APIRouter()

# ─────────────────────────────────────────────
# Static cluster label map for 8-cluster political compass model
# Index → human-readable archetype label
# This will be replaced by a trained KMeans centroid model in v2
# ─────────────────────────────────────────────
CLUSTER_LABELS = {
    0: "Libertarian-Left",
    1: "Progressive",
    2: "Liberal-Center",
    3: "Centrist",
    4: "Conservative",
    5: "Libertarian-Right",
    6: "Authoritarian-Right",
    7: "Authoritarian-Left",
}

# Placeholder centroids for 2D political compass (economic, social)
# These will be learned from real user data in production
CENTROIDS = np.array([
    [-0.7, -0.7],   # 0: Libertarian-Left
    [-0.6, -0.3],   # 1: Progressive
    [-0.2, -0.4],   # 2: Liberal-Center
    [0.0,  0.0],    # 3: Centrist
    [0.5,  0.4],    # 4: Conservative
    [0.6, -0.5],    # 5: Libertarian-Right
    [0.7,  0.7],    # 6: Authoritarian-Right
    [-0.5, 0.6],    # 7: Authoritarian-Left
], dtype=np.float64)


@router.post("/", response_model=ClusterResult)
def assign_cluster(payload: ClusterRequest) -> ClusterResult:
    """
    Assigns a participant to a political archetype cluster based on their
    score vector. Uses Euclidean distance to the nearest centroid.

    Expects exactly 2 values in scoreVector: [economic, social].
    Future: accepts N-dimensional vectors for multi-assessment clustering.
    """

    if len(payload.scoreVector) < 2:
        raise HTTPException(
            status_code=422,
            detail="scoreVector must contain at least 2 values (economic, social)"
        )

    # Use first two dimensions (economic, social) for compass clustering
    point = np.array(payload.scoreVector[:2], dtype=np.float64)

    # Compute Euclidean distances to all centroids
    distances = np.linalg.norm(CENTROIDS - point, axis=1)

    # Find nearest centroid
    cluster_index = int(np.argmin(distances))
    cluster_label = CLUSTER_LABELS.get(cluster_index, "Unknown")

    # Confidence = inverse of normalized distance (closer = higher confidence)
    min_dist = float(distances[cluster_index])
    max_possible_dist = float(np.sqrt(8))  # Max distance in [-1,1]^2 space
    confidence = round(1.0 - (min_dist / max_possible_dist), 4)

    return ClusterResult(
        resultId=payload.resultId,
        clusterLabel=cluster_label,
        clusterIndex=cluster_index,
        confidence=max(0.0, confidence),
    )
