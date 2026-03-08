// ============================================================================
// MindPolis: app/(dashboard)/assessment/[id]/take/page.tsx
// Version: 5.0.0 — 2026-03-07
// Why: Assessment-taking experience. Full dark, focused, editorial style.
//      No gradients. Amber accent for selection/progress.
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

  useEffect(() => {
    fetch(`/api/assessments/${params.id}`)
      .then(r => r.json())
      .then(({ assessment }) => { setAssessment(assessment); setLoading(false) })
      .catch(() => { setError("Could not load questions. Please refresh."); setLoading(false) })
  }, [params.id])

  if (loading) return <Shell><Loader /></Shell>
  if (error)   return <Shell><Err msg={error} /></Shell>
  if (!assessment?.questions.length) return <Shell><Err msg="No questions found." /></Shell>

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
    const responses = questions.map(q => {
      const a = answers.get(q.id)
      return { questionId: q.id, optionId: a?.optionId, value: a?.value }
    })
    try {
      const res    = await fetch("/api/assessments/score-preview", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body:   JSON.stringify({ assessmentId: assessment.id, responses }),
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
    <Shell>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50" style={{ background: "#1a1a1a" }}>
        <div className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "#f59e0b" }} />
      </div>

      <div className="max-w-[560px] mx-auto w-full pt-6">

        {/* Meta */}
        <div className="flex items-center justify-between mb-7">
          <span className="text-xs text-white/25 truncate">{assessment.title}</span>
          <span className="mono text-xs text-white/25 shrink-0 ml-4 tabular-nums">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Question card */}
        <div className="rounded-lg overflow-hidden" style={{ background: "#171717", border: "1px solid #252525" }}>

          {/* Axis / complexity tags */}
          {currentQ.metadata?.axis_id && (
            <div className="px-5 pt-5 pb-0 flex items-center gap-2">
              <span className="mono text-[10px] font-bold px-2 py-0.5 rounded"
                style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.15)" }}>
                {currentQ.metadata.axis_id.replace(/_/g, " ")}
              </span>
              {currentQ.metadata.complexity && (
                <span className="mono text-[10px] text-white/20 px-2 py-0.5 rounded"
                  style={{ border: "1px solid #252525" }}>
                  {currentQ.metadata.complexity}
                </span>
              )}
            </div>
          )}

          {/* Question text */}
          <div className="px-5 py-5">
            <p className="text-[15px] leading-relaxed text-white/80 font-medium">{currentQ.text}</p>
          </div>

          {/* Options */}
          <div className="px-5 pb-5 space-y-2">
            {options ? (
              options.map((opt) => {
                const sel = answered?.optionId === opt.id
                return (
                  <button key={opt.id} onClick={() => selectOption(opt.id)}
                    className="w-full text-left rounded px-4 py-3.5 text-sm transition-all duration-100 focus:outline-none"
                    style={{
                      background: sel ? "rgba(245,158,11,0.1)" : "#111111",
                      border: sel ? "1px solid rgba(245,158,11,0.35)" : "1px solid #2a2a2a",
                    }}>
                    <span className="inline-flex w-5 h-5 rounded items-center justify-center text-[10px] font-bold mr-3 align-middle shrink-0"
                      style={{
                        background: sel ? "#f59e0b" : "#1e1e1e",
                        color: sel ? "#000" : "#555",
                        border: sel ? "none" : "1px solid #333",
                      }}>
                      {opt.id}
                    </span>
                    <span style={{ color: sel ? "#f0f0f0" : "#909090" }}>{opt.text}</span>
                  </button>
                )
              })
            ) : (
              <LikertScale value={answered?.value} onChange={selectLikert} />
            )}
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0 || submitting}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-sm text-white/25 hover:text-white/60 hover:bg-white/[0.04] disabled:opacity-20 disabled:cursor-not-allowed transition-all">
            ← Back
          </button>

          <button
            onClick={handleNext}
            disabled={!hasAnswered || submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={hasAnswered && !submitting
              ? { background: "#f59e0b", color: "#000" }
              : { background: "#1e1e1e", color: "#444" }}>
            {submitting
              ? <><span className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />Calculating…</>
              : isLastQ ? "See my results →" : "Next →"}
          </button>
        </div>

        {error && (
          <div className="mt-5 px-4 py-3 rounded text-xs text-red-400 text-center"
            style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
            {error}
          </div>
        )}
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: "#111111" }}>
      {children}
    </div>
  )
}

function LikertScale({ value, onChange }: { value?: number; onChange: (v: number) => void }) {
  const labels = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between text-[11px] text-white/20">
        <span>Strongly disagree</span><span>Strongly agree</span>
      </div>
      <div className="flex gap-2">
        {[1,2,3,4,5].map(v => (
          <button key={v} onClick={() => onChange(v)} title={labels[v-1]}
            className="flex-1 h-11 rounded text-sm font-bold transition-all"
            style={{
              background: value === v ? "#f59e0b" : "#1a1a1a",
              color:      value === v ? "#000" : "#555",
              border:     value === v ? "none" : "1px solid #2a2a2a",
            }}>
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div className="text-center space-y-4">
      <div className="w-6 h-6 rounded border-2 border-white/10 border-t-amber-400 animate-spin mx-auto" />
      <p className="text-white/25 text-sm">Loading questions…</p>
    </div>
  )
}

function Err({ msg }: { msg: string }) {
  return (
    <div className="text-center space-y-4 px-6 py-10 rounded" style={{ border: "1px solid #2a2a2a" }}>
      <p className="text-red-400/80 text-sm">{msg}</p>
      <button onClick={() => window.location.reload()}
        className="px-4 py-2 rounded text-xs text-white/40 hover:text-white/70 transition-colors"
        style={{ border: "1px solid #2a2a2a" }}>
        Retry
      </button>
    </div>
  )
}
