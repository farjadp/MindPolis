// ============================================================================
// MindPolis: app/(dashboard)/assessment/[id]/page.tsx
// Version: 4.0.0 — 2026-03-07
// Why: Assessment intro — editorial, flat, amber accent. No gradients.
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
      <nav className="flex items-center gap-1.5 text-xs text-white/25">
        <Link href="/assessment" className="hover:text-white/55 transition-colors">Assessments</Link>
        <span>/</span>
        <span className="text-white/45">{assessment.title}</span>
      </nav>

      {/* Header */}
      <div className="pb-6" style={{ borderBottom: "1px solid #1e1e1e" }}>
        <div className="flex items-start gap-3 mb-3">
          <h1 className="text-2xl font-bold text-white/85 flex-1 leading-tight">{assessment.title}</h1>
          {assessment.isResearch && (
            <span className="shrink-0 mt-1 text-[10px] font-bold px-2 py-0.5 rounded"
              style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}>
              RESEARCH GRADE
            </span>
          )}
        </div>
        <p className="text-white/40 text-sm leading-relaxed mb-5">{assessment.description}</p>
        <div className="flex items-center gap-6">
          {[[assessment._count.questions, "questions"], [assessment.dimensions.length, "dimensions"], [`~${assessment.estimatedMinutes}`, "minutes"]].map(([v, l]) => (
            <div key={String(l)}>
              <span className="mono text-lg font-bold text-white/70">{v}</span>
              <span className="text-white/30 text-xs ml-1.5">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Previous result */}
      {previousResult && (
        <div className="flex items-center justify-between px-4 py-3 rounded text-sm"
          style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
          <span className="text-white/50">
            Completed {new Date(previousResult.computedAt).toLocaleDateString()}.
          </span>
          <Link href={`/results/${previousResult.id}`} className="text-xs font-medium underline underline-offset-2"
            style={{ color: "#f59e0b" }}>
            View result
          </Link>
        </div>
      )}

      {/* Dimensions */}
      <div className="space-y-3">
        <p className="label">What this measures</p>
        <div className="space-y-px">
          {assessment.dimensions.map((dim, i) => (
            <div key={dim.key} className="flex items-start gap-4 px-4 py-3"
              style={{ background: "#171717", border: "1px solid #232323", borderRadius: i === 0 ? "8px 8px 0 0" : i === assessment.dimensions.length - 1 ? "0 0 8px 8px" : "0" }}>
              <span className="mono text-[11px] font-bold mt-0.5 w-5 shrink-0" style={{ color: "#f59e0b" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-white/70">{dim.label}</span>
                {dim.minLabel && dim.maxLabel && (
                  <span className="text-xs text-white/25 ml-3">{dim.minLabel} ↔ {dim.maxLabel}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="px-5 py-4 rounded space-y-2.5" style={{ background: "#161616", border: "1px solid #1e1e1e" }}>
        <p className="label">Before you begin</p>
        <ul className="space-y-2 text-sm text-white/40">
          {[
            "Choose the option that reflects your genuine view — not what seems expected or socially acceptable.",
            "There are no correct answers. Every option maps to legitimate values.",
            "Results are computed instantly. No account required.",
          ].map(tip => (
            <li key={tip} className="flex gap-2.5">
              <span className="shrink-0 mt-1 w-1 h-1 rounded-full" style={{ background: "#f59e0b", marginTop: "8px" }} />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <BeginButton assessmentId={assessment.id} />
        <Link href="/assessment" className="text-sm text-white/30 hover:text-white/60 transition-colors">
          ← Back
        </Link>
      </div>
    </div>
  )
}
