// ============================================================================
// MindPolis: app/(dashboard)/assessment/[id]/page.tsx
// Version: 6.0.0
// Why: Assessment intro — clean, minimal, editorial look.
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
    where: { id: params.id, isActive: true },
    include: {
      dimensions: { select: { key: true, label: true, description: true, minLabel: true, maxLabel: true } },
      _count: { select: { questions: { where: { isActive: true } } } },
    },
  })

  if (!assessment) notFound()

  const userId = (session?.user as any)?.id as string | undefined
  const previousResult = userId
    ? await db.assessmentResult.findFirst({
      where: { userId, assessmentId: assessment.id },
      orderBy: { computedAt: "desc" },
      select: { id: true, computedAt: true },
    })
    : null

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 md:py-32">

      <Link href="/assessment" className="inline-flex items-center text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors mb-16">
        ← Back to Catalog
      </Link>

      <div className="space-y-10">
        <header>
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tighter leading-none">
              {assessment.title}
            </h1>
            {assessment.isResearch && (
              <span className="shrink-0 text-[10px] uppercase font-bold px-2.5 py-1 rounded-[8px] bg-gray-100 text-gray-600 tracking-wider">
                Research
              </span>
            )}
          </div>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium max-w-2xl">
            {assessment.description}
          </p>
        </header>

        {previousResult && (
          <div className="p-5 rounded-[12px] bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-sm font-medium text-gray-600">
              You completed this on {new Date(previousResult.computedAt).toLocaleDateString()}.
            </span>
            <Link href={`/results/${previousResult.id}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
              View previous result →
            </Link>
          </div>
        )}

        <div className="py-10 border-t border-b border-gray-200 space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Instructions</h2>
            <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
              This assessment presents real-world policy dilemmas. There are no correct answers. Respond according to your genuine judgment, not what seems expected or socially acceptable.
            </p>
          </div>

          <div className="flex items-center gap-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Estimated Time</p>
              <p className="text-xl font-bold text-gray-900">{assessment.estimatedMinutes}–{Math.ceil(assessment.estimatedMinutes * 1.25)} minutes</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Questions</p>
              <p className="text-xl font-bold text-gray-900">{assessment._count.questions}</p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <BeginButton assessmentId={assessment.id} />
        </div>
      </div>

    </div>
  )
}
