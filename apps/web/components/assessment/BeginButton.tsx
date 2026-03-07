// ============================================================================
// MindPolis: components/assessment/BeginButton.tsx
// Version: 2.0.0 — 2026-03-07
// Why: Client CTA button — navigates directly to take page. No auth required.
// Env / Identity: React Client Component
// ============================================================================

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function BeginButton({ assessmentId }: { assessmentId: string }) {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)

  function handleBegin() {
    setLoading(true)
    router.push(`/assessment/${assessmentId}/take`)
  }

  return (
    <button
      onClick={handleBegin}
      disabled={loading}
      className="relative inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-70"
      style={{
        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
        boxShadow: "0 0 30px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      {loading ? (
        <>
          <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          Loading…
        </>
      ) : (
        <>
          Begin Assessment
          <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </>
      )}
    </button>
  )
}
