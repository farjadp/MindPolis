// ============================================================================
// MindPolis: app/page.tsx
// Version: 4.0.0 — 2026-03-07
// Why: Landing page — editorial dark, complete content about the platform,
//      8 axes explained, methodology, why it's different from Political Compass.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#111111", color: "#efefef" }}>

      {/* ── Nav ── */}
      <nav className="px-6 md:px-12 py-4 flex items-center justify-between sticky top-0 z-50"
        style={{ background: "rgba(17,17,17,0.95)", borderBottom: "1px solid #1e1e1e", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-black font-black text-[11px]"
            style={{ background: "#f59e0b" }}>MP</div>
          <span className="font-semibold text-sm text-white/80 tracking-tight">MindPolis</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="px-3 py-1.5 text-sm text-white/40 hover:text-white/80 transition-colors">Sign in</Link>
          <Link href="/assessment"
            className="px-4 py-1.5 rounded text-sm font-semibold text-black transition-colors hover:opacity-90"
            style={{ background: "#f59e0b" }}>
            Take free →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 md:px-12 py-20 md:py-28 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-[11px] font-semibold mb-8"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}>
          Research-grade · No account required · Free
        </div>

        <h1 className="text-5xl md:text-[64px] font-bold leading-[1.05] tracking-tight mb-6" style={{ color: "#f0f0f0" }}>
          Political cognition<br />
          is more complex<br />
          than left and right.
        </h1>

        <p className="text-lg text-white/45 max-w-xl leading-relaxed mb-10">
          MindPolis measures where you actually stand across 8 dimensions —
          the real axes of modern political disagreement. Built on political
          psychology research, not internet quizzes.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href="/assessment"
            className="px-6 py-3 rounded font-semibold text-sm text-black hover:opacity-90 transition-opacity"
            style={{ background: "#f59e0b" }}>
            Take a free assessment →
          </Link>
          <Link href="#axes"
            className="px-6 py-3 rounded font-semibold text-sm text-white/50 hover:text-white/80 transition-colors"
            style={{ border: "1px solid #2a2a2a" }}>
            See the 8 dimensions
          </Link>
        </div>

        <div className="flex items-center gap-8 mt-14 pt-10" style={{ borderTop: "1px solid #1e1e1e" }}>
          {[["48", "research questions"], ["8", "political dimensions"], ["<10", "minutes"]].map(([n, l]) => (
            <div key={l}>
              <span className="mono text-2xl font-bold" style={{ color: "#f59e0b" }}>{n}</span>
              <span className="text-white/30 text-sm ml-2">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── The problem ── */}
      <section className="px-6 md:px-12 py-16" style={{ borderTop: "1px solid #1e1e1e", borderBottom: "1px solid #1e1e1e" }}>
        <div className="max-w-3xl">
          <p className="label mb-4">The problem</p>
          <h2 className="text-2xl font-bold text-white/85 mb-5 leading-snug">
            The Political Compass reduces politics to 2 axes.<br className="hidden md:block" />
            Real political cognition has at least 8.
          </h2>
          <p className="text-white/45 leading-relaxed max-w-2xl">
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
              <h2 className="text-2xl font-bold text-white/85">8 dimensions of political cognition</h2>
            </div>
            <Link href="/assessment" className="hidden md:block text-sm font-medium" style={{ color: "#f59e0b" }}>
              Take the assessment →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ border: "1px solid #1e1e1e" }}>
            {AXES.map((axis, i) => (
              <div key={axis.id} className="p-6 space-y-3"
                style={{ background: "#171717", borderRight: i % 2 === 0 ? "1px solid #1e1e1e" : "none", borderBottom: i < 6 ? "1px solid #1e1e1e" : "none" }}>
                <div className="flex items-start justify-between">
                  <span className="mono text-[11px] font-bold" style={{ color: "#f59e0b" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-white/25 font-mono">{axis.id}</span>
                </div>
                <h3 className="font-bold text-white/85 text-base leading-tight">{axis.label}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{axis.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-white/25">{axis.minLabel}</span>
                  <div className="flex-1 mx-3 h-px" style={{ background: "#2a2a2a" }} />
                  <span className="text-[11px] text-white/25">{axis.maxLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 md:px-12 py-16" style={{ borderTop: "1px solid #1e1e1e" }}>
        <div className="max-w-4xl mx-auto">
          <p className="label mb-10">How it works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <span className="mono text-3xl font-bold" style={{ color: "#2a2a2a" }}>{s.n}</span>
                <h3 className="font-bold text-white/80">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Methodology ── */}
      <section className="px-6 md:px-12 py-16" style={{ borderTop: "1px solid #1e1e1e", background: "#141414" }}>
        <div className="max-w-4xl mx-auto">
          <p className="label mb-8">Methodology</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <h3 className="font-bold text-white/80">Academic grounding</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                The framework draws from Haidt's Moral Foundations Theory, Inglehart's World Values Survey dimensions,
                Jost's political cognition research, and Stenner's authoritarianism studies.
                Question design follows established item-writing protocols for political psychology instruments.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-white/80">Current limitations</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                MindPolis v0.1 is a theory-informed instrument, not yet a formally validated psychometric tool.
                It has not undergone pilot testing, factor analysis, or test-retest reliability assessment.
                Results should be interpreted as directional, not diagnostic.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-white/80">Scoring design</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Each question option carries weighted scores for its primary axis (±2) and secondary axes (±1).
                Final axis scores are normalized to [-1, +1]. Cross-axis questions contribute to
                consistency probe detection across the profile.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-white/80">What it is not</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                MindPolis does not tell you your "correct" political position, predict voting behavior,
                or classify you into a party affiliation. It maps the underlying value structures —
                the cognitive architecture beneath surface-level political opinions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-12 py-20" style={{ borderTop: "1px solid #1e1e1e" }}>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-white/85 mb-4 leading-snug">
            48 questions.<br />8 dimensions.<br />Your complete political profile.
          </h2>
          <p className="text-white/40 mb-8 leading-relaxed">
            No sign-up required. Takes under 10 minutes.
            Create a free account afterward to save your results.
          </p>
          <Link href="/assessment"
            className="inline-flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm text-black hover:opacity-90 transition-opacity"
            style={{ background: "#f59e0b" }}>
            Begin assessment →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 md:px-12 py-6 flex items-center justify-between text-xs text-white/20"
        style={{ borderTop: "1px solid #1e1e1e" }}>
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
    minLabel: "Retributive",
    maxLabel: "Restorative",
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
    description: "Which systems of governance deserve our confidence and deference? How much authority should be delegated to formal institutions versus distributed to individuals?",
    minLabel: "Distributed",
    maxLabel: "Institutional",
  },
  {
    id: "diversity_cohesion",
    label: "Diversity & Cohesion",
    description: "How should societies manage cultural difference and social unity? Is pluralism a source of strength or of fragmentation?",
    minLabel: "Cohesion",
    maxLabel: "Pluralism",
  },
]
