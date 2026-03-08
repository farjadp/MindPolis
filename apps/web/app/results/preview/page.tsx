// ============================================================================
// MindPolis: app/results/preview/page.tsx
// Version: 6.0.0
// Why: Guest results page — clean analytical layout with semantic light UI.
// Env / Identity: React Client Component — browser only
// ============================================================================

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ResultsChart } from "@/components/results/ResultsChart"
import { PopulationDistribution } from "@/components/results/PopulationDistribution"

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
  const [result, setResult] = useState<PreviewResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("mindpolis_preview")
      if (!raw) { router.replace("/assessment"); return }
      setResult(JSON.parse(raw))
    } catch { router.replace("/assessment") }
    finally { setLoading(false) }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
        <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin" />
      </div>
    )
  }
  if (!result) return null

  const chartData = result.dimensions.map(d => ({ dimension: d.label, value: d.value, fullMark: 1 }))

  return (
    <div className="min-h-screen bg-gray-50/30 text-gray-900 pb-32">

      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 border-b border-gray-200 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-[6px] flex items-center justify-center font-black text-[10px] bg-gray-900 text-white cursor-default">MP</div>
          <span className="font-bold tracking-tight text-gray-900 text-sm">MindPolis</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/assessment" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
            Retake
          </Link>
          <Link href="/register"
            className="text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-[6px] bg-blue-600 text-white shadow hover:opacity-90 active:scale-95 transition-all">
            Save Profile
          </Link>
        </div>
      </nav>

      <div className="max-w-[800px] mx-auto px-6 py-16 space-y-16">

        {/* Score header */}
        <div className="space-y-6 text-center max-w-2xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{result.assessmentTitle}</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 leading-tight">
            {result.summary.label}
          </h1>
          {result.clusterLabel && (
            <div className="inline-flex items-center justify-center mt-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-4 py-1.5 rounded-[8px] border border-blue-100/50">
                Cluster: {result.clusterLabel}
              </span>
            </div>
          )}
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pt-4">
            Analysis generated {new Date(result.computedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Ideology Map</h2>
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Model {result.modelVersion}</span>
            </div>
            <div className="p-4 md:p-8">
              <ResultsChart data={chartData} />
            </div>
          </div>
        )}

        {/* Dimension breakdown */}
        <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Axis Breakdown</h2>
          </div>
          <div className="p-8 space-y-10">
            {result.dimensions.map((dim) => {
              const pct = Math.round(((dim.value + 1) / 2) * 100)
              const isNeg = dim.value < 0
              return (
                <div key={dim.key} className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                    <span className="text-base font-bold tracking-tight text-gray-900">{dim.label}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-3 py-1 rounded-[6px]">{dim.interpretation}</span>
                  </div>
                  <PopulationDistribution userScore={dim.value} />
                  <div className="h-2 w-full rounded-full overflow-hidden bg-gray-100">
                    <div className="h-full rounded-full transition-all duration-700 bg-gray-900"
                      style={{ width: `${pct}%`, opacity: isNeg ? 0.4 : 1 }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span>{dim.minLabel}</span><span>{dim.maxLabel}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Key findings */}
        {result.summary.highlights.length > 0 && (
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Key Priorities</h2>
            </div>
            <div className="p-8">
              <ol className="space-y-6">
                {result.summary.highlights.map((h, i) => (
                  <li key={i} className="flex gap-6 items-start">
                    <span className="shrink-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-relaxed font-medium text-gray-700 text-lg">{h}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Interpretation */}
        {result.summary.interpretation.length > 0 && (
          <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Synthesis</h2>
            </div>
            <div className="p-8 space-y-6 text-gray-700 font-medium leading-relaxed md:text-lg">
              {result.summary.interpretation.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="pt-12 text-center space-y-6">
          <p className="text-gray-500 font-medium">This report is stored locally in your browser session.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register"
              className="px-8 py-4 rounded-[8px] text-sm font-bold uppercase tracking-widest bg-gray-900 text-white shadow hover:opacity-90 transition-opacity">
              Create Persistent Profile
            </Link>
            <Link href="/assessment"
              className="px-8 py-4 rounded-[8px] text-sm font-bold uppercase tracking-widest border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">
              Return to Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
