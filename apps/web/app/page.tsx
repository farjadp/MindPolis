// ============================================================================
// MindPolis: app/page.tsx
// Version: 5.0.0 — 2026-03-07
// Why: Landing page — analytical intelligence aesthetic. Navy base, blue accent.
//      Think Bloomberg / Our World in Data — serious civic intelligence tool.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0F172A", color: "#E5E7EB" }}>

      {/* ── Nav ── */}
      <nav className="px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{ background: "rgba(15,23,42,0.95)", borderBottom: "1px solid #1E293B", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded flex items-center justify-center font-black text-[11px] text-white"
            style={{ background: "#3B82F6" }}>MP</div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: "#E5E7EB" }}>MindPolis</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login"
            className="px-3 py-1.5 text-sm transition-colors hover:text-white"
            style={{ color: "#9CA3AF" }}>Sign in</Link>
          <Link href="/assessment"
            className="px-4 py-1.5 rounded text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: "#3B82F6" }}>
            Begin assessment
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 md:px-12 py-20 md:py-28 max-w-5xl dot-grid">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-[11px] font-semibold mb-8"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#3B82F6" }}>
          Research-grade · No account required · Free
        </div>

        <h1 className="text-5xl md:text-[60px] font-bold leading-[1.05] tracking-tight mb-6"
          style={{ color: "#E5E7EB" }}>
          Political cognition<br />
          is more complex<br />
          than left and right.
        </h1>

        <p className="text-lg max-w-xl leading-relaxed mb-10" style={{ color: "#9CA3AF" }}>
          MindPolis measures where you stand across 8 dimensions —
          the real axes of modern political disagreement. Built on political
          psychology research, not internet quizzes.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/assessment"
            className="px-6 py-3 rounded font-semibold text-sm text-white transition-opacity hover:opacity-85"
            style={{ background: "#3B82F6" }}>
            Take a free assessment →
          </Link>
          <Link href="#axes"
            className="px-6 py-3 rounded font-semibold text-sm transition-colors hover:text-white"
            style={{ border: "1px solid #334155", color: "#9CA3AF" }}>
            See the 8 dimensions
          </Link>
        </div>

        <div className="flex items-center gap-10 mt-14 pt-10" style={{ borderTop: "1px solid #1E293B" }}>
          {[["48", "research questions"], ["8", "political dimensions"], ["<10", "minutes"]].map(([n, l]) => (
            <div key={l}>
              <span className="mono text-2xl font-bold" style={{ color: "#3B82F6" }}>{n}</span>
              <span className="text-sm ml-2" style={{ color: "#6B7280" }}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── The problem ── */}
      <section className="px-6 md:px-12 py-16" style={{ background: "#080D18", borderTop: "1px solid #1E293B", borderBottom: "1px solid #1E293B" }}>
        <div className="max-w-3xl">
          <p className="label mb-4">The problem</p>
          <h2 className="text-2xl font-bold mb-5 leading-snug" style={{ color: "#E5E7EB" }}>
            The Political Compass reduces politics to 2 axes.<br className="hidden md:block" />
            Real political cognition has at least 8.
          </h2>
          <p className="leading-relaxed max-w-2xl" style={{ color: "#9CA3AF" }}>
            Most political tests ask whether you agree with statements designed to confirm your existing label.
            MindPolis presents genuine trade-off scenarios — situations where no option is purely correct —
            to reveal the underlying value structures that actually drive political orientation.
            The result is a profile, not a position.
          </p>
        </div>
      </section>

      {/* ── The 8 axes ── */}
      <section id="axes" className="px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label mb-2">The framework</p>
              <h2 className="text-2xl font-bold" style={{ color: "#E5E7EB" }}>8 dimensions of political cognition</h2>
            </div>
            <Link href="/assessment" className="hidden md:block text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: "#3B82F6" }}>
              Take the assessment →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: "#1E293B" }}>
            {AXES.map((axis, i) => (
              <div key={axis.id} className="p-6 space-y-3" style={{ background: "#111827" }}>
                <div className="flex items-start justify-between">
                  <span className="mono text-[11px] font-bold" style={{ color: "#3B82F6" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mono text-[10px]" style={{ color: "#374151" }}>{axis.id}</span>
                </div>
                <h3 className="font-bold text-base leading-tight" style={{ color: "#E5E7EB" }}>{axis.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{axis.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px]" style={{ color: "#6B7280" }}>{axis.minLabel}</span>
                  <div className="flex-1 mx-3 h-px" style={{ background: "#334155" }} />
                  <span className="text-[11px]" style={{ color: "#6B7280" }}>{axis.maxLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 md:px-12 py-16" style={{ borderTop: "1px solid #1E293B" }}>
        <div className="max-w-4xl mx-auto">
          <p className="label mb-10">How it works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                n: "01",
                title: "Scenario-based questions",
                body: "You're presented with realistic policy trade-offs and dilemmas — not loaded statements. Each question has no objectively correct answer, only value-revealing choices.",
              },
              {
                n: "02",
                title: "Cross-axis scoring",
                body: "24 of 48 questions measure multiple dimensions simultaneously. This detects inconsistency patterns and provides a more accurate profile than single-axis tests.",
              },
              {
                n: "03",
                title: "Instant profile",
                body: "Your results are scored immediately in the browser. No account needed. Create a free account afterward to save your results and track changes over time.",
              },
            ].map((s) => (
              <div key={s.n} className="space-y-3">
                <span className="mono text-3xl font-bold" style={{ color: "#1E293B" }}>{s.n}</span>
                <h3 className="font-bold" style={{ color: "#E5E7EB" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Methodology ── */}
      <section className="px-6 md:px-12 py-16" style={{ borderTop: "1px solid #1E293B", background: "#080D18" }}>
        <div className="max-w-4xl mx-auto">
          <p className="label mb-8">Methodology</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                title: "Academic grounding",
                body: "The framework draws from Haidt's Moral Foundations Theory, Inglehart's World Values Survey dimensions, Jost's political cognition research, and Stenner's authoritarianism studies. Question design follows established item-writing protocols for political psychology instruments.",
              },
              {
                title: "Current limitations",
                body: "MindPolis v0.1 is a theory-informed instrument, not yet a formally validated psychometric tool. It has not undergone pilot testing, factor analysis, or test-retest reliability assessment. Results should be interpreted as directional, not diagnostic.",
              },
              {
                title: "Scoring design",
                body: "Each question option carries weighted scores for its primary axis (±2) and secondary axes (±1). Final axis scores are normalized to [−1, +1]. Cross-axis questions contribute to consistency probe detection across the profile.",
              },
              {
                title: "What it is not",
                body: "MindPolis does not tell you your \"correct\" political position, predict voting behavior, or classify you into a party affiliation. It maps the underlying value structures — the cognitive architecture beneath surface-level political opinions.",
              },
            ].map(m => (
              <div key={m.title} className="space-y-2.5">
                <h3 className="font-semibold text-sm" style={{ color: "#E5E7EB" }}>{m.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-12 py-20" style={{ borderTop: "1px solid #1E293B" }}>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 leading-snug" style={{ color: "#E5E7EB" }}>
            48 questions.<br />8 dimensions.<br />Your complete political profile.
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: "#9CA3AF" }}>
            No sign-up required. Takes under 10 minutes.
            Create a free account afterward to save your results.
          </p>
          <Link href="/assessment"
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm text-white transition-opacity hover:opacity-85"
            style={{ background: "#3B82F6" }}>
            Begin assessment →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 md:px-12 py-6 flex items-center justify-between text-xs"
        style={{ borderTop: "1px solid #1E293B", color: "#374151" }}>
        <span>© {new Date().getFullYear()} MindPolis</span>
        <span>Research-grade political cognition assessment · v0.1 beta</span>
      </footer>
    </div>
  )
}

const AXES = [
  {
    id: "economic_organization",
    label: "Economic Organization",
    description: "Who should control the allocation of goods and capital? How should production, distribution, and ownership be structured in a society?",
    minLabel: "Market",
    maxLabel: "State",
  },
  {
    id: "authority_liberty",
    label: "Authority & Liberty",
    description: "How should society balance individual freedoms against collective order? Where does legitimate authority end and personal autonomy begin?",
    minLabel: "Civil liberty",
    maxLabel: "Social order",
  },
  {
    id: "tradition_change",
    label: "Tradition & Change",
    description: "How should societies relate to inherited institutions, norms, and practices? Is continuity a virtue or an obstacle to justice?",
    minLabel: "Continuity",
    maxLabel: "Transformation",
  },
  {
    id: "nationalism_globalism",
    label: "Nationalism & Globalism",
    description: "Where does legitimate political authority end — at the national border or beyond it? How should sovereignty relate to international integration?",
    minLabel: "Sovereignty",
    maxLabel: "Integration",
  },
  {
    id: "justice_model",
    label: "Justice Model",
    description: "What is the purpose of punishment and how should wrongs be addressed? Does justice require retribution, restoration, or prevention?",
    minLabel: "Rehabilitation",
    maxLabel: "Deterrence",
  },
  {
    id: "ecology_growth",
    label: "Ecology & Growth",
    description: "How should societies balance environmental limits with economic development? Is growth compatible with sustainability, or fundamentally in tension with it?",
    minLabel: "Growth",
    maxLabel: "Ecology",
  },
  {
    id: "institutional_trust",
    label: "Institutional Trust",
    description: "Which systems of governance deserve our confidence and deference? How much authority should be delegated to formal institutions?",
    minLabel: "Skeptical",
    maxLabel: "Trusting",
  },
  {
    id: "diversity_cohesion",
    label: "Diversity & Cohesion",
    description: "How should societies manage cultural difference and social unity? Is pluralism a source of strength or of fragmentation?",
    minLabel: "Cohesion",
    maxLabel: "Pluralism",
  },
]
