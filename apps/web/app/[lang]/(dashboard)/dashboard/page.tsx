// ============================================================================
// MindPolis: app/(dashboard)/dashboard/page.tsx
// Version: 5.0.0 — 2026-03-07
// Why: User dashboard — analytical intelligence aesthetic. Navy base, blue accent.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { getDictionary } from "@/get-dictionary"

export const metadata = { title: "Dashboard · MindPolis" }

export default async function DashboardPage({ params: { lang } }: { params: { lang: string } }) {
  const session = await auth()
  if (!session?.user) redirect(`/${lang}/login`)

  const dict = await getDictionary(lang as 'en' | 'fa')

  const userId = (session.user as any).id as string

  const [recentResults, assessmentCount] = await Promise.all([
    db.assessmentResult.findMany({
      where: { userId }, orderBy: { computedAt: "desc" }, take: 5,
      select: {
        id: true, summary: true, clusterLabel: true, computedAt: true, scores: true,
        assessment: { select: { title: true, slug: true } },
      },
    }),
    db.assessment.count({ where: { isActive: true } }),
  ])

  const firstName = session?.user?.name?.split(" ")[0] ?? "there"

  return (
    <div className="max-w-[800px] mx-auto space-y-12 pb-24">

      {/* Header */}
      <header className="space-y-2 border-b border-gray-200 pb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{dict.dashboard.pageTitle}</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          {dict.dashboard.welcomePrefix} <span className="text-blue-600">{firstName}</span>.
        </h1>
      </header>

      {/* CTA card */}
      <div className="p-8 bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <p className="font-bold text-gray-900 text-lg">{dict.dashboard.ctaTitle}</p>
          <p className="text-sm font-medium text-gray-600">
            {assessmentCount} {dict.dashboard.ctaDesc}
          </p>
        </div>
        <Link href={`/${lang}/assessment`}
          className="shrink-0 inline-flex items-center justify-center px-8 py-4 rounded-[12px] font-bold uppercase tracking-widest text-[12px] bg-gray-900 text-white transition-opacity hover:opacity-90 shadow-sm w-full md:w-auto">
          {dict.dashboard.ctaButton}
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: dict.dashboard.stats.taken, value: recentResults.length },
          { label: dict.dashboard.stats.available, value: assessmentCount },
          {
            label: dict.dashboard.stats.latest, value: recentResults[0]
              ? new Date(recentResults[0].computedAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : "en-CA")
              : dict.dashboard.stats.emptyDate
          },
        ].map(stat => (
          <div key={stat.label} className="p-6 bg-white border border-gray-200 rounded-[12px] shadow-sm justify-between flex flex-col items-start h-28">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
            <p className="font-mono text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Achievements / Gamification */}
      <section className="space-y-4 pt-4">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-900">{dict.dashboard.milestones}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <BadgeCard title={dict.dashboard.badges.initiate} description={dict.dashboard.badges.initiateDesc} achieved={recentResults.length >= 1} />
          <BadgeCard title={dict.dashboard.badges.explorer} description={dict.dashboard.badges.explorerDesc} achieved={recentResults.length >= 3} />
          <BadgeCard title={dict.dashboard.badges.analyst} description={dict.dashboard.badges.analystDesc} achieved={recentResults.length >= 5} />
          <BadgeCard title={dict.dashboard.badges.polymath} description={dict.dashboard.badges.polymathDesc} achieved={recentResults.length >= 10} />
        </div>
      </section>

      {/* Recent results */}
      <section className="space-y-6 pt-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-900">{dict.dashboard.recentResults}</p>
          {recentResults.length > 0 && (
            <Link href={`/${lang}/results`} className="text-[11px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
              {dict.dashboard.viewHistory}
            </Link>
          )}
        </div>

        {recentResults.length === 0 ? (
          <div className="py-16 text-center space-y-4 rounded-[12px] border border-dashed border-gray-300 bg-gray-50/50 flex flex-col items-center">
            <p className="text-sm font-medium text-gray-500">{dict.dashboard.noResults}</p>
            <Link href={`/${lang}/assessment`} className="text-[12px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
              {dict.dashboard.takeFirst}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentResults.map((result) => {
              const summary = result.summary as { label?: string }
              return (
                <Link key={result.id} href={`/${lang}/results/${result.id}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white border border-gray-200 rounded-[12px] shadow-sm gap-4 transition-all hover:border-gray-300 hover:shadow-md">
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-bold text-sm text-gray-900 transition-colors truncate">
                      {result.assessment.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-medium text-gray-500 truncate">
                        {summary?.label ?? dict.dashboard.cognitiveProfile}
                      </p>
                      {result.clusterLabel && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {result.clusterLabel}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="font-mono text-[11px] font-bold text-gray-400 shrink-0">
                    {new Date(result.computedAt).toLocaleDateString(lang === 'fa' ? 'fa-IR' : "en-CA")}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function BadgeCard({ title, description, achieved }: { title: string, description: string, achieved: boolean }) {
  return (
    <div className={`p-4 rounded-[12px] border transition-all ${achieved ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60 grayscale'}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${achieved ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
          {achieved ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
        </div>
        <p className={`font-bold text-sm ${achieved ? 'text-gray-900' : 'text-gray-500'}`}>{title}</p>
      </div>
      <p className="text-[11px] font-medium text-gray-500">{description}</p>
    </div>
  )
}

