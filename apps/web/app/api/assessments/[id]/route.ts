// ============================================================================
// MindPolis: app/api/assessments/[id]/route.ts
// Version: 1.0.0 — 2026-03-07
// Why: Fetch a single assessment with all its questions — used by the
//      active assessment-taking UI to load the full question set.
//      Also handles admin PATCH (update) and DELETE operations.
// Env / Identity: Next.js API Route  ·  Node.js runtime
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: { id: string } }


// ─────────────────────────────────────────────
// GET /api/assessments/:id
// Returns the full assessment with questions and scoring dimensions.
// Auth required — only logged-in participants can load assessments.
// ─────────────────────────────────────────────
// GET is public — guests can load questions to take the assessment without signing in
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const assessment = await db.assessment.findUnique({
      where: { id: params.id, isActive: true },
      include: {
        // Load questions ordered for the UI
        questions: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            order: true,
            text: true,
            type: true,
            category: true,
            dimensionKeys: true,
            isReversed: true,
          },
        },
        // Load dimension metadata for result display
        dimensions: {
          select: {
            key: true,
            label: true,
            description: true,
            minLabel: true,
            maxLabel: true,
          },
        },
      },
    })

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({ assessment })
  } catch (error) {
    console.error(`[GET /api/assessments/${params.id}]`, error)
    return NextResponse.json(
      { error: "Failed to fetch assessment" },
      { status: 500 }
    )
  }
}


// ─────────────────────────────────────────────
// PATCH /api/assessments/:id — admin only
// ─────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const assessment = await db.assessment.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json({ assessment })
  } catch (error) {
    console.error(`[PATCH /api/assessments/${params.id}]`, error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}


// ─────────────────────────────────────────────
// DELETE /api/assessments/:id — admin only (soft delete via isActive flag)
// ─────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    // Soft delete — preserve data for research, just hide from users
    await db.assessment.update({
      where: { id: params.id },
      data: { isActive: false },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[DELETE /api/assessments/${params.id}]`, error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
