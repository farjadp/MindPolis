// ============================================================================
// MindPolis: app/(dashboard)/results/page.tsx
// Version: 6.0.0
// Why: Results list — analytical structured data display with semantic light UI.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { getDictionary } from "@/get-dictionary"

export const metadata = { title: "My Results · MindPolis" }

export default async function ResultsListPage({ params: { lang } }: { params: { lang: string } }) {
  const session = await auth()
  if (!session?.user) redirect(`/${lang}/login`)

  const dict = await getDictionary(lang as 'en' | 'fa')

  const userId = (session.user as any).id as string

  const results = await db.assessmentResult.findMany({
    where: { userId },
    orderBy: { computedAt: "desc" },
    include: { assessment: { select: { title: true, slug: true } } },
  })

  return (
    <div className="max-w-[800px] mx-auto space-y-12 pb-24">

      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-8 gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{dict.resultsList.history}</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">{dict.resultsList.pageTitle}</h1>
          <p className="text-sm font-medium text-gray-500 pt-2">
            {results.length} {lang === 'fa' ? 'آزمون' : `assessment${results.length !== 1 ? "s" : ""}`} {dict.resultsList.pageDesc}
          </p>
        </div>
        <Link href={`/${lang}/assessment`}
          className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-bold uppercase tracking-widest text-[11px] rounded-[8px] shadow-sm transition-opacity hover:opacity-90">
          {dict.resultsList.newAssessment}
        </Link>
      </header>

      {results.length === 0 ? (
        <div className="py-24 text-center space-y-6 rounded-[16px] border border-dashed border-gray-300 bg-gray-50/50 flex flex-col items-center">
          <p className="text-base font-medium text-gray-500">{dict.resultsList.noRecords}</p>
          <Link href={`/${lang}/assessment`} className="text-[12px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
            {dict.resultsList.initiate}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((result) => {
            const summary = result.summary as { label?: string; highlights?: string[] }
            const scores = result.scores as Record<string, number>
            return (
              <article key={result.id} className="group flex flex-col rounded-[16px] border border-gray-200 bg-white shadow-sm hover:border-gray-300 hover:shadow-md transition-all">
                <div className="p-8 space-y-6">

                  {/* Top Row: Meta and Date */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <p className="font-bold text-[12px] uppercase tracking-widest text-gray-400 truncate">
                        {result.assessment.title}
                      </p>
                      {summary?.label && (
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 transition-colors group-hover:text-blue-600">
                          <Link href={`/${lang}/results/${result.id}`} className="before:absolute before:inset-0 relative">
                            {summary.label}
                          </Link>
                        </h2>
                      )}
                    </div>
                    <div className="sm:text-right shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                      <p className="font-mono font-bold text-[12px] text-gray-400">
                        {new Date(result.computedAt).toLocaleDateString(lang === 'en' ? 'en-CA' : 'fa-IR')}
                      </p>
                      {result.clusterLabel && (
                        <span className="font-mono text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-[4px] bg-blue-50 text-blue-700">
                          {result.clusterLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* High level insight */}
                  {summary?.highlights?.[0] && (
                    <div className="bg-gray-50 border-l-2 border-gray-300 p-4 rounded-r-[8px]">
                      <p className="text-sm text-gray-700 font-medium leading-relaxed italic">
                        "{summary.highlights[0]}"
                      </p>
                    </div>
                  )}

                  {/* Bottom Row: Score Chips */}
                  <div className="pt-2 border-t border-gray-100">
                    <ScoreChips scores={scores} />
                  </div>

                </div>
              </article>
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
    <div className="flex flex-wrap gap-2 pt-4">
      {entries.map(([key, value]) => {
        const pct = Math.round(Math.abs(value) * 100)
        const label = key.replace(/_/g, " ").split(" ")[0]
        return (
          <span key={key} title={`${key}: ${value.toFixed(2)}`}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold px-3 py-1.5 rounded-[6px] bg-white border border-gray-200 text-gray-500 shadow-sm">
            {label}
            <span className={value > 0 ? "text-blue-600" : "text-gray-400"}>
              {value > 0 ? "+" : "−"}{pct}%
            </span>
          </span>
        )
      })}
    </div>
  )
}
