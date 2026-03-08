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
import { getDictionary } from "@/get-dictionary"
import { ResultsChart } from "@/components/results/ResultsChart"
import { PopulationDistribution } from "@/components/results/PopulationDistribution"

type Params = { params: { id: string, lang: string } }
export const metadata = { title: "Result · MindPolis" }

export default async function ResultDetailPage({ params }: Params) {
  const session = await auth()
  const userId = session?.user ? (session.user as any).id as string : null
  const dict = await getDictionary(params.lang as 'en' | 'fa')

  const result = await db.assessmentResult.findUnique({
    where: { id: params.id },
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

  // Security check: Deny access if result belongs to another user
  if (result.userId && result.userId !== userId) {
    redirect(`/${params.lang}/login`)
  }

  const scores = result.scores as Record<string, number>
  const summary = result.summary as { label: string; interpretation: string[]; highlights: string[] }
  const chartData = result.assessment.dimensions.map(d => ({
    dimension: d.label, value: scores[d.key] ?? 0, fullMark: 1,
  }))

  const axisLabels = result.assessment.dimensions.length === 2 ? {
    xMin: result.assessment.dimensions[0].minLabel || "-1",
    xMax: result.assessment.dimensions[0].maxLabel || "+1",
    yMin: result.assessment.dimensions[1].minLabel || "-1",
    yMax: result.assessment.dimensions[1].maxLabel || "+1",
  } : undefined;

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12 md:py-20 space-y-16">

      {!userId && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-6 py-4 rounded-[12px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-medium text-sm leading-relaxed">
            {dict.resultDetail.signupToSave}
          </p>
          <Link href={`/${params.lang}/login`} className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-[8px] text-sm transition-colors shadow-sm">
            {dict.resultDetail.signupFree}
          </Link>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 pb-6 border-b border-gray-100">
        <Link href={`/${params.lang}/results`} className="hover:text-gray-900 transition-colors">
          {dict.resultDetail.myResults}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{result.assessment.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-6 text-center max-w-2xl mx-auto pt-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {dict.resultDetail.cognitiveProfile} · {new Date(result.computedAt).toLocaleDateString(params.lang === 'fa' ? 'fa-IR' : 'en-US')}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 leading-tight mb-2">
          {(dict.archetypes as any)[result.archetype ?? ""] || result.archetype || summary.label || dict.resultDetail.analyzedProfile}
        </h1>
        <p className="text-sm text-gray-500 font-medium max-w-lg mx-auto mb-8">
          {dict.resultDetail.basedOn} {result.assessment.title}. {dict.resultDetail.leanTowards} {result.assessment.dimensions.find(d => d.key === (result.topDimensions as any[])?.[0]?.key)?.label || dict.resultDetail.balancedReasoning}.
        </p>

        {/* Share Action */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(dict.resultDetail.shareTwitterTextPart1 + ((dict.archetypes as any)[result.archetype ?? ""] || result.archetype) + dict.resultDetail.shareTwitterTextPart2)}&url=${encodeURIComponent(`https://mindpolis.xyz/${params.lang}/r/${result.shareHash}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[#111111] text-[#FDFCF8] text-sm font-bold uppercase tracking-widest rounded-[8px] shadow-lg hover:scale-[1.02] transition-transform"
          >
            {dict.resultDetail.shareTwitter}
          </a>
          <Link
            href={`/${params.lang}/r/${result.shareHash}?owner=true`}
            className="px-8 py-3 bg-white border border-[#E8E6E0] text-[#111111] text-sm font-bold uppercase tracking-widest rounded-[8px] hover:bg-gray-50 transition-colors"
          >
            {dict.resultDetail.viewCertificate}
          </Link>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">{dict.resultDetail.ideologyMap}</h2>
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{dict.resultDetail.model} {result.modelVersion}</span>
        </div>
        <div className="p-4 md:p-8">
          <ResultsChart data={chartData} axisLabels={axisLabels} />
        </div>
      </div>

      {/* Dimension breakdown */}
      <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">{dict.resultDetail.axisBreakdown}</h2>
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
                      {dim.description || dict.resultDetail.score}
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
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">{dict.resultDetail.keyPriorities}</h2>
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
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">{dict.resultDetail.synthesis}</h2>
          </div>
          <div className="p-8 space-y-6 text-gray-700 font-medium leading-relaxed md:text-lg">
            {summary.interpretation.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      <div className="text-center pt-8">
        <Link href={`/${params.lang}/results`} className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
          {dict.resultDetail.backToAll}
        </Link>
      </div>

    </div>
  )
}
