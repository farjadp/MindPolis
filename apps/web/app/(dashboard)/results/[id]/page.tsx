// ============================================================================
// MindPolis: app/(dashboard)/results/[id]/page.tsx
// Version: 3.0.0 — 2026-03-07
// Why: Result detail — dark glass cards, gradient bars, radar chart.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResultsChart } from "@/components/results/ResultsChart"

type Params = { params: { id: string } }
export const metadata = { title: "Result · MindPolis" }

export default async function ResultDetailPage({ params }: Params) {
  const session = await auth()
  const userId  = (session!.user as any).id as string

  const result = await db.assessmentResult.findFirst({
    where:   { id: params.id, userId },
    include: {
      assessment: {
        select: {
          title: true,
          dimensions: { select: { key: true, label: true, minLabel: true, maxLabel: true, description: true } },
        },
      },
    },
  })

  if (!result) notFound()

  const scores  = result.scores as Record<string, number>
  const summary = result.summary as { label: string; interpretation: string[]; highlights: string[] }
  const chartData = result.assessment.dimensions.map(d => ({
    dimension: d.label, value: scores[d.key] ?? 0, fullMark: 1,
  }))

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-white/25">
        <Link href="/results" className="hover:text-white/50 transition-colors">My Results</Link>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white/40">{result.assessment.title}</span>
      </nav>

      {/* Hero */}
      <div
        className="relative rounded-2xl overflow-hidden p-7"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(79,70,229,0.07), rgba(9,9,15,0.8))",
          border: "1px solid rgba(124,58,237,0.18)",
          boxShadow: "0 0 60px rgba(124,58,237,0.08)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500 via-indigo-500 to-transparent" />
        <p className="text-[11px] text-white/30 mb-2">
          {result.assessment.title} · {new Date(result.computedAt).toLocaleDateString()}
        </p>
        <h1 className="text-2xl font-bold leading-tight mb-3"
          style={{ background: "linear-gradient(135deg, #fff 40%, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {summary.label}
        </h1>
        {result.clusterLabel && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>
            {result.clusterLabel}
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <ResultsChart data={chartData} />
      </div>

      {/* Dimension breakdown */}
      <div className="rounded-2xl p-6 space-y-5"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Dimension Breakdown</p>
        <div className="space-y-4">
          {result.assessment.dimensions.map((dim) => {
            const score = scores[dim.key] ?? 0
            const pct   = Math.round(((score + 1) / 2) * 100)
            const isNeg = score < 0
            return (
              <div key={dim.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-white/70">{dim.label}</span>
                  <span className="text-xs font-mono text-white/30">{score > 0 ? "+" : ""}{score.toFixed(2)}</span>
                </div>
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: isNeg
                        ? "linear-gradient(90deg, #22d3ee, #6366f1)"
                        : "linear-gradient(90deg, #7c3aed, #6366f1, #22d3ee)",
                      boxShadow: `0 0 8px ${isNeg ? "rgba(34,211,238,0.4)" : "rgba(124,58,237,0.4)"}`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/20">
                  <span>{dim.minLabel}</span><span>{dim.maxLabel}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Highlights */}
      {summary.highlights?.length > 0 && (
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Key Findings</p>
          <ul className="space-y-3">
            {summary.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}>
                  {i + 1}
                </span>
                <span className="text-white/50 leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Interpretation */}
      {summary.interpretation?.length > 0 && (
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Full Interpretation</p>
          <ul className="space-y-2">
            {summary.interpretation.map((line, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/35">
                <span className="text-white/15 shrink-0">–</span>{line}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-center text-xs text-white/15">
        Model v{result.modelVersion} · {new Date(result.computedAt).toISOString()}
      </p>
    </div>
  )
}
