// ============================================================================
// MindPolis: app/api/assessments/score-preview/route.ts
// Version: 1.0.0 — 2026-03-07
// Why: Public scoring endpoint — no authentication required. Computes axis
//      scores directly in Node.js from question metadata (no Python service
//      needed for the basic demo flow). Scores are NOT saved to the database.
//      Used by the guest assessment flow; after seeing results the user is
//      offered to sign up and save.
//
//      Scoring logic (Node fallback):
//        For each response → find the selected option in question.metadata.options
//        → read its scores map → accumulate per axis → compute weighted mean
//        → normalize to [-1.0, 1.0]
// Env / Identity: Next.js API Route · Node.js runtime · PUBLIC (no auth)
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

// ── Request validation ───────────────────────────────────────────────────────
const Schema = z.object({
  assessmentId: z.string().cuid(),
  responses: z.array(z.object({
    questionId: z.string().cuid(),
    optionId: z.string().optional(),   // for 4-option questions
    value: z.number().optional(),   // for Likert questions
    confidence: z.number().min(1).max(5).optional(), // 1=Low, 5=High
  })).min(1),
})

// ── Axis display labels ──────────────────────────────────────────────────────
const AXIS_LABELS: Record<string, { label: string; minLabel: string; maxLabel: string }> = {
  economic_organization: { label: "Economic Organization", minLabel: "Market", maxLabel: "State" },
  authority_liberty: { label: "Authority vs Liberty", minLabel: "Civil Liberty", maxLabel: "Social Order" },
  tradition_change: { label: "Tradition vs Change", minLabel: "Tradition", maxLabel: "Reform" },
  nationalism_globalism: { label: "Nationalism vs Globalism", minLabel: "National", maxLabel: "Global" },
  justice_model: { label: "Justice Model", minLabel: "Rehabilitation", maxLabel: "Punishment" },
  ecology_growth: { label: "Ecology vs Growth", minLabel: "Growth", maxLabel: "Sustainability" },
  institutional_trust: { label: "Institutional Trust", minLabel: "Skepticism", maxLabel: "Trust" },
  diversity_cohesion: { label: "Diversity vs Cohesion", minLabel: "Cohesion", maxLabel: "Diversity" },
}

// ── Interpretation thresholds ────────────────────────────────────────────────
function interpret(axisKey: string, score: number): string {
  const meta = AXIS_LABELS[axisKey]
  if (!meta) return "Moderate"

  const abs = Math.abs(score)
  const dir = score < 0 ? meta.minLabel : meta.maxLabel

  if (abs < 0.2) return "Centrist"
  if (abs < 0.5) return `Moderate ${dir}`
  if (abs < 0.75) return dir
  return `Strong ${dir}`
}

