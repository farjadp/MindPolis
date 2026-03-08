// ============================================================================
// MindPolis: app/(dashboard)/assessment/page.tsx
// Version: 4.0.0 — 2026-03-07
// Why: Assessment catalog — editorial dark, amber accents, table-like layout.
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
        <p className="label mb-1">Catalog</p>
        <h1 className="text-2xl font-bold text-white/85">Assessments</h1>
        <p className="text-white/35 text-sm mt-1.5 max-w-lg">
          Each assessment maps a different aspect of political cognition.
          Scenario-based, anonymous, free.
        </p>
      </div>

      {assessments.length === 0 ? (
        <div className="py-16 text-center text-white/25 text-sm" style={{ border: "1px dashed #2a2a2a", borderRadius: "8px" }}>
          No assessments available.
        </div>
      ) : (
        <div className="space-y-2">
          {assessments.map((a) => (
            <Link
              key={a.id}
              href={`/assessment/${a.id}`}
              className="group flex items-center justify-between px-5 py-4 rounded transition-colors"
              style={{ background: "#171717", border: "1px solid #232323" }}
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-semibold text-white/75 group-hover:text-white/95 transition-colors text-[15px]">
                    {a.title}
                  </h2>
                  {a.isResearch && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
                      RESEARCH
                    </span>
                  )}
                </div>
                <p className="text-white/35 text-sm truncate">{a.description}</p>
              </div>

              <div className="flex items-center gap-5 shrink-0 ml-4">
                <div className="hidden sm:flex items-center gap-5 text-xs text-white/25">
                  <span className="mono">{a._count.questions}q</span>
                  <span className="mono">~{a.estimatedMinutes}m</span>
                </div>
                <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
