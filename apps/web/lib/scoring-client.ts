// ============================================================================
// MindPolis: apps/web/lib/scoring-client.ts
// Version: 1.0.0 — 2026-03-07
// Why: HTTP client that calls the Python scoring microservice from
//      Next.js API routes. This is the ONLY file in the Node layer
//      that communicates with the Python service — keeps the integration
//      point centralized and easy to mock/test.
// Env / Identity: Node.js server-side only (never imported on client)
// ============================================================================

import { env } from "@/lib/env"

// ─────────────────────────────────────────────
// Types mirroring Python Pydantic models
// Keep in sync with apps/scoring-service/app/models/
// ─────────────────────────────────────────────
export interface QuestionResponseInput {
  questionId: string
  value: number
  dimensionKeys: string[]
  isReversed: boolean
  weight: number
}

export interface ScoreRequest {
  assessmentSlug: string
  assessmentVersion: string
  responses: QuestionResponseInput[]
  modelVersion?: string
}

export interface DimensionScore {
  key: string
  label: string
  value: number       // [-1.0, 1.0]
  rawValue: number
  interpretation: string
}

export interface ScoreResult {
  assessmentSlug: string
  modelVersion: string
  dimensions: DimensionScore[]
  scoresFlat: Record<string, number>
  summary: {
    label: string
    interpretation: string[]
    highlights: string[]
  }
  computedAt: string
}

export interface ClusterRequest {
  resultId: string
  scoreVector: number[]
  assessmentSlug: string
  nClusters?: number
}

export interface ClusterResult {
  resultId: string
  clusterLabel: string
  clusterIndex: number
  confidence: number
}


// ─────────────────────────────────────────────
// Client class — wraps all calls to the Python service
// ─────────────────────────────────────────────
class ScoringServiceClient {
  private readonly baseUrl: string
  private readonly secret: string

  constructor() {
    this.baseUrl = env.SCORING_SERVICE_URL     // e.g. http://scoring-service:8000
    this.secret = env.SCORING_SERVICE_SECRET   // Shared secret for auth
  }

  // ─── Shared fetch helper ───────────────────────────────────────────────
  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Internal auth — Python service validates this on every request
        "Authorization": `Bearer ${this.secret}`,
      },
      body: JSON.stringify(body),
      // Do not cache — scoring results must always be fresh
      cache: "no-store",
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(
        `Scoring service error [${response.status}] on ${path}: ${error}`
      )
    }

    return response.json() as Promise<T>
  }

  // ─── Public API ────────────────────────────────────────────────────────

  /**
   * Computes dimension scores for a completed assessment.
   * Called from POST /api/assessments/submit after raw responses are saved.
   */
  async score(request: ScoreRequest): Promise<ScoreResult> {
    return this.post<ScoreResult>("/score/", request)
  }

  /**
   * Assigns a participant to an ideological cluster.
   * Called after score() to enrich the stored result.
   */
  async cluster(request: ClusterRequest): Promise<ClusterResult> {
    return this.post<ClusterResult>("/cluster/", request)
  }

  /**
   * Health probe — used by Next.js startup check and CI pipelines.
   */
  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { cache: "no-store" })
      return res.ok
    } catch {
      return false
    }
  }
}

// Singleton instance — avoids creating new connections on every API call
export const scoringClient = new ScoringServiceClient()
