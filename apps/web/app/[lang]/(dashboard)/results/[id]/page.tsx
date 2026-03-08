// ============================================================================
// MindPolis: app/(dashboard)/results/[id]/page.tsx
// Version: 6.0.0
// Why: Result detail — semantic light UI, clean and focused data presentation.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ResultsChart } from "@/components/results/ResultsChart"
import { PopulationDistribution } from "@/components/results/PopulationDistribution"

type Params = { params: { id: string } }
export const metadata = { title: "Result · MindPolis" }

export default async function ResultDetailPage({ params }: Params) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const userId = (session.user as any).id as string

  const result = await db.assessmentResult.findFirst({
    where: { id: params.id, userId },
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

  const scores = result.scores as Record<string, number>
  const summary = result.summary as { label: string; interpretation: string[]; highlights: string[] }
  const chartData = result.assessment.dimensions.map(d => ({
    dimension: d.label, value: scores[d.key] ?? 0, fullMark: 1,
  }))

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12 md:py-20 space-y-16">

      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 pb-6 border-b border-gray-100">
        <Link href="/results" className="hover:text-gray-900 transition-colors">My Results</Link>
        <span>/</span>
        <span className="text-gray-900">{result.assessment.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-6 text-center max-w-2xl mx-auto pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Cognitive Profile · {new Date(result.computedAt).toLocaleDateString()}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 leading-tight mb-2">
          {result.archetype || summary.label || "Analyzed Profile"}
        </h1>
        <p className="text-sm text-gray-500 font-medium max-w-lg mx-auto mb-8">
          Based on the {result.assessment.title}. Your dominant psychological traits lean towards {(result.topDimensions as any[])?.[0]?.key || "balanced reasoning"}.
        </p>

        {/* Share Action */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm defined as '${result.archetype}' by @MindPolis. Discover where your moral topography aligns here:`)}&url=${encodeURIComponent(`https://mindpolis.xyz/r/${result.shareHash}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[#111111] text-[#FDFCF8] text-sm font-bold uppercase tracking-widest rounded-sm shadow-xl hover:scale-[1.02] transition-transform"
          >
            Share Identity on X
          </a>
          <Link
            href={`/r/${result.shareHash}`}
            className="px-8 py-3 bg-white border border-[#E8E6E0] text-[#111111] text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-gray-50 transition-colors"
          >
            View Certificate
          </Link>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Ideology Map</h2>
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Model {result.modelVersion}</span>
        </div>
        <div className="p-4 md:p-8">
          <ResultsChart data={chartData} />
        </div>
      </div>

      {/* Dimension breakdown */}
      <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Axis Breakdown</h2>
        </div>
        <div className="p-8 space-y-10">
          {result.assessment.dimensions.map((dim) => {
            const score = scores[dim.key] ?? 0
            const pct = Math.round(((score + 1) / 2) * 100)
            const isNeg = score < 0
            return (
              <div key={dim.key} className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                  <span className="text-base font-bold tracking-tight text-gray-900">{dim.label}</span>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-3 py-1 rounded-[6px]">
                      {dim.description || "Score"}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {score > 0 ? "+" : ""}{score.toFixed(2)}
                    </span>
                  </div>
                </div>
                <PopulationDistribution userScore={score} />
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

      {/* Highlights */}
      {summary.highlights?.length > 0 && (
        <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Key Priorities</h2>
          </div>
          <div className="p-8">
            <ol className="space-y-6">
              {summary.highlights.map((h, i) => (
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
      {summary.interpretation?.length > 0 && (
        <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Synthesis</h2>
          </div>
          <div className="p-8 space-y-6 text-gray-700 font-medium leading-relaxed md:text-lg">
            {summary.interpretation.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      <div className="text-center pt-8">
        <Link href="/results" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
          ← Back to All Results
        </Link>
      </div>

    </div>
  )
}
