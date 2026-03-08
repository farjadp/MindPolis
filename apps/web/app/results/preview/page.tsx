// ============================================================================
// MindPolis: app/results/preview/page.tsx
// Version: 4.0.0 — 2026-03-07
// Why: Guest results page — editorial dark, amber bars, clean typography.
// Env / Identity: React Client Component — browser only
// ============================================================================

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ResultsChart } from "@/components/results/ResultsChart"

interface DimensionScore {
  key: string; label: string; value: number
  minLabel: string; maxLabel: string; interpretation: string
}
interface PreviewResult {
  assessmentSlug: string; assessmentTitle: string; modelVersion: string
  dimensions: DimensionScore[]; scoresFlat: Record<string, number>
  clusterLabel: string | null
  summary: { label: string; interpretation: string[]; highlights: string[] }
  computedAt: string; saved: boolean
}

export default function ResultsPreviewPage() {
  const router = useRouter()
  const [result,  setResult]  = useState<PreviewResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("mindpolis_preview")
      if (!raw) { router.replace("/assessment"); return }
      setResult(JSON.parse(raw))
    } catch { router.replace("/assessment") }
    finally  { setLoading(false) }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#111" }}>
        <div className="w-5 h-5 rounded border-2 border-white/10 border-t-amber-400 animate-spin" />
      </div>
    )
  }
  if (!result) return null

  const chartData = result.dimensions.map(d => ({ dimension: d.label, value: d.value, fullMark: 1 }))

  return (
    <div className="min-h-screen" style={{ background: "#111111" }}>

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5"
        style={{ background: "rgba(17,17,17,0.95)", borderBottom: "1px solid #1e1e1e", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded flex items-center justify-center text-black font-black text-[9px]"
            style={{ background: "#f59e0b" }}>MP</div>
          <span className="text-white/70 font-semibold text-sm">MindPolis</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/assessment" className="text-xs text-white/30 hover:text-white/60 px-3 py-1.5 transition-colors">
            ← Take another
          </Link>
          <Link href="/register"
            className="text-xs font-semibold px-3.5 py-1.5 rounded text-black"
            style={{ background: "#f59e0b" }}>
            Save results
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5 pb-20">

        {/* Score hero */}
        <div className="px-6 py-6 rounded-lg" style={{ background: "#171717", border: "1px solid #252525" }}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="label mb-2">{result.assessmentTitle}</p>
              <h1 className="text-2xl font-bold text-white/85 leading-tight">{result.summary.label}</h1>
            </div>
            {result.clusterLabel && (
              <span className="shrink-0 mono text-[11px] font-bold px-2.5 py-1 rounded mt-1"
                style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                {result.clusterLabel}
              </span>
            )}
          </div>
          <p className="text-[11px] text-white/20 mono">
            {new Date(result.computedAt).toLocaleString()} · {result.modelVersion}
          </p>
        </div>

        {/* Save CTA */}
        <div className="flex items-center justify-between px-5 py-4 rounded-lg gap-4"
          style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <div>
            <p className="font-semibold text-white/80 text-sm">Save your results for free</p>
            <p className="text-white/35 text-xs mt-0.5">Create an account to keep this and track changes over time.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/register"
              className="px-3.5 py-2 rounded text-xs font-semibold text-black"
              style={{ background: "#f59e0b" }}>
              Create account
            </Link>
            <Link href="/login"
              className="px-3.5 py-2 rounded text-xs text-white/45 hover:text-white/70 transition-colors"
              style={{ border: "1px solid #2a2a2a" }}>
              Sign in
            </Link>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="rounded-lg overflow-hidden" style={{ background: "#171717", border: "1px solid #252525" }}>
            <ResultsChart data={chartData} />
          </div>
        )}

        {/* Dimension breakdown */}
        <div className="rounded-lg px-6 py-5 space-y-5" style={{ background: "#171717", border: "1px solid #252525" }}>
          <p className="label">Dimension Breakdown</p>
          <div className="space-y-4">
            {result.dimensions.map((dim) => {
              const pct   = Math.round(((dim.value + 1) / 2) * 100)
              const isNeg = dim.value < 0
              return (
                <div key={dim.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/65">{dim.label}</span>
                    <span className="mono text-[10px] text-white/25">{dim.interpretation}</span>
                  </div>
                  <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "#1e1e1e" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: "#f59e0b", opacity: isNeg ? 0.5 : 1 }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/20">
                    <span>{dim.minLabel}</span><span>{dim.maxLabel}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Key findings */}
        {result.summary.highlights.length > 0 && (
          <div className="rounded-lg px-6 py-5 space-y-4" style={{ background: "#171717", border: "1px solid #252525" }}>
            <p className="label">Key Findings</p>
            <ol className="space-y-3">
              {result.summary.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mono shrink-0 text-[11px] font-bold mt-0.5" style={{ color: "#f59e0b" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-white/50 leading-relaxed">{h}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Interpretation */}
        {result.summary.interpretation.length > 0 && (
          <div className="rounded-lg px-6 py-5 space-y-3" style={{ background: "#171717", border: "1px solid #252525" }}>
            <p className="label">Full Interpretation</p>
            <ul className="space-y-2">
              {result.summary.interpretation.map((line, i) => (
                <li key={i} className="text-sm text-white/35 flex gap-2">
                  <span className="text-white/15 shrink-0">—</span>{line}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="py-8 text-center space-y-3" style={{ borderTop: "1px solid #1e1e1e" }}>
          <p className="text-white/50 text-sm font-medium">These results are only stored in this browser tab.</p>
          <p className="text-white/25 text-xs">Sign up free to save them permanently.</p>
          <div className="flex justify-center gap-3 mt-4">
            <Link href="/register"
              className="px-5 py-2.5 rounded text-sm font-semibold text-black"
              style={{ background: "#f59e0b" }}>
              Create free account
            </Link>
            <Link href="/assessment"
              className="px-5 py-2.5 rounded text-sm text-white/40 hover:text-white/70 transition-colors"
              style={{ border: "1px solid #2a2a2a" }}>
              Take another
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
