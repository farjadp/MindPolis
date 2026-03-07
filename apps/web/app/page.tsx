// ============================================================================
// MindPolis: app/page.tsx
// Version: 3.0.0 — 2026-03-07
// Why: Landing page — full dark, dramatic hero, gradient accents.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#09090f" }}>

      {/* ── Nav ── */}
      <nav className="px-6 md:px-10 py-5 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600" />
            <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-black">MP</span>
          </div>
          <span className="text-white/90 font-semibold text-sm tracking-tight">MindPolis</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-white/50 hover:text-white/90 hover:bg-white/[0.06] transition-all text-sm font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/assessment"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all"
          >
            Try free →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">

        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px]" />
        </div>

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />

        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 text-violet-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Research-grade · No account required · Free
        </div>

        {/* Headline */}
        <h1 className="relative text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-4xl">
          <span className="text-white">Understand your</span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            political mind
          </span>
        </h1>

        <p className="relative text-white/50 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          8 scientific dimensions. 48 research questions.
          Your complete ideological profile — in under 10 minutes.
        </p>

        {/* CTAs */}
        <div className="relative flex flex-col sm:flex-row gap-3 mb-16">
          <Link
            href="/assessment"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold transition-all text-sm shadow-[0_0_40px_rgba(124,58,237,0.3)]"
          >
            Take a free assessment →
          </Link>
          <Link
            href="#how"
            className="px-7 py-3.5 rounded-xl border border-white/[0.1] text-white/60 hover:text-white/90 hover:bg-white/[0.05] font-medium transition-all text-sm"
          >
            How it works
          </Link>
        </div>

        {/* Stats */}
        <div className="relative flex items-center gap-10 text-center">
          {[["8", "Dimensions"], ["48", "Questions"], ["~8", "Minutes"]].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-bold text-white">{val}</p>
              <p className="text-xs text-white/30 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="px-6 md:px-10 py-20 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-white/25 mb-12">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "01",
                title: "Answer honestly",
                body: "48 scenario-based questions across economics, authority, ecology, justice, and more. No right or wrong answers.",
                gradient: "from-violet-500/20 to-indigo-500/10",
                border: "border-violet-500/15",
              },
              {
                step: "02",
                title: "Get your profile",
                body: "Your scores are mapped across 8 political dimensions with a radar chart, percentile bars, and written interpretation.",
                gradient: "from-indigo-500/20 to-cyan-500/10",
                border: "border-indigo-500/15",
              },
              {
                step: "03",
                title: "Save & track",
                body: "Create a free account after to save your results, compare over time, and see how your views evolve.",
                gradient: "from-cyan-500/20 to-violet-500/10",
                border: "border-cyan-500/15",
              },
            ].map((f) => (
              <div
                key={f.step}
                className={`rounded-2xl border ${f.border} bg-gradient-to-br ${f.gradient} p-6 space-y-4`}
              >
                <span className="text-[11px] font-mono text-white/25">{f.step}</span>
                <h3 className="text-white font-semibold text-base">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-16 border-t border-white/[0.06] text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to discover your profile?</h2>
        <p className="text-white/40 text-sm mb-8">No sign-up. No credit card. 100% anonymous.</p>
        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold transition-all text-sm shadow-[0_0_30px_rgba(124,58,237,0.25)]"
        >
          Begin assessment →
        </Link>
      </section>

      <footer className="px-6 py-5 border-t border-white/[0.05] text-center text-xs text-white/20">
        © {new Date().getFullYear()} MindPolis · Research-grade political cognition assessment
      </footer>
    </div>
  )
}
