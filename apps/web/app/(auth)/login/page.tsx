// ============================================================================
// MindPolis: app/(auth)/login/page.tsx
// Version: 4.0.0 — 2026-03-07
// Why: Sign-in — editorial dark, amber CTA, split layout.
// Env / Identity: React Client Component
// ============================================================================

"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get("callbackUrl") ?? "/dashboard"
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true); setError("")
    const result = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (result?.error) setError("Sign in failed. Please check your credentials.")
    else { router.push(callbackUrl); router.refresh() }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#111" }}>

      {/* Left panel */}
      <div className="hidden lg:flex w-80 xl:w-96 shrink-0 flex-col justify-between p-10"
        style={{ background: "#0d0d0d", borderRight: "1px solid #1e1e1e" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-black font-black text-[10px]"
            style={{ background: "#f59e0b" }}>MP</div>
          <span className="text-white/70 font-semibold text-sm">MindPolis</span>
        </div>
        <div className="space-y-4">
          <p className="text-white/70 text-lg font-semibold leading-snug">
            Sign in to access your saved assessment results.
          </p>
          <div className="space-y-2.5">
            {["Track results over time", "Compare across assessments", "Access full interpretation"].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-white/30">
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#f59e0b" }} />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/15">© {new Date().getFullYear()} MindPolis</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">

          <div>
            <h1 className="text-xl font-bold text-white/85">Welcome back</h1>
            <p className="text-white/30 text-sm mt-1">Sign in to access your saved results.</p>
          </div>

          <div className="px-4 py-3 rounded text-xs text-amber-400/70"
            style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)" }}>
            <strong className="text-amber-400/90">Dev mode:</strong> Enter any email — account created automatically.
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Field label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
            <Field label="Password" id="password" type="password" value={password} onChange={setPassword} placeholder="anything for local dev" />

            {error && (
              <div className="px-3.5 py-2.5 rounded text-sm text-red-400"
                style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: "#f59e0b" }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="space-y-2 text-center">
            <p className="text-sm text-white/25">
              No account?{" "}
              <Link href="/register" className="font-medium" style={{ color: "#f59e0b" }}>Create one free</Link>
            </p>
            <p className="text-xs text-white/15">
              <Link href="/assessment" className="hover:text-white/35 transition-colors">← Continue without account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, id, type, value, onChange, placeholder, required }: {
  label: string; id: string; type: string; value: string
  onChange: (v: string) => void; placeholder: string; required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} type={type} value={value} required={required}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded px-3.5 py-2.5 text-sm text-white/75 placeholder-white/20 outline-none transition-all"
        style={{ background: "#161616", border: "1px solid #2a2a2a" }}
        onFocus={e => { e.currentTarget.style.border = "1px solid rgba(245,158,11,0.4)"; e.currentTarget.style.background = "#1a1a1a" }}
        onBlur={e  => { e.currentTarget.style.border = "1px solid #2a2a2a"; e.currentTarget.style.background = "#161616" }}
      />
    </div>
  )
}
