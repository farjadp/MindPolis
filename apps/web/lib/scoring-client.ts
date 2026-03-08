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
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.secret}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(
          `Scoring service error [${response.status}] on ${path}: ${error}`
        )
      }

      return response.json() as Promise<T>
    } catch (err: any) {
      if (
        process.env.NODE_ENV === "development" &&
        (err.code === "ECONNREFUSED" || err.message?.includes("fetch failed"))
      ) {
        console.warn(`[ScoringClient] Python service unreachable. Using MOCK data for ${path}`)
        return this.getMockResponse(path, body) as Promise<T>
      }
      throw err
    }
  }

  // ─── Local Dev Mock Generator ────────────────────────────────────────────
  private getMockResponse(path: string, body: any): any {
    if (path.includes("/score")) {
      const req = body as ScoreRequest
      const mockDimensions: DimensionScore[] = [
        { key: "equality_macro", label: "Equality", value: 0.6, rawValue: 12, interpretation: "High focus on equality" },
        { key: "liberty_macro", label: "Liberty", value: -0.2, rawValue: -4, interpretation: "Moderate skepticism of unbridled liberty" },
        { key: "authority_macro", label: "Authority", value: 0.8, rawValue: 16, interpretation: "High respect for authority" },
        { key: "tradition_macro", label: "Tradition", value: 0.4, rawValue: 8, interpretation: "Leans traditional" },
        { key: "care_harm", label: "Care/Harm", value: 0.9, rawValue: 18, interpretation: "Very high empathy" },
        { key: "fairness_cheating", label: "Fairness/Cheating", value: 0.7, rawValue: 14, interpretation: "High fairness" },
        { key: "loyalty_betrayal", label: "Loyalty/Betrayal", value: 0.3, rawValue: 6, interpretation: "Moderate loyalty" },
        { key: "authority_subversion", label: "Authority/Subversion", value: 0.5, rawValue: 10, interpretation: "Respect for order" },
        { key: "sanctity_degradation", label: "Sanctity/Degradation", value: 0.1, rawValue: 2, interpretation: "Neutral on sanctity" }
      ]

      const scoresFlat = Object.fromEntries(mockDimensions.map(d => [d.key, d.value]))

      return {
        assessmentSlug: req.assessmentSlug,
        modelVersion: "MOCK-1.0",
        dimensions: mockDimensions,
        scoresFlat,
        summary: {
          label: "Mock Civic Rationalist",
          interpretation: ["You value structure and stability.", "You exhibit profound empathy for marginalized groups."],
          highlights: ["High Equality Focus", "Strong Respect for Authority"]
        },
        computedAt: new Date().toISOString()
      }
    }

    if (path.includes("/cluster")) {
      return {
        resultId: (body as ClusterRequest).resultId,
        clusterLabel: "Technocratic Guardian",
        clusterIndex: 2,
        confidence: 0.88
      }
    }

    throw new Error(`No mock available for ${path}`)
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
