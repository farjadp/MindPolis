// ============================================================================
// MindPolis: app/(dashboard)/assessment/[id]/page.tsx
// Version: 5.0.0 — 2026-03-07
// Why: Assessment intro — analytical dark, blue accent, structured layout.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { BeginButton } from "@/components/assessment/BeginButton"

type Params = { params: { id: string } }

export async function generateMetadata({ params }: Params) {
  const a = await db.assessment.findUnique({ where: { id: params.id }, select: { title: true } })
  return { title: `${a?.title ?? "Assessment"} · MindPolis` }
}

export default async function AssessmentIntroPage({ params }: Params) {
  const session = await auth()

  const assessment = await db.assessment.findUnique({
    where:   { id: params.id, isActive: true },
    include: {
      dimensions: { select: { key: true, label: true, description: true, minLabel: true, maxLabel: true } },
      _count:     { select: { questions: { where: { isActive: true } } } },
    },
  })

  if (!assessment) notFound()

  const userId = (session?.user as any)?.id as string | undefined
  const previousResult = userId
    ? await db.assessmentResult.findFirst({
        where:   { userId, assessmentId: assessment.id },
        orderBy: { computedAt: "desc" },
        select:  { id: true, computedAt: true },
      })
    : null

  return (
    <div className="max-w-2xl mx-auto space-y-7">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs" style={{ color: "#374151" }}>
        <Link href="/assessment" className="transition-colors hover:text-white/50">Assessments</Link>
        <span>/</span>
        <span style={{ color: "#6B7280" }}>{assessment.title}</span>
      </nav>

      {/* Header */}
      <div className="pb-6" style={{ borderBottom: "1px solid #1E293B" }}>
        <div className="flex items-start gap-3 mb-3">
          <h1 className="text-2xl font-bold flex-1 leading-tight" style={{ color: "#E5E7EB" }}>
            {assessment.title}
          </h1>
          {assessment.isResearch && (
            <span className="shrink-0 mt-1 text-[10px] font-bold px-2 py-0.5 rounded"
              style={{ background: "rgba(59,130,246,0.1)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>
              RESEARCH GRADE
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "#9CA3AF" }}>{assessment.description}</p>
        <div className="flex items-center gap-7">
          {[[assessment._count.questions, "questions"], [assessment.dimensions.length, "dimensions"], [`~${assessment.estimatedMinutes}`, "minutes"]].map(([v, l]) => (
            <div key={String(l)}>
              <span className="mono text-lg font-bold" style={{ color: "#E5E7EB" }}>{v}</span>
              <span className="text-xs ml-1.5" style={{ color: "#6B7280" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Previous result */}
      {previousResult && (
        <div className="flex items-center justify-between px-4 py-3 rounded text-sm"
          style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <span style={{ color: "#9CA3AF" }}>
            Completed {new Date(previousResult.computedAt).toLocaleDateString()}.
          </span>
          <Link href={`/results/${previousResult.id}`} className="text-xs font-medium underline underline-offset-2"
            style={{ color: "#3B82F6" }}>
            View result
          </Link>
        </div>
      )}

      {/* Dimensions */}
      <div className="space-y-3">
        <p className="label">What this measures</p>
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid #1E293B" }}>
          {assessment.dimensions.map((dim, i) => (
            <div key={dim.key} className="flex items-start gap-4 px-4 py-3"
              style={{
                background: "#111827",
                borderTop: i > 0 ? "1px solid #1E293B" : "none",
              }}>
              <span className="mono text-[11px] font-bold mt-0.5 w-5 shrink-0" style={{ color: "#3B82F6" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium" style={{ color: "#9CA3AF" }}>{dim.label}</span>
                {dim.minLabel && dim.maxLabel && (
                  <span className="text-xs ml-3" style={{ color: "#374151" }}>{dim.minLabel} ↔ {dim.maxLabel}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="px-5 py-4 rounded-lg space-y-2.5"
        style={{ background: "#0B1120", border: "1px solid #1E293B" }}>
        <p className="label">Before you begin</p>
        <ul className="space-y-2 text-sm" style={{ color: "#9CA3AF" }}>
          {[
            "Choose the option that reflects your genuine view — not what seems expected or socially acceptable.",
            "There are no correct answers. Every option maps to legitimate values.",
            "Results are computed instantly. No account required.",
          ].map(tip => (
            <li key={tip} className="flex gap-2.5">
              <span className="shrink-0 w-1 h-1 rounded-full mt-[9px]" style={{ background: "#3B82F6" }} />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <BeginButton assessmentId={assessment.id} />
        <Link href="/assessment" className="text-sm transition-colors hover:text-white/60" style={{ color: "#6B7280" }}>
          ← Back
        </Link>
      </div>
    </div>
  )
}
