// ============================================================================
// MindPolis: app/(auth)/login/page.tsx
// Version: 6.0.0
// Why: Sign-in — semantic light UI with Suspense boundary to fix prerender.
// Env / Identity: React Client Component
// ============================================================================

"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" /></div>}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
    <div className="min-h-screen flex bg-background">

      {/* Left panel */}
      <div className="hidden lg:flex w-80 xl:w-96 shrink-0 flex-col justify-between p-10 bg-secondary/30 border-r border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center font-black text-[10px] bg-primary text-primary-foreground">MP</div>
          <span className="font-semibold text-sm tracking-tight text-primary">MindPolis</span>
        </div>
        <div className="space-y-6">
          <p className="text-xl font-bold leading-tight tracking-tight text-primary">
            Sign in to access your saved assessment results.
          </p>
          <div className="space-y-3">
            {["Track results over time", "Compare across assessments", "Access full interpretation"].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm font-medium text-secondary-foreground">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs font-medium text-muted-foreground">© {new Date().getFullYear()} MindPolis</p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Welcome back</h1>
            <p className="text-sm mt-1.5 font-medium text-muted-foreground">Sign in to access your saved results.</p>
          </div>

          <div className="px-4 py-3 rounded border text-sm font-medium bg-primary/5 border-primary/20 text-primary">
            <strong>Dev mode:</strong> Enter any email — account created automatically.
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />
            <Field label="Password" id="password" type="password" value={password} onChange={setPassword} placeholder="anything for local dev" />

            {error && (
              <div className="px-4 py-3 rounded border text-sm text-destructive bg-destructive/5 border-destructive/20 font-medium">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded text-sm font-semibold bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 shadow-sm mt-2">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="space-y-4 text-center pt-2">
            <p className="text-sm font-medium text-muted-foreground">
              No account?{" "}
              <Link href="/register" className="font-semibold text-primary hover:underline underline-offset-4">Create one free</Link>
            </p>
            <p className="text-xs font-medium pt-2">
              <Link href="/assessment" className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">← Continue without account</Link>
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
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-primary">{label}</label>
      <input id={id} type={type} value={value} required={required}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded border px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground bg-background border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
      />
    </div>
  )
}
