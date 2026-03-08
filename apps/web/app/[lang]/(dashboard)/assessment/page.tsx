import Link from "next/link"
import { db } from "@/lib/db"
import { getDictionary } from "@/get-dictionary"

export const metadata = { title: "Assessments · MindPolis" }

export default async function AssessmentCatalogPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang as 'en' | 'fa')
  const assessments = await db.assessment.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { questions: { where: { isActive: true } } } } },
  })

  return (
    <div className="max-w-[800px] mx-auto space-y-12 pb-24">
      <header className="space-y-4 border-b border-gray-200 pb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{dict.assessmentCatalog.catalog}</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          {dict.assessmentCatalog.title}
        </h1>
        <p className="text-base text-gray-600 leading-relaxed font-medium">
          {dict.assessmentCatalog.subtitle}
        </p>
      </header>

      {assessments.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-gray-300 rounded-[16px] bg-gray-50/50">
          <p className="text-gray-500 font-medium tracking-wide">{dict.assessmentCatalog.noInstruments}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {assessments.map((a) => (
            <Link
              key={a.id}
              href={`/${lang}/assessment/${a.id}`}
              className="group block p-8 bg-white border border-gray-200 rounded-[16px] hover:border-gray-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight truncate">
                      {a.title}
                    </h2>
                    {a.isResearch && (
                      <span className="font-mono text-[9px] font-bold px-2.5 py-1 rounded-[4px] bg-blue-50 text-blue-700 tracking-widest uppercase shrink-0">
                        {dict.assessmentCatalog.researchBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium line-clamp-2 md:line-clamp-none">
                    {a.description}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0 pt-4 md:pt-0 border-t border-gray-100 md:border-none">
                  <div className="flex flex-col text-left md:text-right">
                    <span className="font-mono text-lg font-bold text-gray-900 leading-none">{a._count.questions}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{dict.assessmentCatalog.items}</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200 hidden md:block" />
                  <div className="flex flex-col text-left md:text-right">
                    <span className="font-mono text-lg font-bold text-gray-900 leading-none">{a.estimatedMinutes}m</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{dict.assessmentCatalog.estTime}</span>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 text-gray-400 group-hover:bg-gray-900 group-hover:text-white group-hover:border-transparent transition-colors">
                    <svg className="w-4 h-4 text-current flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
