// ============================================================================
// MindPolis: app/api/assessments/[id]/start/route.ts
// Version: 1.0.0 — 2026-03-07
// Why: Creates an AssessmentSubmission record when a user starts a test.
//      Returns the submissionId that the take page uses to track progress
//      and that the submit endpoint requires to save responses against.
//      Idempotent — returns existing IN_PROGRESS submission if one exists.
// Env / Identity: Next.js API Route · Node.js runtime · Auth required
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: { id: string } }

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId      = (session.user as any).id as string
  const assessmentId = params.id

  // Verify assessment exists and is active
  const assessment = await db.assessment.findUnique({
    where:  { id: assessmentId, isActive: true },
    select: { id: true, slug: true, title: true },
  })

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
  }

  // Return an existing IN_PROGRESS submission if one exists
  // (allows resuming if user navigates away and comes back)
  const existing = await db.assessmentSubmission.findFirst({
    where:  { userId, assessmentId, status: "IN_PROGRESS" },
    select: { id: true },
  })

  if (existing) {
    return NextResponse.json({ submissionId: existing.id, resumed: true })
  }

  // Create a fresh submission
  const submission = await db.assessmentSubmission.create({
    data: {
      userId,
      assessmentId,
      status:    "IN_PROGRESS",
      startedAt: new Date(),
    },
    select: { id: true },
  })

  return NextResponse.json({ submissionId: submission.id, resumed: false }, { status: 201 })
}
