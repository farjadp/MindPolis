// ============================================================================
// MindPolis: app/(dashboard)/results/page.tsx
// Version: 3.0.0 — 2026-03-07
// Why: Results list — dark glass cards with gradient score chips.
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
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-1">History</p>
          <h1 className="text-3xl font-bold text-white">My Results</h1>
          <p className="text-white/40 text-sm mt-1">
            {results.length} completed assessment{results.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/assessment"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 transition-all"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Take another
        </Link>
      </div>

      {/* Empty state */}
      {results.length === 0 ? (
        <div
          className="rounded-2xl p-16 text-center space-y-4"
          style={{ border: "1px dashed rgba(255,255,255,0.09)" }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}
          >
            <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-white/60">No results yet</p>
            <p className="text-white/30 text-sm mt-1">Complete an assessment to see your profile here.</p>
          </div>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.25)" }}
          >
            Browse assessments
          </Link>
        </div>
      ) : (
        <div className="space-y-2.5">
          {results.map((result) => {
            const summary = result.summary as { label?: string; highlights?: string[] }
            return (
              <Link
                key={result.id}
                href={`/results/${result.id}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Hover glow */}
                <div className="p-5 space-y-3 relative">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 10% 50%, rgba(124,58,237,0.07), transparent 60%)" }} />

                  {/* Title row */}
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white/80 group-hover:text-white transition-colors">
                        {result.assessment.title}
                      </p>
                      {summary?.label && (
                        <p className="text-sm text-white/40">{summary.label}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-xs text-white/25">
                        {new Date(result.computedAt).toLocaleDateString("en-CA")}
                      </p>
                      {result.clusterLabel && (
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>
                          {result.clusterLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Score chips */}
                  <ScoreChips scores={result.scores as Record<string, number>} />

                  {/* Highlight */}
                  {summary?.highlights?.[0] && (
                    <p className="relative text-xs text-white/25 border-t pt-2.5"
                      style={{ borderColor: "rgba(255,255,255,0.06)" }}>
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
        const isNeg = value < 0
        const pct   = Math.round(Math.min(Math.abs(value) * 50, 100))
        const label = key.replace(/_/g, " ")
        return (
          <span
            key={key}
            title={`${label}: ${value > 0 ? "+" : ""}${value.toFixed(2)}`}
            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={isNeg
              ? { background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)", color: "rgba(103,232,249,0.8)" }
              : { background: "rgba(124,58,237,0.1)",  border: "1px solid rgba(124,58,237,0.2)",  color: "rgba(167,139,250,0.9)" }
            }
          >
            <span className="capitalize hidden sm:inline">{label.split(" ")[0]}</span>
            <span>{isNeg ? "−" : "+"}{pct}%</span>
          </span>
        )
      })}
    </div>
  )
}
