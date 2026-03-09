// ============================================================================
// MindPolis: app/api/assessments/submit/route.ts
// Version: 1.0.0 — 2026-03-07
// Why: The most critical API route — handles submission of a completed
//      assessment. Orchestrates the full pipeline:
//        1. Validate input (Zod)
//        2. Persist raw responses to DB (source of truth)
//        3. Enrich with question metadata (weights, reversal flags)
//        4. Call Python scoring service
//        5. Call Python clustering service
//        6. Persist computed result to DB
//        7. Return result to frontend
//      If scoring fails, raw data is already safe in the DB.
// Env / Identity: Next.js API Route  ·  Node.js runtime  ·  Auth required
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { scoringClient } from "@/lib/scoring-client"
import { SubmitAssessmentSchema } from "@/lib/validations/assessment"
import { calculateResultIdentity } from "@/lib/archetypes"


export async function POST(req: NextRequest) {
  // ── Step 0: Identify user (Optional) ────────────────────────────────────
  const session = await auth()
  const currentUserId = session?.user ? ((session.user as any).id as string) : null

  // ── Step 1: Validate request body ───────────────────────────────────────
  const body = await req.json()
  const parsed = SubmitAssessmentSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { assessmentId, submissionId, responses } = parsed.data

  // ── Step 2: Verify submission exists and is in progress ───────────────
  const submission = await db.assessmentSubmission.findFirst({
    where: { id: submissionId, assessmentId, status: "IN_PROGRESS" },
  })

  if (!submission) {
    return NextResponse.json(
      { error: "Submission not found or already completed" },
      { status: 404 }
    )
  }

  // If the submission belongs to a user, the current user must match
  if (submission.userId && submission.userId !== currentUserId) {
    return NextResponse.json({ error: "Unauthorized submission access" }, { status: 403 })
  }

  // ── Step 3: Load question metadata for scoring enrichment ────────────────
  const questions = await db.question.findMany({
    where: { assessmentId, isActive: true },
    select: {
      id: true,
      dimensionKeys: true,
      isReversed: true,
      metadata: true,
    },
  })

  // Build a quick lookup map
  const questionMap = new Map(questions.map((q) => [q.id, q]))

  // Enrich responses to ensure 'value' exists for scenario options
  const enrichedResponses = responses.map(r => {
    const q = questionMap.get(r.questionId);
    let val = r.value;

    // If it's a scenario question, we calculate a scalar value based on the option
    if (val === undefined && r.optionId && q?.metadata && typeof q.metadata === 'object' && Array.isArray((q.metadata as any).options)) {
      const idx = (q.metadata as any).options.findIndex((o: any) => o.id === r.optionId);
      val = idx === 0 ? 1 : (idx === 1 ? 5 : 3);
    }

    return { ...r, finalValue: val ?? 3 };
  });

  // ── Step 4: Persist raw responses to DB (source of truth is always saved) ─
  await db.$transaction([
    // Bulk insert all question responses
    db.questionResponse.createMany({
      data: enrichedResponses.map((r) => ({
        submissionId,
        questionId: r.questionId,
        value: r.finalValue,
        rawValue: r.optionId ? `opt:${r.optionId}|conf:${r.confidence || 3}` : String(r.finalValue),
        answeredAt: r.answeredAt ? new Date(r.answeredAt) : new Date(),
        latencyMs: r.latencyMs ?? null,
      })),
      skipDuplicates: true,
    }),
    // Mark submission as completed
    db.assessmentSubmission.update({
      where: { id: submissionId },
      data: { status: "COMPLETED", completedAt: new Date() },
    }),
  ])

  // ── Step 5: Load assessment metadata for scoring ──────────────────────────
  const assessment = await db.assessment.findUnique({
    where: { id: assessmentId },
    include: {
      dimensions: { select: { key: true, weight: true } },
    },
  })

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
  }

  const dimensionWeightMap = new Map(
    assessment.dimensions.map((d) => [d.key, d.weight])
  )

  // ── Step 6: Build scoring payload for Python service ─────────────────────
  const scoringResponses = enrichedResponses
    .filter((r) => questionMap.has(r.questionId))
    .map((r) => {
      const q = questionMap.get(r.questionId)!
      return {
        questionId: r.questionId,
        value: r.finalValue,
        dimensionKeys: q.dimensionKeys,
        isReversed: q.isReversed,
        // Fetch the max weight across all dimensions this question maps to
        weight: Math.max(
          ...q.dimensionKeys.map((k) => dimensionWeightMap.get(k) ?? 1.0)
        ),
      }
    })

  // ── Step 7: Call Python scoring service ───────────────────────────────────
  let scoreResult
  try {
    scoreResult = await scoringClient.score({
      assessmentSlug: assessment.slug,
      assessmentVersion: assessment.version,
      responses: scoringResponses,
    })
  } catch (err) {
    // Scoring failed — but raw data is safe. Log and return a partial response.
    console.error("[submit] Scoring service error:", err)
    return NextResponse.json(
      {
        error: "Scoring service unavailable. Your responses were saved.",
        submissionId,
      },
      { status: 503 }
    )
  }

  // ── Step 8: Call clustering service & Archetype Calculation ────────────────
  let clusterResult
  try {
    const scoreVector = Object.values(scoreResult.scoresFlat)
    clusterResult = await scoringClient.cluster({
      resultId: submissionId,
      scoreVector,
      assessmentSlug: assessment.slug,
    })
  } catch (err) {
    // Clustering is non-critical — log but continue
    console.warn("[submit] Clustering service error:", err)
  }

  // Calculate High-level UX Archetype and Top Dimensions
  const { archetype, topDimensions } = calculateResultIdentity(scoreResult.scoresFlat as Record<string, number>)

  // ── Step 9: Persist computed result ───────────────────────────────────────
  const result = await db.assessmentResult.create({
    data: {
      userId: submission.userId,
      assessmentId,
      submissionId,
      scores: scoreResult.scoresFlat,
      summary: scoreResult.summary,
      clusterLabel: clusterResult?.clusterLabel ?? null,
      archetype,
      topDimensions,
      modelVersion: scoreResult.modelVersion,
    },
  })

  return NextResponse.json({ result, scoreResult }, { status: 201 })
}
