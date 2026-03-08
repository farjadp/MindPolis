// ============================================================================
// MindPolis: app/(dashboard)/dashboard/page.tsx
// Version: 4.0.0 — 2026-03-07
// Why: User dashboard — editorial dark, amber accent, recent results list.
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
    <div className="max-w-3xl mx-auto space-y-7">

      {/* Header */}
      <div>
        <p className="label mb-1">Dashboard</p>
        <h1 className="text-2xl font-bold text-white/85">
          Welcome back, <span style={{ color: "#f59e0b" }}>{firstName}</span>
        </h1>
      </div>

      {/* CTA card */}
      <div className="px-6 py-5 rounded-lg flex items-center justify-between gap-4"
        style={{ background: "#171717", border: "1px solid #252525" }}>
        <div className="space-y-0.5">
          <p className="font-semibold text-white/75 text-sm">Take an Assessment</p>
          <p className="text-white/30 text-xs">
            {assessmentCount} assessment{assessmentCount !== 1 ? "s" : ""} available · explore your political cognition
          </p>
        </div>
        <Link href="/assessment"
          className="shrink-0 px-4 py-2 rounded text-sm font-semibold text-black transition-opacity hover:opacity-85"
          style={{ background: "#f59e0b" }}>
          Browse →
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Assessments taken", value: recentResults.length },
          { label: "Available assessments", value: assessmentCount },
          { label: "Latest result", value: recentResults[0]
              ? new Date(recentResults[0].computedAt).toLocaleDateString("en-CA")
              : "—" },
        ].map(stat => (
          <div key={stat.label} className="px-4 py-3.5 rounded-lg"
            style={{ background: "#171717", border: "1px solid #232323" }}>
            <p className="label mb-1">{stat.label}</p>
            <p className="mono text-sm font-bold text-white/65">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent results */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="label">Recent Results</p>
          {recentResults.length > 0 && (
            <Link href="/results" className="text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: "#f59e0b" }}>
              View all →
            </Link>
          )}
        </div>

        {recentResults.length === 0 ? (
          <div className="py-14 text-center space-y-3.5 rounded-lg"
            style={{ border: "1px dashed #222" }}>
            <p className="text-white/25 text-sm">No results yet.</p>
            <Link href="/assessment" className="text-sm font-medium" style={{ color: "#f59e0b" }}>
              Take your first assessment →
            </Link>
          </div>
        ) : (
          <div className="space-y-1.5">
            {recentResults.map((result) => {
              const summary = result.summary as { label?: string }
              return (
                <Link key={result.id} href={`/results/${result.id}`}
                  className="group flex items-center justify-between rounded-lg px-5 py-3.5 gap-4 transition-colors"
                  style={{ background: "#171717", border: "1px solid #232323" }}>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="font-medium text-white/65 text-sm group-hover:text-white/85 transition-colors truncate">
                      {result.assessment.title}
                    </p>
                    <p className="text-xs text-white/25 truncate">
                      {summary?.label ?? "—"}
                      {result.clusterLabel && (
                        <span className="mono ml-2 font-bold" style={{ color: "#f59e0b" }}>
                          {result.clusterLabel}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="mono text-[11px] text-white/20 shrink-0">
                    {new Date(result.computedAt).toLocaleDateString("en-CA")}
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
