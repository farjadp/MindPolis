// ============================================================================
// MindPolis: app/(dashboard)/assessment/page.tsx
// Version: 3.0.0 — 2026-03-07
// Why: Assessment catalog — full dark design, glass cards, gradient accents.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { db } from "@/lib/db"

export const metadata = { title: "Assessments · MindPolis" }

const CARD_GRADIENTS = [
  { glow: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.2)",  from: "from-violet-500", line: "#8b5cf6" },
  { glow: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.2)",  from: "from-indigo-500", line: "#6366f1" },
  { glow: "rgba(34,211,238,0.10)",  border: "rgba(34,211,238,0.18)", from: "from-cyan-400",   line: "#22d3ee" },
  { glow: "rgba(244,114,182,0.10)", border: "rgba(244,114,182,0.18)",from: "from-pink-400",   line: "#f472b6" },
]

export default async function AssessmentCatalogPage() {
  const assessments = await db.assessment.findMany({
    where:   { isActive: true },
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { questions: { where: { isActive: true } } } } },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-1">Catalog</p>
        <h1 className="text-3xl font-bold text-white">Assessments</h1>
        <p className="text-white/40 text-sm mt-2">
          Each assessment maps your political cognition across validated scientific dimensions.
          No account required.
        </p>
      </div>

      {/* Cards */}
      {assessments.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] p-14 text-center">
          <p className="text-white/30 text-sm">No assessments available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assessments.map((a, idx) => {
            const g = CARD_GRADIENTS[idx % CARD_GRADIENTS.length]
            return (
              <Link
                key={a.id}
                href={`/assessment/${a.id}`}
                className="group relative block rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid rgba(255,255,255,0.07)`,
                }}
              >
                {/* Hover glow bg */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 50%, ${g.glow}, transparent 60%)` }}
                />

                {/* Left color line */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                  style={{ background: g.line }}
                />

                <div className="pl-7 pr-5 py-5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-white/90 group-hover:text-white transition-colors">
                        {a.title}
                      </h2>
                      {a.isResearch && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-violet-500/15 text-violet-400 border border-violet-500/20">
                          Research
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed line-clamp-1">
                      {a.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-white/25 pt-0.5">
                      <span>{a._count.questions} questions</span>
                      <span>·</span>
                      <span>~{a.estimatedMinutes} min</span>
                      <span>·</span>
                      <span>v{a.version}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border border-white/[0.07] text-white/30 group-hover:text-white/80 group-hover:border-white/[0.15] transition-all">
                    <svg className="w-4 h-4 translate-x-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
