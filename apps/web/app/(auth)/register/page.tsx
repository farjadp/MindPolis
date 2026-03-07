// ============================================================================
// MindPolis: app/(auth)/register/page.tsx
// Version: 3.0.0 — 2026-03-07
// Why: Registration — full dark design, split layout, feature checklist.
// Env / Identity: React Client Component
// ============================================================================

"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [name,    setName]    = useState("")
  const [email,   setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError("")
    const result = await signIn("credentials", { email, password: "register", name, redirect: false })
    setLoading(false)
    if (result?.error) setError("Registration failed. Please try again.")
    else { router.push("/dashboard"); router.refresh() }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#09090f" }}>

      {/* Left brand */}
      <div className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between p-12 relative overflow-hidden border-r border-white/[0.05]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-black">MP</span>
            </div>
          </div>
          <span className="text-white/80 font-semibold text-sm">MindPolis</span>
        </div>
        <div className="relative space-y-5">
          <p className="text-xl font-semibold text-white/80 leading-snug">
            Save your results and track how your views evolve over time.
          </p>
          <div className="space-y-3">
            {["Free forever", "Track results over time", "No spam, ever", "Science-backed assessments"].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-white/40">
                <svg className="w-3.5 h-3.5 text-violet-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-white/15">© {new Date().getFullYear()} MindPolis</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-7">

          <div>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-white/35 text-sm mt-1">Free forever. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Your name" id="name" type="text" value={name} onChange={setName} placeholder="Alex Smith" />
            <Field label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />

            {error && (
              <div className="rounded-xl px-3.5 py-2.5 text-sm text-red-400"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                boxShadow: loading ? "none" : "0 0 30px rgba(124,58,237,0.3)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Creating account…" : "Get started free"}
            </button>
          </form>

          <p className="text-center text-sm text-white/30">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">Sign in</Link>
          </p>
          <p className="text-center text-xs text-white/20">
            <Link href="/assessment" className="hover:text-white/40 transition-colors">← Continue without account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({
  label, id, type, value, onChange, placeholder, required
}: {
  label: string; id: string; type: string; value: string
  onChange: (v: string) => void; placeholder: string; required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</label>
      <input
        id={id} type={type} value={value} required={required}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/20 outline-none transition-all"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
        onFocus={e => { e.currentTarget.style.border = "1px solid rgba(124,58,237,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)" }}
        onBlur={e  => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.09)"; e.currentTarget.style.boxShadow = "none" }}
      />
    </div>
  )
}
