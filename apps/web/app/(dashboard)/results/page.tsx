// ============================================================================
// MindPolis: app/(dashboard)/results/page.tsx
// Version: 5.0.0 — 2026-03-07
// Why: Results list — analytical dark, blue accent, structured data display.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export const metadata = { title: "My Results · MindPolis" }

export default async function ResultsListPage() {
  const session = await auth()
  const userId  = (session!.user as any).id as string

  const results = await db.assessmentResult.findMany({
    where:   { userId },
    orderBy: { computedAt: "desc" },
    include: { assessment: { select: { title: true, slug: true } } },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-7">

      <div className="flex items-end justify-between">
        <div>
          <p className="label mb-1.5">History</p>
          <h1 className="text-2xl font-bold" style={{ color: "#E5E7EB" }}>My Results</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {results.length} assessment{results.length !== 1 ? "s" : ""} completed
          </p>
        </div>
        <Link href="/assessment"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded text-sm transition-colors hover:text-white/60"
          style={{ border: "1px solid #1E293B", color: "#6B7280" }}>
          + New
        </Link>
      </div>

      {results.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-lg" style={{ border: "1px dashed #1E293B" }}>
          <p className="text-sm" style={{ color: "#6B7280" }}>No results yet.</p>
          <Link href="/assessment" className="text-sm font-medium" style={{ color: "#3B82F6" }}>
            Take your first assessment →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {results.map((result) => {
            const summary = result.summary as { label?: string; highlights?: string[] }
            const scores  = result.scores  as Record<string, number>
            return (
              <Link key={result.id} href={`/results/${result.id}`}
                className="group block rounded-lg transition-colors hover:bg-white/[0.02]"
                style={{ background: "#111827", border: "1px solid #1E293B" }}>
                <div className="px-5 py-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-semibold text-[15px] transition-colors truncate"
                        style={{ color: "#9CA3AF" }}>
                        {result.assessment.title}
                      </p>
                      {summary?.label && (
                        <p className="text-sm" style={{ color: "#6B7280" }}>{summary.label}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p className="mono text-[11px]" style={{ color: "#374151" }}>
                        {new Date(result.computedAt).toLocaleDateString("en-CA")}
                      </p>
                      {result.clusterLabel && (
                        <span className="mono text-[10px] font-bold px-2 py-0.5 rounded block"
                          style={{ background: "rgba(245,158,11,0.08)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.18)" }}>
                          {result.clusterLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  <ScoreChips scores={scores} />
                  {summary?.highlights?.[0] && (
                    <p className="text-xs pt-1.5" style={{ borderTop: "1px solid #1E293B", color: "#374151" }}>
                      {summary.highlights[0]}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ScoreChips({ scores }: { scores: Record<string, number> }) {
  const entries = Object.entries(scores)
  if (!entries.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {entries.map(([key, value]) => {
        const pct   = Math.round(Math.min(Math.abs(value) * 50, 100))
        const label = key.replace(/_/g, " ").split(" ")[0]
        return (
          <span key={key} title={`${key}: ${value.toFixed(2)}`}
            className="mono text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ background: "#0F172A", border: "1px solid #1E293B", color: "#374151" }}>
            {label} {value > 0 ? "+" : "−"}{pct}%
          </span>
        )
      })}
    </div>
  )
}
