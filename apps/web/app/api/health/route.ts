// ============================================================================
// MindPolis: app/api/health/route.ts
// Version: 1.0.0 — 2026-03-07
// Why: Health check endpoint for Vercel deployment checks and CI pipelines.
//      Also pings the Python scoring service to verify the full stack is up.
//      Returns degraded status if scoring service is unreachable.
// Env / Identity: Next.js API Route  ·  Node.js runtime  ·  Public (no auth)
// ============================================================================

import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { scoringClient } from "@/lib/scoring-client"


export async function GET() {
  // Check database connectivity
  let dbStatus = "ok"
  try {
    await db.$queryRaw`SELECT 1`
  } catch {
    dbStatus = "error"
  }

  // Check Python scoring service connectivity
  const scoringStatus = (await scoringClient.health()) ? "ok" : "error"

  const allOk = dbStatus === "ok" && scoringStatus === "ok"

  return NextResponse.json(
    {
      status:   allOk ? "ok" : "degraded",
      services: {
        database: dbStatus,
        scoring:  scoringStatus,
      },
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 }
  )
}
