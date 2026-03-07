// ============================================================================
// MindPolis: app/(dashboard)/dashboard/page.tsx
// Version: 3.0.0 — 2026-03-07
// Why: User dashboard — dark glass cards, gradient CTA, recent results.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export const metadata = { title: "Dashboard · MindPolis" }

export default async function DashboardPage() {
  const session = await auth()
  const userId  = (session!.user as any).id as string

  const [recentResults, assessmentCount] = await Promise.all([
    db.assessmentResult.findMany({
      where: { userId }, orderBy: { computedAt: "desc" }, take: 4,
      select: {
        id: true, summary: true, clusterLabel: true, computedAt: true, scores: true,
        assessment: { select: { title: true, slug: true } },
      },
    }),
    db.assessment.count({ where: { isActive: true } }),
  ])

  const firstName = session?.user?.name?.split(" ")[0] ?? "there"

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span style={{ background: "linear-gradient(135deg, #a78bfa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{firstName}</span>
        </h1>
      </div>

      {/* Quick start gradient card */}
      <div
        className="relative rounded-2xl overflow-hidden p-7"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.15), rgba(9,9,15,0.7))",
          border: "1px solid rgba(124,58,237,0.2)",
          boxShadow: "0 0 60px rgba(124,58,237,0.1)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-violet-500 via-indigo-500 to-transparent" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <svg width="120" height="120" fill="none" viewBox="0 0 24 24" stroke="white">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div className="relative flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-white text-base">Take an Assessment</p>
            <p className="text-white/45 text-sm">
              {assessmentCount} assessment{assessmentCount !== 1 ? "s" : ""} available. Explore your political cognition.
            </p>
          </div>
          <Link
            href="/assessment"
            className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            Browse →
          </Link>
        </div>
      </div>

      {/* Recent results */}
      {recentResults.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Recent Results</p>
            <Link href="/results" className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {recentResults.map((result) => {
              const summary = result.summary as { label?: string }
              return (
                <Link
                  key={result.id}
                  href={`/results/${result.id}`}
                  className="group flex items-center justify-between rounded-xl px-5 py-4 gap-4 transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white/70 text-sm group-hover:text-white/90 transition-colors truncate">
                      {result.assessment.title}
                    </p>
                    <p className="text-xs text-white/30 truncate mt-0.5">
                      {summary?.label ?? "—"}
                      {result.clusterLabel && ` · ${result.clusterLabel}`}
                    </p>
                  </div>
                  <p className="text-xs text-white/20 shrink-0">
                    {new Date(result.computedAt).toLocaleDateString("en-CA")}
                  </p>
                </Link>
              )
            })}
          </div>
        </section>
      ) : (
        <div className="rounded-2xl p-14 text-center space-y-3"
          style={{ border: "1px dashed rgba(255,255,255,0.08)" }}>
          <p className="text-white/40 text-sm">You haven&apos;t completed any assessments yet.</p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 transition-all"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Take your first assessment
          </Link>
        </div>
      )}
    </div>
  )
}
