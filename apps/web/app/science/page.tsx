// ============================================================================
// MindPolis: app/science/page.tsx
// Version: 1.0.0
// Why: Dedicated page to explain the scientific research & modeling frameworks
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"

export default function SciencePage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50/30 text-gray-900 selection:bg-blue-100 selection:text-blue-900 pb-32">

            {/* ── Nav ── */}
            <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 border-b border-gray-200 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-[6px] flex items-center justify-center font-black text-[10px] bg-gray-900 text-white">MP</div>
                    <span className="font-bold tracking-tight text-gray-900 text-sm">MindPolis</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/assessment"
                        className="text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-[6px] bg-blue-600 text-white shadow hover:opacity-90 active:scale-95 transition-all">
                        Take Assessment
                    </Link>
                </div>
            </nav>

            {/* ── Content ── */}
            <main className="flex-1 w-full max-w-[800px] mx-auto px-6 py-16 md:py-24 space-y-24">

                <header className="mb-16 space-y-6 text-center max-w-2xl mx-auto">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Theoretical Framework</p>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 leading-tight">
                        The Science Behind MindPolis
                    </h1>
                    <p className="text-lg leading-relaxed text-gray-600 font-medium">
                        Our assessment model is built strictly on validated frameworks from social psychology, moral psychology, and political science. We avoid generic partisan labels in favor of identifying fundamental structural values.
                    </p>
                </header>

                <article className="space-y-24">

                    {/* Section 1: MFQ */}
                    <section className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-8 border-b border-gray-100 bg-gray-50/50 space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">1. Moral Foundations Theory (MFT)</h2>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                                <span>Jonathan Haidt & Jesse Graham</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <a href="https://www.amazon.com/Righteous-Mind-Divided-Politics-Religion/dp/0307455777" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                                    Book: The Righteous Mind (2012) ↗
                                </a>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="text-base font-medium leading-relaxed text-gray-700 space-y-4">
                                <p>
                                    Moral Foundations Theory was proposed to explain the evolutionary origins of and cross-cultural variation in human moral reasoning. It posits that there are multiple, distinct "taste buds" of morality.
                                </p>
                                <p>
                                    MindPolis uses these foundations to understand the innate moral intuitions driving policy preferences, recognizing that political differences are often differences in moral priorities rather than logic.
                                </p>
                            </div>

                            <div className="border border-gray-200 rounded-[12px] overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[10px] font-bold uppercase bg-gray-50 text-gray-500 tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4 border-b border-gray-200 w-1/3">Moral Axis</th>
                                            <th className="px-6 py-4 border-b border-gray-200 border-l border-gray-200">Psychological Focus</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { axis: "Care / Harm", focus: "Empathy, protecting the vulnerable, compassion, and sensitivity to suffering." },
                                            { axis: "Fairness / Cheating", focus: "Proportionality, justice, rights, and punishing free-riders (strongly related to reciprocal altruism)." },
                                            { axis: "Loyalty / Betrayal", focus: "Patriotism, self-sacrifice for the group, and maintaining in-group coalitions." },
                                            { axis: "Authority / Subversion", focus: "Deference to leading figures, respect for traditions, and maintaining hierarchical social order." },
                                            { axis: "Sanctity / Degradation", focus: "Purity, physical/spiritual contamination, and viewing the body as a temple rather than a playground." },
                                            { axis: "Liberty / Oppression", focus: "Resistance to domination, anti-authoritarianism, and the desire for autonomy." },
                                        ].map(row => (
                                            <tr key={row.axis} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-5 font-bold text-gray-900">{row.axis}</td>
                                                <td className="px-6 py-5 font-medium text-gray-600 border-l border-gray-100 leading-relaxed">{row.focus}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: SVS */}
                    <section className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-8 border-b border-gray-100 bg-gray-50/50 space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">2. Schwartz Theory of Basic Human Values</h2>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                                <span>Shalom H. Schwartz</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <a href="https://scholarworks.gvsu.edu/orpc/vol2/iss1/11/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                                    Academic Paper (1992) ↗
                                </a>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="text-base font-medium leading-relaxed text-gray-700 space-y-4">
                                <p>
                                    Recognized as one of the most reliable and highly cited cross-cultural models of human values in the social sciences. Schwartz identified a universal structure of basic motivational values recognized across cultures.
                                </p>
                                <p>
                                    These values are arranged in a circular structure, highlighting the conflicts and congruities among them (e.g., self-enhancement versus self-transcendence, openness to change versus conservation).
                                </p>
                            </div>

                            <div className="border border-gray-200 rounded-[12px] overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[10px] font-bold uppercase bg-gray-50 text-gray-500 tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4 border-b border-gray-200 w-1/3">Core Value</th>
                                            <th className="px-6 py-4 border-b border-gray-200 border-l border-gray-200">Defining Goal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { value: "Universalism", goal: "Understanding, appreciation, tolerance, and protection for the welfare of all people and for nature." },
                                            { value: "Benevolence", goal: "Preservation and enhancement of the welfare of people with whom one is in frequent personal contact." },
                                            { value: "Tradition / Conformity", goal: "Respect, commitment, and acceptance of the customs and ideas that traditional culture or religion provide." },
                                            { value: "Security", goal: "Safety, harmony, and stability of society, of relationships, and of self." },
                                            { value: "Power / Achievement", goal: "Social status and prestige, control or dominance over people and resources; personal success through demonstrating competence." },
                                            { value: "Self-Direction & Stimulation", goal: "Independent thought and action; choosing, creating, exploring, and seeking novelty and challenge." },
                                        ].map(row => (
                                            <tr key={row.value} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-5 font-bold text-gray-900">{row.value}</td>
                                                <td className="px-6 py-5 font-medium text-gray-600 border-l border-gray-100 leading-relaxed">{row.goal}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: WVS */}
                    <section className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-8 border-b border-gray-100 bg-gray-50/50 space-y-4">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">3. World Values Survey (WVS)</h2>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                                <span>Inglehart–Welzel Cultural Map</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <a href="https://www.worldvaluessurvey.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                                    Explore Dataset ↗
                                </a>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="text-base font-medium leading-relaxed text-gray-700 space-y-4">
                                <p>
                                    The WVS is the largest non-commercial, cross-national data series investigating human beliefs and values. Since 1981, it has tracked cultural value changes globally.
                                </p>
                                <p>
                                    MindPolis incorporates the fundamental Inglehart-Welzel axes to understand the tension between institutional survival and democratic self-expression.
                                </p>
                            </div>

                            <div className="border border-gray-200 rounded-[12px] overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-[10px] font-bold uppercase bg-gray-50 text-gray-500 tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4 border-b border-gray-200 w-1/3">Survey Axis</th>
                                            <th className="px-6 py-4 border-b border-gray-200 border-l border-gray-200">Cultural Implications</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { area: "Traditional vs. Secular-Rational", example: "Societies scoring high on traditional values emphasize the importance of religion, parent-child ties, deference to authority, and traditional family values." },
                                            { area: "Survival vs. Self-Expression", example: "Survival values emphasize economic and physical security. Self-expression values give high priority to environmental protection, growing tolerance, and participation in decision-making." },
                                            { area: "Institutional Trust", example: "The degree to which individuals maintain confidence in government bodies, the press, and civil societal institutions." },
                                            { area: "Socio-political Security", example: "Attitudes toward national identity, immigration, authoritarian leadership, and the prioritization of structural order." },
                                        ].map(row => (
                                            <tr key={row.area} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-5 font-bold text-gray-900">{row.area}</td>
                                                <td className="px-6 py-5 font-medium text-gray-600 border-l border-gray-100 leading-relaxed">{row.example}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </article>

                {/* ── CTA ── */}
                <section className="pt-16 flex flex-col items-center text-center space-y-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Ready to map your political cognition?
                    </h2>
                    <Link href="/assessment"
                        className="inline-flex items-center justify-center px-10 py-5 rounded-[12px] font-bold uppercase tracking-widest text-[13px] bg-gray-900 text-white transition-opacity hover:opacity-90 shadow-sm">
                        Begin assessment →
                    </Link>
                </section>
            </main>

            {/* ── Footer ── */}
            <footer className="px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-auto border-t border-gray-200 bg-white">
                <div className="flex flex-wrap items-center gap-6">
                    <span>© {new Date().getFullYear()} MindPolis</span>
                    <span className="text-gray-900">The Science</span>
                    <Link href="/data" className="hover:text-gray-900 transition-colors">Data Explorer</Link>
                </div>
                <span>Research-grade political cognition assessment · v1.0</span>
            </footer>

        </div>
    )
}
