// ============================================================================
// MindPolis: app/api/assessments/route.ts
// Version: 1.0.0 — 2026-03-07
// Why: List and create assessments. GET is public (no auth needed to browse
//      the catalog). POST is admin-only and creates new assessment definitions.
// Env / Identity: Next.js API Route  ·  Node.js runtime
// ============================================================================

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// ─────────────────────────────────────────────
// GET /api/assessments
// Returns all active assessments for the catalog page.
// Public — no auth required.
// ─────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const assessments = await db.assessment.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        estimatedMinutes: true,
        version: true,
        // Count questions to show progress info in the UI
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ assessments })
  } catch (error) {
    console.error("[GET /api/assessments]", error)
    return NextResponse.json(
      { error: "Failed to fetch assessments" },
      { status: 500 }
    )
  }
}


// ─────────────────────────────────────────────
// POST /api/assessments
// Create a new assessment definition — admin only.
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth()

  // Gate: only admins can create assessments
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = await req.json()

    const assessment = await db.assessment.create({
      data: {
        slug:             body.slug,
        title:            body.title,
        description:      body.description,
        estimatedMinutes: body.estimatedMinutes ?? 10,
        version:          body.version ?? "1.0",
        isResearch:       body.isResearch ?? false,
      },
    })

    return NextResponse.json({ assessment }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/assessments]", error)
    return NextResponse.json(
      { error: "Failed to create assessment" },
      { status: 500 }
    )
  }
}
