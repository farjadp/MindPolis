// ============================================================================
// MindPolis: app/(dashboard)/dashboard/page.tsx
// Version: 5.0.0 — 2026-03-07
// Why: User dashboard — analytical intelligence aesthetic. Navy base, blue accent.
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
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="label mb-1.5">Dashboard</p>
        <h1 className="text-2xl font-bold" style={{ color: "#E5E7EB" }}>
          Welcome back, <span style={{ color: "#60A5FA" }}>{firstName}</span>
        </h1>
      </div>

      {/* CTA card */}
      <div className="px-6 py-5 rounded-lg flex items-center justify-between gap-4"
        style={{ background: "#111827", border: "1px solid #1E293B" }}>
        <div className="space-y-0.5">
          <p className="font-semibold text-sm" style={{ color: "#E5E7EB" }}>Take an Assessment</p>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            {assessmentCount} assessment{assessmentCount !== 1 ? "s" : ""} available · explore your political cognition
          </p>
        </div>
        <Link href="/assessment"
          className="shrink-0 px-4 py-2 rounded text-sm font-semibold text-white transition-opacity hover:opacity-85"
          style={{ background: "#3B82F6" }}>
          Browse →
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Assessments taken", value: recentResults.length },
          { label: "Available", value: assessmentCount },
          { label: "Latest", value: recentResults[0]
              ? new Date(recentResults[0].computedAt).toLocaleDateString("en-CA")
              : "—" },
        ].map(stat => (
          <div key={stat.label} className="px-4 py-3.5 rounded-lg"
            style={{ background: "#111827", border: "1px solid #1E293B" }}>
            <p className="label mb-1.5">{stat.label}</p>
            <p className="mono text-sm font-bold" style={{ color: "#E5E7EB" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent results */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="label">Recent Results</p>
          {recentResults.length > 0 && (
            <Link href="/results" className="text-xs font-medium transition-opacity hover:opacity-80"
              style={{ color: "#3B82F6" }}>
              View all →
            </Link>
          )}
        </div>

        {recentResults.length === 0 ? (
          <div className="py-14 text-center space-y-3.5 rounded-lg"
            style={{ border: "1px dashed #1E293B" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>No results yet.</p>
            <Link href="/assessment" className="text-sm font-medium" style={{ color: "#3B82F6" }}>
              Take your first assessment →
            </Link>
          </div>
        ) : (
          <div className="space-y-1.5">
            {recentResults.map((result) => {
              const summary = result.summary as { label?: string }
              return (
                <Link key={result.id} href={`/results/${result.id}`}
                  className="group flex items-center justify-between rounded-lg px-5 py-3.5 gap-4 transition-colors hover:bg-white/[0.03]"
                  style={{ background: "#111827", border: "1px solid #1E293B" }}>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="font-medium text-sm transition-colors truncate"
                      style={{ color: "#9CA3AF" }}>
                      {result.assessment.title}
                    </p>
                    <p className="text-xs truncate" style={{ color: "#6B7280" }}>
                      {summary?.label ?? "—"}
                      {result.clusterLabel && (
                        <span className="mono ml-2 font-bold" style={{ color: "#F59E0B" }}>
                          {result.clusterLabel}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="mono text-[11px] shrink-0" style={{ color: "#374151" }}>
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
