// ============================================================================
// MindPolis: app/(dashboard)/assessment/[id]/take/page.tsx
// Version: 6.0.0
// Why: Assessment-taking experience. Clean, focused, no-distraction light UI.
// Env / Identity: React Client Component — browser only
// ============================================================================

"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface OptionData { id: string; text: string; scores: Record<string, number> }
interface QuestionData {
  id: string; order: number; text: string; type: string
  dimensionKeys: string[]; isReversed: boolean
  metadata: { question_id?: string; axis_id?: string; subtype?: string; complexity?: string; options?: OptionData[] } | null
}
interface AssessmentData { id: string; slug: string; title: string; questions: QuestionData[] }

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

export default function TakePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [assessment, setAssessment] = useState<AssessmentData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, { optionId?: string; value?: number; confidence?: number }>>(new Map())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/assessments/${params.id}`)
      .then(r => r.json())
      .then(({ assessment }) => { setAssessment(assessment); setLoading(false) })
      .catch(() => { setError("Could not load questions. Please refresh."); setLoading(false) })
  }, [params.id])

  // Initialize submission loop for authenticated users
  useEffect(() => {
    if (status === "authenticated" && assessment && !submissionId) {
      fetch(`/api/assessments/${assessment.id}/start`, { method: "POST" })
        .then(r => r.json())
        .then(data => {
          if (data.submissionId) setSubmissionId(data.submissionId)
        })
        .catch(err => console.error("Failed to start assessment submission", err))
    }
  }, [status, assessment, submissionId])

  // Load saved progress
  useEffect(() => {
    if (loading || !assessment) return
    const saved = localStorage.getItem(`mindpolis_save_${assessment.id}`)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.answers) {
          const map = new Map<string, { optionId?: string; value?: number; confidence?: number }>()
          Object.entries(parsed.answers).forEach(([k, v]: [string, any]) => map.set(k, v))
          setAnswers(map)
        }
        if (typeof parsed.currentIndex === 'number') {
          setCurrentIndex(parsed.currentIndex)
        }
      } catch (e) {
        console.error("Failed to load saved progress", e)
      }
    }
  }, [loading, assessment])

  // Save progress
  useEffect(() => {
    if (loading || !assessment) return
    const obj = {
      currentIndex,
      answers: Object.fromEntries(answers)
    }
    localStorage.setItem(`mindpolis_save_${assessment.id}`, JSON.stringify(obj))
  }, [currentIndex, answers, loading, assessment])

  if (loading) return <Shell><Loader /></Shell>
  if (error) return <Shell><Err msg={error} /></Shell>
  if (!assessment?.questions.length) return <Shell><Err msg="No questions found." /></Shell>

  const questions = assessment.questions
  const total = questions.length
  const currentQ = questions[currentIndex]
  const isLastQ = currentIndex === total - 1
  const answered = answers.get(currentQ.id)

  // They must have selected an option AND a confidence level
  const hasAnsweredOption = answered !== undefined && (answered.optionId !== undefined || answered.value !== undefined)
  const hasConfidence = answered !== undefined && answered.confidence !== undefined
  const canProceed = hasAnsweredOption && hasConfidence

  const options = currentQ.metadata?.options ?? null
  const pct = Math.round(((currentIndex) / total) * 100)

  function selectOption(id: string) {
    setAnswers(p => {
      const prev = p.get(currentQ.id) || {}
      return new Map(p).set(currentQ.id, { ...prev, optionId: id, confidence: prev.confidence })
    })
  }

  function selectLikert(v: number) {
    setAnswers(p => {
      const prev = p.get(currentQ.id) || {}
      return new Map(p).set(currentQ.id, { ...prev, value: v, confidence: prev.confidence })
    })
  }

  function setConfidence(c: number) {
    setAnswers(p => {
      const prev = p.get(currentQ.id) || {}
      return new Map(p).set(currentQ.id, { ...prev, confidence: c })
    })
  }

  function handleNext() {
    if (!canProceed) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (isLastQ) handleSubmit()
    else setCurrentIndex(i => i + 1)
  }

  async function handleSubmit() {
    if (!assessment) return
    setSubmitting(true)
    const responses = questions.map(q => {
      const a = answers.get(q.id)
      return { questionId: q.id, optionId: a?.optionId, value: a?.value, confidence: a?.confidence }
    })

    try {
      if (status === "authenticated" && submissionId) {
        const res = await fetch("/api/assessments/submit", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assessmentId: assessment.id, submissionId, responses }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? "Submission failed")

        localStorage.removeItem(`mindpolis_save_${assessment.id}`)
        router.push(`/results/${data.result.id}`)
      } else {
        const res = await fetch("/api/assessments/score-preview", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assessmentId: assessment.id, responses }),
        })
        const result = await res.json()
        if (!res.ok) throw new Error(result.error ?? "Scoring failed")

        localStorage.removeItem(`mindpolis_save_${assessment.id}`)
        sessionStorage.setItem("mindpolis_preview", JSON.stringify(result))
        router.push("/results/preview")
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.")
      setSubmitting(false)
    }
  }

  return (
    <Shell>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[6px] z-50 bg-gray-100">
        <div className="h-full transition-all duration-700 ease-out bg-blue-600"
          style={{ width: `${pct}%` }} />
      </div>

      <div className="max-w-[720px] mx-auto w-full pt-12 pb-24 px-6 md:px-0">

        {submitting ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-12">
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce"></div>
            </div>
            <div className="text-center space-y-4">
              <p className="text-3xl font-bold text-gray-900 tracking-tight">Computing Ideology Map</p>
              <p className="text-lg text-gray-600 font-medium">Validating cognitive dimensions and applying confidence weights...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Meta & Progress */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <span className="text-sm font-bold uppercase tracking-widest text-gray-400">{assessment.title}</span>
              <span className="text-sm font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-[8px]">
                Question {currentIndex + 1} of {total}
              </span>
            </div>

            {/* Scenario Card */}
            <div className="rounded-[16px] border border-gray-200 bg-white shadow-sm overflow-hidden mb-8">
              <div className="p-8 md:p-10">
                <p className="text-2xl md:text-3xl leading-snug font-bold text-gray-900">{currentQ.text}</p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 pl-2">Select your response</p>
              {options ? (
                options.map((opt, idx) => {
                  const sel = answered?.optionId === opt.id
                  return (
                    <button key={opt.id} onClick={() => selectOption(opt.id)}
                      className={`w-full text-left rounded-[12px] p-6 transition-all duration-200 focus:outline-none flex items-start gap-6 border ${sel ? 'bg-blue-50/50 border-blue-600 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.15)] ring-1 ring-blue-600' : 'bg-white hover:border-gray-300 hover:shadow-sm border-gray-200 hover:-translate-y-0.5'}`}
                    >
                      <span className={`inline-flex w-8 h-8 rounded-[8px] shrink-0 items-center justify-center text-sm font-bold transition-colors border ${sel ? 'bg-blue-600 text-white border-transparent' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                      >
                        {LETTERS[idx] || "-"}
                      </span>
                      <span className={`text-lg font-medium leading-relaxed pt-0.5 ${sel ? 'text-blue-900' : 'text-gray-700'}`}>{opt.text}</span>
                    </button>
                  )
                })
              ) : (
                <div className="p-6 md:p-8 bg-white border border-gray-200 rounded-[12px] shadow-sm">
                  <LikertScale value={answered?.value} onChange={selectLikert} />
                </div>
              )}
            </div>

            {/* Confidence Slider */}
            <div className={`transition-all duration-500 ${hasAnsweredOption ? 'opacity-100 translate-y-0' : 'opacity-30 pointer-events-none translate-y-4'}`}>
              <div className="p-6 md:p-8 rounded-[12px] bg-white border border-gray-200 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 text-center">How confident are you in this judgment?</p>
                <div className="flex justify-between items-end mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
                  <span>Low</span>
                  <span>High</span>
                </div>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => setConfidence(v)}
                      className={`flex-1 h-16 rounded-[8px] text-xl font-bold border transition-all duration-200 ${answered?.confidence === v ? 'bg-gray-900 border-gray-900 text-white shadow-md scale-105' : 'bg-gray-50 hover:bg-gray-100 hover:border-gray-300 border-gray-200 text-gray-600'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nav */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
              <button
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0 || submitting}
                className="flex items-center justify-center font-bold uppercase tracking-widest gap-2 px-6 py-4 rounded-[8px] text-xs transition-colors disabled:opacity-0 hover:bg-gray-100 text-gray-500">
                ← Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed || submitting}
                className={`flex items-center justify-center font-bold uppercase tracking-widest gap-3 px-10 py-4 rounded-[8px] text-sm transition-all duration-300 disabled:cursor-not-allowed ${canProceed && !submitting ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-600/25 hover:-translate-y-0.5' : 'bg-gray-100 text-gray-400'}`}>
                {isLastQ ? "Submit Assessment" : "Next Question →"}
              </button>
            </div>

            {error && (
              <div className="mt-8 px-6 py-5 rounded-[8px] border text-sm text-red-600 bg-red-50 border-red-200 font-bold text-center">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 selection:bg-blue-100 selection:text-blue-900">
      {children}
    </div>
  )
}

function LikertScale({ value, onChange }: { value?: number; onChange: (v: number) => void }) {
  const labels = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
  return (
    <div className="space-y-6">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 px-2">
        <span>Strongly disagree</span><span>Strongly agree</span>
      </div>
      <div className="flex gap-3">
        {[1, 2, 3, 4, 5].map(v => (
          <button key={v} onClick={() => onChange(v)} title={labels[v - 1]}
            className={`flex-1 h-14 rounded-[8px] md:text-lg text-base font-bold transition-all duration-200 border ${value === v ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm ring-1 ring-blue-600/20' : 'bg-gray-50 hover:bg-gray-100 hover:border-gray-300 text-gray-600 border-gray-200'}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div className="text-center flex flex-col items-center py-40">
      <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin mb-8" />
      <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Initializing Instrument…</p>
    </div>
  )
}

function Err({ msg }: { msg: string }) {
  return (
    <div className="max-w-[500px] w-full mx-auto text-center space-y-6 px-10 py-16 rounded-[16px] border border-red-200 bg-red-50 mt-32">
      <p className="text-red-700 font-bold text-lg">{msg}</p>
      <button onClick={() => window.location.reload()}
        className="px-8 py-3 rounded-[8px] text-sm font-bold border border-red-300 bg-white text-red-700 hover:bg-red-50 transition-colors shadow-sm">
        Reload Session
      </button>
    </div>
  )
}
