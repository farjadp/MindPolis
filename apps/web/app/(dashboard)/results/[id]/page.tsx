// ============================================================================
// MindPolis: app/(dashboard)/results/[id]/page.tsx
// Version: 4.0.0 — 2026-03-07
// Why: Result detail — editorial dark, amber bars, clean data display.
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
        <Link href="/results" className="hover:text-white/55 transition-colors">My Results</Link>
        <span>/</span>
        <span className="text-white/40">{result.assessment.title}</span>
      </nav>

      {/* Header */}
      <div className="px-6 py-5 rounded-lg" style={{ background: "#171717", border: "1px solid #252525" }}>
        <p className="label mb-2">
          {result.assessment.title} · {new Date(result.computedAt).toLocaleDateString()}
        </p>
        <h1 className="text-2xl font-bold text-white/85 mb-2">{summary.label}</h1>
        {result.clusterLabel && (
          <span className="mono text-[11px] font-bold px-2.5 py-1 rounded"
            style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
            {result.clusterLabel}
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="rounded-lg overflow-hidden" style={{ background: "#171717", border: "1px solid #252525" }}>
        <ResultsChart data={chartData} />
      </div>

      {/* Dimension breakdown */}
      <div className="rounded-lg px-6 py-5 space-y-5" style={{ background: "#171717", border: "1px solid #252525" }}>
        <p className="label">Dimension Breakdown</p>
        <div className="space-y-4">
          {result.assessment.dimensions.map((dim, i) => {
            const score = scores[dim.key] ?? 0
            const pct   = Math.round(((score + 1) / 2) * 100)
            const isNeg = score < 0
            return (
              <div key={dim.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/65">{dim.label}</span>
                  <span className="mono text-xs text-white/25">{score > 0 ? "+" : ""}{score.toFixed(2)}</span>
                </div>
                <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "#1e1e1e" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: "#f59e0b", opacity: isNeg ? 0.45 : 1 }} />
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
        <div className="rounded-lg px-6 py-5 space-y-4" style={{ background: "#171717", border: "1px solid #252525" }}>
          <p className="label">Key Findings</p>
          <ol className="space-y-3">
            {summary.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="mono shrink-0 text-[11px] font-bold" style={{ color: "#f59e0b" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-white/50 leading-relaxed">{h}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Interpretation */}
      {summary.interpretation?.length > 0 && (
        <div className="rounded-lg px-6 py-5 space-y-3" style={{ background: "#171717", border: "1px solid #252525" }}>
          <p className="label">Full Interpretation</p>
          <ul className="space-y-2">
            {summary.interpretation.map((line, i) => (
              <li key={i} className="flex gap-2 text-sm text-white/35">
                <span className="text-white/15 shrink-0">—</span>{line}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-center mono text-[11px] text-white/15">
        Model v{result.modelVersion} · {new Date(result.computedAt).toISOString()}
      </p>
    </div>
  )
}
