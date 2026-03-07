// ============================================================================
// MindPolis: app/results/preview/page.tsx
// Version: 3.0.0 — 2026-03-07
// Why: Guest results page — full dark dramatic reveal with gradient score hero,
//      radar chart, gradient bars, and prominent save CTA.
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#09090f" }}>
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin" />
      </div>
    )
  }
  if (!result) return null

  const chartData = result.dimensions.map(d => ({ dimension: d.label, value: d.value, fullMark: 1 }))

  return (
    <div className="min-h-screen" style={{ background: "#09090f" }}>

      {/* ── Sticky nav ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5"
        style={{
          background: "rgba(9,9,15,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-[9px] font-black">MP</span>
          </div>
          <span className="text-white/80 font-semibold text-sm">MindPolis</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/assessment" className="text-xs text-white/35 hover:text-white/70 px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all">
            ← Take another
          </Link>
          <Link
            href="/register"
            className="text-xs font-semibold px-3.5 py-1.5 rounded-xl text-white transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
          >
            Save results
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5 pb-24">

        {/* ── Score hero ── */}
        <div
          className="relative rounded-2xl overflow-hidden p-7"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(79,70,229,0.08), rgba(9,9,15,0.8))",
            border: "1px solid rgba(124,58,237,0.2)",
            boxShadow: "0 0 80px rgba(124,58,237,0.1)",
          }}
        >
          {/* Top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500 via-indigo-500 to-transparent" />

          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">
            {result.assessmentTitle}
          </p>
          <h1 className="text-3xl font-bold leading-tight mb-3"
            style={{ background: "linear-gradient(135deg, #fff 40%, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {result.summary.label}
          </h1>
          {result.clusterLabel && (
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}>
              {result.clusterLabel}
            </span>
          )}
          <p className="text-[11px] text-white/20 mt-4">
            {new Date(result.computedAt).toLocaleString()} · {result.modelVersion}
          </p>
        </div>

        {/* ── Save CTA ── */}
        <div
          className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(79,70,229,0.12))",
            border: "1px solid rgba(124,58,237,0.25)",
          }}
        >
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-white text-[15px]">Save your results for free</p>
            <p className="text-violet-300/60 text-sm">Create a free account to keep this and track changes over time.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white/90 transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* ── Radar chart ── */}
        {chartData.length > 0 && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <ResultsChart data={chartData} />
          </div>
        )}

        {/* ── Dimension breakdown ── */}
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Dimension Breakdown</p>
          <div className="space-y-4">
            {result.dimensions.map((dim) => {
              const pct = Math.round(((dim.value + 1) / 2) * 100)
              const isNeg = dim.value < 0
              return (
                <div key={dim.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-white/70">{dim.label}</span>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}
                    >
                      {dim.interpretation}
                    </span>
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

        {/* ── Key findings ── */}
        {result.summary.highlights.length > 0 && (
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Key Findings</p>
            <ul className="space-y-3">
              {result.summary.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-white/55 leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Interpretation ── */}
        {result.summary.interpretation.length > 0 && (
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Full Interpretation</p>
            <ul className="space-y-2">
              {result.summary.interpretation.map((line, i) => (
                <li key={i} className="flex gap-2 text-sm text-white/40">
                  <span className="text-white/15 mt-0.5 shrink-0">–</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div
          className="rounded-2xl p-7 text-center space-y-4"
          style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
        >
          <p className="font-semibold text-white/80">These results are only in this browser tab</p>
          <p className="text-sm text-white/35">Sign up free to save them permanently and unlock history tracking.</p>
          <div className="flex justify-center gap-3">
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 20px rgba(124,58,237,0.25)" }}
            >
              Create free account
            </Link>
            <Link
              href="/assessment"
              className="px-5 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Take another
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
