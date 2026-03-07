// ============================================================================
// MindPolis: app/(dashboard)/assessment/[id]/page.tsx
// Version: 3.0.0 — 2026-03-07
// Why: Assessment intro — dark glass card, dimensions grid, focus CTA.
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
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-white/30">
        <Link href="/assessment" className="hover:text-white/60 transition-colors">Assessments</Link>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-white/50">{assessment.title}</span>
      </nav>

      {/* Hero card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 0 60px rgba(124,58,237,0.08)",
        }}
      >
        {/* Gradient top bar */}
        <div className="h-px w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />

        <div className="p-7 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <h1 className="text-2xl font-bold text-white flex-1 leading-tight">{assessment.title}</h1>
              {assessment.isResearch && (
                <span className="shrink-0 mt-0.5 text-[10px] font-semibold px-2 py-1 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/20">
                  Research Grade
                </span>
              )}
            </div>
            <p className="text-white/45 text-sm leading-relaxed">{assessment.description}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            {[
              [assessment._count.questions, "Questions"],
              [assessment.dimensions.length, "Dimensions"],
              [`~${assessment.estimatedMinutes}`, "Minutes"],
            ].map(([val, lbl]) => (
              <div key={String(lbl)}>
                <p className="text-xl font-bold text-white">{val}</p>
                <p className="text-[11px] text-white/30">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Previous result */}
      {previousResult && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-violet-500/20 bg-violet-500/8 text-sm">
          <span className="text-violet-300/80">
            You completed this on {new Date(previousResult.computedAt).toLocaleDateString()}.
          </span>
          <Link href={`/results/${previousResult.id}`} className="text-violet-400 hover:text-violet-300 text-xs font-medium underline underline-offset-2">
            View result
          </Link>
        </div>
      )}

      {/* Dimensions */}
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">What this measures</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {assessment.dimensions.map((dim) => (
            <div
              key={dim.key}
              className="rounded-xl px-4 py-3 space-y-0.5"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-sm font-medium text-white/80">{dim.label}</p>
              {dim.minLabel && dim.maxLabel && (
                <p className="text-[11px] text-white/30">{dim.minLabel} ↔ {dim.maxLabel}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div
        className="rounded-xl px-5 py-4 space-y-3"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/25">Before you begin</p>
        <ul className="space-y-2 text-sm text-white/45">
          {[
            "Choose the option that best reflects your genuine view — not what seems expected.",
            "There are no right or wrong answers.",
            "Your results are instant — no account required.",
          ].map((tip) => (
            <li key={tip} className="flex gap-2.5">
              <span className="text-violet-500/60 mt-0.5 shrink-0">→</span>
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
