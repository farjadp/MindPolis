// ============================================================================
// MindPolis: app/api/results/[id]/route.ts
// Version: 1.0.0 — 2026-03-07
// Why: Returns a single result with full dimension scores and submission
//      metadata. Powers the detailed result visualization page where users
//      see their radar charts, axis positions, and cluster label.
// Env / Identity: Next.js API Route  ·  Node.js runtime  ·  Auth required
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

type Params = { params: { id: string } }


export async function GET(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as any).id as string

  try {
    const result = await db.assessmentResult.findFirst({
      where: {
        id: params.id,
        userId,  // Enforce ownership — users can only see their own results
      },
      include: {
        assessment: {
          select: {
            slug: true,
            title: true,
            description: true,
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
        },
        submission: {
          select: {
            startedAt: true,
            completedAt: true,
            // Include response count for completeness indicator
            _count: { select: { responses: true } },
          },
        },
      },
    })

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error(`[GET /api/results/${params.id}]`, error)
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 })
  }
}
