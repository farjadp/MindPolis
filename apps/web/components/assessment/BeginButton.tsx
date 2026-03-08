// ============================================================================
// MindPolis: components/assessment/BeginButton.tsx
// Version: 3.0.0 — 2026-03-07
// Why: Client CTA — navigates to take page. Amber style.
// Env / Identity: React Client Component
// ============================================================================

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function BeginButton({ assessmentId }: { assessmentId: string }) {
  const router    = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <button
      onClick={() => { setLoading(true); router.push(`/assessment/${assessmentId}/take`) }}
      disabled={loading}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded text-sm font-semibold text-black transition-opacity hover:opacity-85 disabled:opacity-60"
      style={{ background: "#f59e0b" }}>
      {loading
        ? <><span className="w-3.5 h-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" />Loading…</>
        : <>Begin Assessment <span className="opacity-70">→</span></>}
    </button>
  )
}
