// ============================================================================
// MindPolis: app/(dashboard)/results/[id]/page.tsx
// Version: 5.0.0 — 2026-03-07
// Why: Result detail — analytical dark, amber bars for data, blue accent for UI.
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
      <nav className="flex items-center gap-1.5 text-xs" style={{ color: "#374151" }}>
        <Link href="/results" className="transition-colors hover:text-white/50">My Results</Link>
        <span>/</span>
        <span style={{ color: "#6B7280" }}>{result.assessment.title}</span>
      </nav>

      {/* Header */}
      <div className="px-6 py-5 rounded-lg" style={{ background: "#111827", border: "1px solid #1E293B" }}>
        <p className="label mb-2">
          {result.assessment.title} · {new Date(result.computedAt).toLocaleDateString()}
        </p>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "#E5E7EB" }}>{summary.label}</h1>
        {result.clusterLabel && (
          <span className="mono text-[11px] font-bold px-2.5 py-1 rounded inline-block"
            style={{ background: "rgba(245,158,11,0.08)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.18)" }}>
            {result.clusterLabel}
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="rounded-lg overflow-hidden" style={{ background: "#111827", border: "1px solid #1E293B" }}>
        <ResultsChart data={chartData} />
      </div>

      {/* Dimension breakdown */}
      <div className="rounded-lg px-6 py-5 space-y-5" style={{ background: "#111827", border: "1px solid #1E293B" }}>
        <p className="label">Dimension Breakdown</p>
        <div className="space-y-4">
          {result.assessment.dimensions.map((dim) => {
            const score = scores[dim.key] ?? 0
            const pct   = Math.round(((score + 1) / 2) * 100)
            const isNeg = score < 0
            return (
              <div key={dim.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "#9CA3AF" }}>{dim.label}</span>
                  <span className="mono text-[10px]" style={{ color: "#374151" }}>
                    {score > 0 ? "+" : ""}{score.toFixed(2)}
                  </span>
                </div>
                <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "#1E293B" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: "#F59E0B", opacity: isNeg ? 0.45 : 1 }} />
                </div>
                <div className="flex justify-between text-[10px]" style={{ color: "#374151" }}>
                  <span>{dim.minLabel}</span><span>{dim.maxLabel}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Highlights */}
      {summary.highlights?.length > 0 && (
        <div className="rounded-lg px-6 py-5 space-y-4" style={{ background: "#111827", border: "1px solid #1E293B" }}>
          <p className="label">Key Findings</p>
          <ol className="space-y-3">
            {summary.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="mono shrink-0 text-[11px] font-bold" style={{ color: "#3B82F6" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-relaxed" style={{ color: "#9CA3AF" }}>{h}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Interpretation */}
      {summary.interpretation?.length > 0 && (
        <div className="rounded-lg px-6 py-5 space-y-3" style={{ background: "#111827", border: "1px solid #1E293B" }}>
          <p className="label">Full Interpretation</p>
          <ul className="space-y-2">
            {summary.interpretation.map((line, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: "#6B7280" }}>
                <span className="shrink-0" style={{ color: "#374151" }}>—</span>{line}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-center mono text-[11px]" style={{ color: "#374151" }}>
        Model v{result.modelVersion} · {new Date(result.computedAt).toISOString()}
      </p>
    </div>
  )
}
