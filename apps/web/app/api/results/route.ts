// ============================================================================
// MindPolis: app/api/results/route.ts
// Version: 1.0.0 — 2026-03-07
// Why: Returns the current user's assessment results with pagination.
//      Used by the results list page and dashboard summary widgets.
//      Hard-scoped to the authenticated user — no cross-user data leakage.
// Env / Identity: Next.js API Route  ·  Node.js runtime  ·  Auth required
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResultsQuerySchema } from "@/lib/validations/assessment"


export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string

  // Parse and validate query params
  const { searchParams } = new URL(req.url)
  const parsed = ResultsQuerySchema.safeParse(
    Object.fromEntries(searchParams.entries())
  )

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query params" }, { status: 422 })
  }

  const { page, limit, assessmentId } = parsed.data
  const skip = (page - 1) * limit

  try {
    const [results, total] = await db.$transaction([
      db.assessmentResult.findMany({
        where: {
          userId,
          // Optional filter by specific assessment
          ...(assessmentId && { assessmentId }),
        },
        select: {
          id: true,
          scores: true,
          summary: true,
          clusterLabel: true,
          modelVersion: true,
          computedAt: true,
          assessment: {
            select: { slug: true, title: true },
          },
        },
        orderBy: { computedAt: "desc" },
        skip,
        take: limit,
      }),
      db.assessmentResult.count({
        where: { userId, ...(assessmentId && { assessmentId }) },
      }),
    ])

    return NextResponse.json({
      results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("[GET /api/results]", error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}
