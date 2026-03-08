// ============================================================================
// MindPolis: components/assessment/BeginButton.tsx
// Version: 5.0.0
// Why: Client CTA — navigates to take page. Refactored to semantic UI.
// Env / Identity: React Client Component
// ============================================================================

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function BeginButton({ assessmentId }: { assessmentId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <button
      onClick={() => { setLoading(true); router.push(`/assessment/${assessmentId}/take`) }}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 px-8 py-3 w-full sm:w-auto rounded text-sm font-semibold bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 shadow-sm"
    >
      {loading
        ? <><span className="w-4 h-4 rounded-full border-2 border-primary-foreground/20 border-t-primary-foreground animate-spin" />Loading…</>
        : <>Begin Assessment <span className="opacity-70 group-hover:translate-x-1 transition-transform">→</span></>}
    </button>
  )
}