export async function POST(req: NextRequest) {
  // ── Validate input ─────────────────────────────────────────────────────────
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 422 })
  }

  const { assessmentId, responses } = parsed.data

  // ── Load assessment with questions and their metadata ─────────────────────
  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId, isActive: true },
    include: {
      questions: { where: { isActive: true }, select: { id: true, dimensionKeys: true, metadata: true, isReversed: true } },
      dimensions: { select: { key: true, label: true, minLabel: true, maxLabel: true, weight: true } },
    },
  })

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
  }

  const questionMap = new Map(assessment.questions.map((q) => [q.id, q]))

  // ── Accumulate scores per axis ────────────────────────────────────────────
  // axisAccumulator[axisKey] = { sum, count, weightSum }
  const acc: Record<string, { sum: number; weightSum: number }> = {}

  for (const resp of responses) {
    const q = questionMap.get(resp.questionId)
    if (!q) continue

    const meta = q.metadata as {
      axis_id?: string
      options?: Array<{ id: string; scores: Record<string, number> }>
    } | null

    const cWeight = resp.confidence ? (resp.confidence / 3) : 1.0

    if (meta?.options && resp.optionId) {
      // ── 4-option question: read scores directly from selected option ──────
      const opt = meta.options.find((o) => o.id === resp.optionId)
      if (!opt) continue

      if (opt.scores['base'] !== undefined) {
        // Generic base score applies to the question's dimensionKeys
        const rawScore = opt.scores['base']
        const normalized = rawScore / 2
        const final = q.isReversed ? -normalized : normalized
        for (const axisKey of q.dimensionKeys) {
          const weight = (assessment.dimensions.find((d) => d.key === axisKey)?.weight ?? 1.0) * cWeight
          if (!acc[axisKey]) acc[axisKey] = { sum: 0, weightSum: 0 }
          acc[axisKey].sum += final * weight
          acc[axisKey].weightSum += weight
        }
      } else {
        // Specific axis scores
        for (const [axisKey, rawScore] of Object.entries(opt.scores)) {
          // rawScore is -2..+2; normalize to -1..+1
          const normalized = rawScore / 2
          const final = q.isReversed ? -normalized : normalized
          const weight = (assessment.dimensions.find((d) => d.key === axisKey)?.weight ?? 1.0) * cWeight

          if (!acc[axisKey]) acc[axisKey] = { sum: 0, weightSum: 0 }
          acc[axisKey].sum += final * weight
          acc[axisKey].weightSum += weight
        }
      }
    } else if (resp.value !== undefined) {
      // ── Likert question: normalize 1..5 → -1..+1 ─────────────────────────
      const normalized = ((resp.value - 1) / 4) * 2 - 1
      const final = q.isReversed ? -normalized : normalized

      for (const axisKey of q.dimensionKeys) {
        const weight = (assessment.dimensions.find((d) => d.key === axisKey)?.weight ?? 1.0) * cWeight
        if (!acc[axisKey]) acc[axisKey] = { sum: 0, weightSum: 0 }
        acc[axisKey].sum += final * weight
        acc[axisKey].weightSum += weight
      }
    }
  }

  // ── Build dimension score objects ─────────────────────────────────────────
  const dimensions = assessment.dimensions.map((dim) => {
    const a = acc[dim.key]
    const score = a && a.weightSum > 0 ? Math.max(-1, Math.min(1, a.sum / a.weightSum)) : 0
    return {
      key: dim.key,
      label: dim.label ?? AXIS_LABELS[dim.key]?.label ?? dim.key,
      value: parseFloat(score.toFixed(4)),
      minLabel: dim.minLabel ?? AXIS_LABELS[dim.key]?.minLabel ?? "Pole A",
      maxLabel: dim.maxLabel ?? AXIS_LABELS[dim.key]?.maxLabel ?? "Pole B",
      interpretation: interpret(dim.key, score),
    }
  })

  // ── Build flat scores map ──────────────────────────────────────────────────
  const scoresFlat: Record<string, number> = {}
  for (const d of dimensions) scoresFlat[d.key] = d.value

  // ── Build summary ──────────────────────────────────────────────────────────
  const sortedByExtremity = [...dimensions].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))

  const label = sortedByExtremity
    .slice(0, 2)
    .filter((d) => Math.abs(d.value) > 0.15)
    .map((d) => d.interpretation)
    .join(" · ") || "Centrist"

  const interpretation = dimensions.map((d) => `${d.label}: ${d.interpretation}`)

  const highlights = sortedByExtremity
    .filter((d) => Math.abs(d.value) > 0.4)
    .slice(0, 3)
    .map((d) => {
      const dir = d.value < 0 ? d.minLabel : d.maxLabel
      return `Strong ${dir} orientation on ${d.label}`
    })

  // ── Try clustering via Python service (optional — non-blocking) ───────────
  let clusterLabel: string | null = null
  try {
    const scoringUrl = process.env.SCORING_SERVICE_URL
    const scoringSecret = process.env.SCORING_SERVICE_SECRET
    if (scoringUrl) {
      const clusterRes = await fetch(`${scoringUrl}/cluster/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${scoringSecret}` },
        body: JSON.stringify({
          resultId: "preview",
          scoreVector: dimensions.map((d) => d.value),
          assessmentSlug: assessment.slug,
        }),
        signal: AbortSignal.timeout(3000), // 3s timeout — non-blocking
      })
      if (clusterRes.ok) {
        const cl = await clusterRes.json()
        clusterLabel = cl.clusterLabel ?? null
      }
    }
  } catch {
    // Python service is optional — scoring still works without it
  }

  return NextResponse.json({
    assessmentSlug: assessment.slug,
    assessmentTitle: assessment.title,
    modelVersion: "1.0.0-node",
    dimensions,
    scoresFlat,
    clusterLabel,
    summary: { label, interpretation, highlights },
    computedAt: new Date().toISOString(),
    saved: false, // flag — result is NOT in DB yet
  })
}
