// ============================================================================
// MindPolis: app/(dashboard)/assessment/page.tsx
// Version: 5.0.0 — 2026-03-07
// Why: Assessment catalog — analytical dark, blue accent, structured list.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { db } from "@/lib/db"

export const metadata = { title: "Assessments · MindPolis" }

export default async function AssessmentCatalogPage() {
  const assessments = await db.assessment.findMany({
    where:   { isActive: true },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { questions: { where: { isActive: true } } } } },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      <div>
        <p className="label mb-1.5">Catalog</p>
        <h1 className="text-2xl font-bold" style={{ color: "#E5E7EB" }}>Assessments</h1>
        <p className="text-sm mt-1.5 max-w-lg" style={{ color: "#6B7280" }}>
          Each assessment maps a different aspect of political cognition.
          Scenario-based, anonymous, free.
        </p>
      </div>

      {assessments.length === 0 ? (
        <div className="py-16 text-center text-sm rounded-lg" style={{ border: "1px dashed #1E293B", color: "#6B7280" }}>
          No assessments available.
        </div>
      ) : (
        <div className="space-y-2">
          {assessments.map((a) => (
            <Link
              key={a.id}
              href={`/assessment/${a.id}`}
              className="group flex items-center justify-between px-5 py-4 rounded-lg transition-colors hover:bg-white/[0.03]"
              style={{ background: "#111827", border: "1px solid #1E293B" }}
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-semibold text-[15px] transition-colors" style={{ color: "#9CA3AF" }}>
                    {a.title}
                  </h2>
                  {a.isResearch && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(59,130,246,0.1)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>
                      RESEARCH
                    </span>
                  )}
                </div>
                <p className="text-sm truncate" style={{ color: "#6B7280" }}>{a.description}</p>
              </div>

              <div className="flex items-center gap-5 shrink-0 ml-4">
                <div className="hidden sm:flex items-center gap-5">
                  <span className="mono text-xs" style={{ color: "#374151" }}>{a._count.questions}q</span>
                  <span className="mono text-xs" style={{ color: "#374151" }}>~{a.estimatedMinutes}m</span>
                </div>
                <svg className="w-4 h-4 transition-colors" style={{ color: "#374151" }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
