// ============================================================================
// MindPolis: app/page.tsx
// Version: 6.0.0
// Why: Landing page — clean, minimal, editorial look. Narrower reading lines.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  const session = await auth()
  if (session) redirect("/dashboard")

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* ── Nav ── */}
      <nav className="px-6 md:px-8 py-5 flex items-center justify-between sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded flex items-center justify-center font-bold text-[9px] bg-primary text-primary-foreground tracking-tighter">MP</div>
          <span className="font-semibold text-sm tracking-tight text-primary">MindPolis</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login"
            className="text-xs transition-colors hover:text-primary text-muted-foreground font-medium">Sign in</Link>
          <Link href="/assessment"
            className="px-3 py-1.5 rounded text-xs font-semibold bg-primary text-primary-foreground transition-opacity hover:opacity-90">
            Begin assessment
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 md:px-8 py-24 md:py-32 w-full max-w-2xl mx-auto flex flex-col items-start overflow-visible">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-[10px] uppercase tracking-wider font-semibold mb-8 bg-black/5 text-muted-foreground">
          Research-grade · No account required · Free
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.05] tracking-tight mb-8 text-primary">
          Political cognition<br />
          is more complex<br />
          than left and right.
        </h1>

        <p className="text-lg leading-relaxed mb-10 text-muted-foreground max-w-xl">
          MindPolis measures where you stand across 8 dimensions —
          the real axes of modern political disagreement. Built on political
          psychology research, not internet quizzes.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/assessment"
            className="px-6 py-3 rounded font-semibold text-sm bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 shadow-sm">
            Take a free assessment →
          </Link>
          <Link href="#axes"
            className="px-6 py-3 rounded font-medium text-sm border border-border text-muted-foreground transition-colors hover:text-primary hover:bg-black/5">
            See the 8 dimensions
          </Link>
        </div>

        <div className="flex items-center gap-8 mt-20 pt-10 border-t border-border w-full">
          {[["48", "research questions"], ["8", "political dimensions"], ["<10", "minutes"]].map(([n, l]) => (
            <div key={l} className="flex flex-col">
              <span className="mono text-xl font-bold text-primary">{n}</span>
              <span className="text-xs text-muted-foreground mt-1 font-medium">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── The problem ── */}
      <section className="px-6 md:px-8 py-20 border-y border-border bg-secondary">
        <div className="max-w-2xl mx-auto flex flex-col">
          <p className="label mb-6">The problem</p>
          <h2 className="text-2xl font-bold mb-6 leading-snug text-primary">
            The Political Compass reduces politics to 2 axes.<br className="hidden sm:block" />
            Real political cognition has at least 8.
          </h2>
          <p className="text-base leading-relaxed text-secondary-foreground">
            Most political tests ask whether you agree with statements designed to confirm your existing label.
            MindPolis presents genuine trade-off scenarios — situations where no option is purely correct —
            to reveal the underlying value structures that actually drive political orientation.
            The result is a profile, not a position.
          </p>
        </div>
      </section>

      {/* ── The 8 axes ── */}
      <section id="axes" className="px-6 md:px-8 py-24 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="label mb-3">The framework</p>
              <h2 className="text-3xl font-bold text-primary tracking-tight">8 dimensions</h2>
            </div>
            <Link href="/assessment" className="text-sm font-medium transition-colors hover:text-black/70 text-primary underline underline-offset-4 decoration-border hover:decoration-black/40 pb-1">
              Take the assessment →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded overflow-hidden shadow-sm">
            {AXES.map((axis, i) => (
              <div key={axis.id} className="p-8 space-y-4 bg-card hover:bg-black/[0.01] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="mono text-xs font-bold text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mono text-[10px] text-muted-foreground/60">{axis.id}</span>
                </div>
                <h3 className="font-bold text-lg leading-tight text-primary">{axis.label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{axis.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{axis.minLabel}</span>
                  <div className="flex-1 mx-3 h-px bg-border/50" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{axis.maxLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 md:px-8 py-20 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <p className="label mb-12">How it works</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                n: "01",
                title: "Scenario-based",
                body: "You're presented with realistic policy trade-offs and dilemmas — not loaded statements. No purely correct answer, only value-revealing choices.",
              },
              {
                n: "02",
                title: "Cross-axis scoring",
                body: "Multiple dimensions are measured simultaneously. This detects inconsistency patterns and provides a highly nuanced profile.",
              },
              {
                n: "03",
                title: "Instant profile",
                body: "Your results are scored immediately in the browser. Create an optional free account afterward to save and track your results over time.",
              },
            ].map((s) => (
              <div key={s.n} className="space-y-4">
                <span className="mono text-sm font-bold text-muted-foreground border-b border-border pb-2 block w-6">{s.n}</span>
                <h3 className="font-bold text-primary">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get ── */}
      <section className="px-6 md:px-8 py-24 border-t border-border bg-secondary/50">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-12 md:gap-8">
          <div className="md:w-1/3">
            <p className="label mb-4">What you get</p>
            <h2 className="text-2xl font-bold leading-snug text-primary">Beyond labels and tribal lines.</h2>
            <p className="text-base mt-4 leading-relaxed text-secondary-foreground">
              Instead of reducing your worldview to a single dot on a 2D compass, you receive a rigorous breakdown of the structural morals and socio-economic frameworks that inform your choices.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center mb-4">
                <span className="block w-2.5 h-2.5 rounded-sm bg-primary" />
              </div>
              <h4 className="font-bold text-primary">Dimensional Breakdown</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">See precisely where you land across all 8 major axes, from economic organization to institutional trust.</p>
            </div>
            <div className="space-y-2">
              <div className="h-6 w-6 rounded border border-border flex items-center justify-center mb-4">
                <div className="w-3 h-0.5 bg-primary rounded-full rotate-45" />
                <div className="w-3 h-0.5 bg-primary rounded-full -rotate-45 absolute" />
              </div>
              <h4 className="font-bold text-primary">Nuance & Contradictions</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">Discover where your values challenge standard partisan dogmas and where you hold conflicting moral priorities.</p>
            </div>
            <div className="space-y-2">
              <div className="h-6 w-6 rounded bg-black/5 flex items-center justify-center mb-4">
                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="font-bold text-primary">Actionable Summaries</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">Read generated executive summaries that capture the essence of your political cognition in a few paragraphs.</p>
            </div>
            <div className="space-y-2">
              <div className="h-6 w-6 rounded bg-transparent border border-primary/20 flex flex-col items-center justify-center gap-[2px] mb-4">
                <span className="block w-2.5 h-[2px] rounded-full bg-primary" />
                <span className="block w-2.5 h-[2px] rounded-full bg-primary" />
                <span className="block w-2.5 h-[2px] rounded-full bg-primary" />
              </div>
              <h4 className="font-bold text-primary">Historical Tracking</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">View your past assessment data chronologically to analyze how your fundamental values evolve over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Methodology ── */}
      <section className="px-6 md:px-8 py-24 border-t border-border bg-secondary">
        <div className="max-w-3xl mx-auto flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <p className="label">Methodology</p>
            <Link href="/science" className="text-sm font-medium transition-colors hover:text-black/70 text-primary underline underline-offset-4 decoration-border hover:decoration-black/40 pb-1">
              Read more about our scientific framework →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              {
                title: "Academic grounding",
                body: "The framework draws from Haidt's Moral Foundations Theory, Inglehart's World Values Survey dimensions, Jost's political cognition research, and Stenner's authoritarianism studies.",
              },
              {
                title: "Current limitations",
                body: "MindPolis v0.1 is a theory-informed instrument, not yet a formally validated psychometric tool. It lacks factor analysis or test-retest reliability measurement.",
              },
              {
                title: "Scoring design",
                body: "Each question option carries weighted scores for its primary axis (±2) and secondary axes (±1). Final axis scores are normalized to [−1, +1].",
              },
              {
                title: "What it is not",
                body: "MindPolis does not tell you your \"correct\" political position, predict voting behavior, or classify you into a party affiliation. It maps the underlying value structures.",
              },
            ].map(m => (
              <div key={m.title} className="space-y-3">
                <h3 className="font-semibold text-sm text-primary">{m.title}</h3>
                <p className="text-sm leading-relaxed text-secondary-foreground">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-8 py-32 bg-background">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight tracking-tight text-primary">
            48 questions.<br />8 dimensions.<br />Your complete political profile.
          </h2>
          <p className="mb-10 text-base leading-relaxed text-muted-foreground max-w-md">
            No sign-up required. Takes under 10 minutes.
            Create a free account afterward to save your results.
          </p>
          <Link href="/assessment"
            className="inline-flex items-center justify-center px-8 py-4 rounded font-semibold text-sm bg-primary text-primary-foreground transition-opacity hover:opacity-90 shadow-sm w-full sm:w-auto">
            Begin assessment →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs bg-background border-t border-border text-muted-foreground font-medium">
        <div className="flex flex-wrap items-center gap-6">
          <span>© {new Date().getFullYear()} MindPolis</span>
          <Link href="/science" className="hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-black/40">The Science</Link>
          <Link href="/data" className="hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-black/40">Data Explorer</Link>
        </div>
        <span>Research-grade political cognition assessment · v1.0</span>
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
