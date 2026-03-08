// ============================================================================
// MindPolis: app/(auth)/register/page.tsx
// Version: 5.0.0 — 2026-03-07
// Why: Registration — analytical dark, blue CTA, structured split layout.
// Env / Identity: React Client Component
// ============================================================================

"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [name,     setName]     = useState("")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true); setError("")
    const result = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (result?.error) setError("Could not create account. Please try again.")
    else { router.push("/dashboard"); router.refresh() }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#0F172A" }}>

      {/* Left panel */}
      <div className="hidden lg:flex w-80 xl:w-96 shrink-0 flex-col justify-between p-10"
        style={{ background: "#080D18", borderRight: "1px solid #1E293B" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center font-black text-[10px] text-white"
            style={{ background: "#3B82F6" }}>MP</div>
          <span className="font-semibold text-sm" style={{ color: "#E5E7EB" }}>MindPolis</span>
        </div>
        <div className="space-y-4">
          <p className="text-lg font-semibold leading-snug" style={{ color: "#E5E7EB" }}>
            Track your political cognition over time.
          </p>
          <div className="space-y-2.5">
            {["Save all assessment results", "View full interpretations", "Compare across time"].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm" style={{ color: "#6B7280" }}>
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#3B82F6" }} />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs" style={{ color: "#374151" }}>© {new Date().getFullYear()} MindPolis</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">

          <div>
            <h1 className="text-xl font-bold" style={{ color: "#E5E7EB" }}>Create account</h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Free. No spam. Research purposes only.</p>
          </div>

          <div className="px-4 py-3 rounded text-xs"
            style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.15)", color: "#93C5FD" }}>
            <strong style={{ color: "#60A5FA" }}>Dev mode:</strong> Enter any email — account created automatically.
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Field label="Name" id="name" type="text" value={name} onChange={setName} placeholder="Your name (optional)" />
            <Field label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
            <Field label="Password" id="password" type="password" value={password} onChange={setPassword} placeholder="anything for local dev" />

            {error && (
              <div className="px-3.5 py-2.5 rounded text-sm text-red-400"
                style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ background: "#3B82F6" }}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="space-y-2 text-center">
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Already have an account?{" "}
              <Link href="/login" className="font-medium" style={{ color: "#3B82F6" }}>Sign in</Link>
            </p>
            <p className="text-xs" style={{ color: "#374151" }}>
              <Link href="/assessment" className="transition-colors hover:text-white/40">← Continue without account</Link>
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
        className="w-full rounded px-3.5 py-2.5 text-sm outline-none transition-all"
        style={{ background: "#111827", border: "1px solid #334155", color: "#E5E7EB" }}
        onFocus={e => { e.currentTarget.style.border = "1px solid rgba(59,130,246,0.5)"; e.currentTarget.style.background = "#1E293B" }}
        onBlur={e  => { e.currentTarget.style.border = "1px solid #334155";              e.currentTarget.style.background = "#111827" }}
      />
    </div>
  )
}
