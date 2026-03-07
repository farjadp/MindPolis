// ============================================================================
// MindPolis: app/(dashboard)/assessment/[id]/take/page.tsx
// Version: 4.0.0 — 2026-03-07
// Why: Full-screen immersive assessment experience. Dark, focused, no distractions.
//      Submits to /api/assessments/score-preview → sessionStorage → /results/preview
// Env / Identity: React Client Component — browser only
// ============================================================================

"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface OptionData  { id: string; text: string; scores: Record<string, number> }
interface QuestionData {
  id: string; order: number; text: string; type: string
  dimensionKeys: string[]; isReversed: boolean
  metadata: { question_id?: string; axis_id?: string; subtype?: string; complexity?: string; options?: OptionData[] } | null
}
interface AssessmentData { id: string; slug: string; title: string; questions: QuestionData[] }

export default function TakePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [assessment,   setAssessment]   = useState<AssessmentData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers,      setAnswers]      = useState<Map<string, { optionId?: string; value?: number }>>(new Map())
  const [submitting,   setSubmitting]   = useState(false)
  const [error,        setError]        = useState("")
  const [loading,      setLoading]      = useState(true)
  const startRef = useRef<number>(Date.now())

  useEffect(() => {
    fetch(`/api/assessments/${params.id}`)
      .then(r => r.json())
      .then(({ assessment }) => { setAssessment(assessment); setLoading(false); startRef.current = Date.now() })
      .catch(() => { setError("Could not load questions. Please refresh."); setLoading(false) })
  }, [params.id])

  useEffect(() => { startRef.current = Date.now() }, [currentIndex])

  if (loading) return <Screen><Spinner /></Screen>
  if (error)   return <Screen><ErrorCard message={error} /></Screen>
  if (!assessment?.questions.length) return <Screen><ErrorCard message="No questions found." /></Screen>

  const questions   = assessment.questions
  const total       = questions.length
  const currentQ    = questions[currentIndex]
  const isLastQ     = currentIndex === total - 1
  const answered    = answers.get(currentQ.id)
  const hasAnswered = answered !== undefined
  const options     = currentQ.metadata?.options ?? null
  const pct         = Math.round(((currentIndex + 1) / total) * 100)

  function selectOption(id: string) { setAnswers(p => new Map(p).set(currentQ.id, { optionId: id })) }
  function selectLikert(v: number)  { setAnswers(p => new Map(p).set(currentQ.id, { value: v })) }

  function handleNext() {
    if (!hasAnswered) return
    if (isLastQ) handleSubmit()
    else setCurrentIndex(i => i + 1)
  }

  async function handleSubmit() {
    if (!assessment) return
    setSubmitting(true)
    setError("")
    const responses = questions.map(q => {
      const ans = answers.get(q.id)
      return { questionId: q.id, optionId: ans?.optionId, value: ans?.value }
    })
    try {
      const res    = await fetch("/api/assessments/score-preview", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId: assessment.id, responses }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? "Scoring failed")
      sessionStorage.setItem("mindpolis_preview", JSON.stringify(result))
      router.push("/results/preview")
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.")
      setSubmitting(false)
    }
  }

  return (
    <Screen>
      {/* ── Top progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-[2px] w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, #7c3aed, #6366f1, #22d3ee)",
              boxShadow: "0 0 8px rgba(124,58,237,0.6)",
            }}
          />
        </div>
      </div>

      <div className="max-w-[560px] mx-auto w-full pt-8">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-white/30 font-medium">{assessment.title}</span>
          <span className="text-xs font-mono text-white/30 tabular-nums">
            {currentIndex + 1}<span className="text-white/15"> / {total}</span>
          </span>
        </div>

        {/* Question card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 60px rgba(124,58,237,0.07)",
          }}
        >
          {/* Axis tag */}
          {currentQ.metadata?.axis_id && (
            <div className="px-6 pt-5 pb-0 flex items-center gap-2">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", color: "#a78bfa" }}
              >
                {currentQ.metadata.axis_id.replace(/_/g, " ")}
              </span>
              {currentQ.metadata.complexity && (
                <span className="text-[10px] text-white/25 capitalize border border-white/[0.07] px-2 py-0.5 rounded-full">
                  {currentQ.metadata.complexity}
                </span>
              )}
            </div>
          )}

          {/* Question text */}
          <div className="px-6 py-5">
            <p className="text-[15px] leading-[1.65] text-white/85 font-medium">{currentQ.text}</p>
          </div>

          {/* Options */}
          <div className="px-6 pb-6 space-y-2">
            {options ? (
              options.map((opt) => {
                const sel = answered?.optionId === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => selectOption(opt.id)}
                    className="w-full text-left rounded-xl px-4 py-3.5 text-sm transition-all duration-150 focus:outline-none"
                    style={{
                      background: sel ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)",
                      border: sel ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: sel ? "0 0 20px rgba(124,58,237,0.12)" : "none",
                    }}
                  >
                    <span
                      className="inline-flex w-5 h-5 rounded-full items-center justify-center text-[10px] font-bold mr-3 shrink-0 align-middle transition-all"
                      style={{
                        background: sel ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.06)",
                        color: sel ? "white" : "rgba(255,255,255,0.3)",
                        border: sel ? "none" : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {opt.id}
                    </span>
                    <span className={sel ? "text-white/90" : "text-white/55"}>{opt.text}</span>
                  </button>
                )
              })
            ) : (
              <LikertScale value={answered?.value} onChange={selectLikert} />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0 || submitting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.05] disabled:opacity-20 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswered || submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={hasAnswered && !submitting ? {
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 0 25px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            } : { background: "rgba(255,255,255,0.06)" }}
          >
            {submitting ? (
              <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Calculating…</>
            ) : isLastQ ? "See my results →" : "Next →"}
          </button>
        </div>

        {error && (
          <div className="mt-5 px-4 py-3 rounded-xl text-xs text-red-400 text-center"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
            {error}
          </div>
        )}
      </div>
    </Screen>
  )
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: "#09090f" }}>
      {children}
    </div>
  )
}

const LIKERT_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]

function LikertScale({ value, onChange }: { value?: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[11px] text-white/25 font-medium">
        <span>Strongly disagree</span><span>Strongly agree</span>
      </div>
      <div className="flex gap-2">
        {[1,2,3,4,5].map(v => (
          <button
            key={v}
            onClick={() => onChange(v)}
            title={LIKERT_LABELS[v - 1]}
            className="flex-1 h-12 rounded-xl text-sm font-bold transition-all duration-150"
            style={{
              background: value === v ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.04)",
              border: value === v ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.07)",
              color: value === v ? "white" : "rgba(255,255,255,0.35)",
              boxShadow: value === v ? "0 0 15px rgba(124,58,237,0.2)" : "none",
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="text-center space-y-4">
      <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin mx-auto" />
      <p className="text-white/30 text-sm">Loading questions…</p>
    </div>
  )
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="text-center space-y-4 px-8 py-10 rounded-2xl"
      style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
      <p className="text-red-400 text-sm">{message}</p>
      <button onClick={() => window.location.reload()}
        className="px-4 py-2 rounded-xl text-xs text-white/50 hover:text-white/80 transition-colors"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
        Retry
      </button>
    </div>
  )
}
