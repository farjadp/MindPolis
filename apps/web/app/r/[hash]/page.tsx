// ============================================================================
// MindPolis: app/r/[hash]/page.tsx
// Version: 1.0.0
// Why: The ultra-fast, public, shareable result page. 
//      Generates metadata for Twitter/X OG cards and renders the Certificate.
// ============================================================================

import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: { hash: string } }): Promise<Metadata> {
    const result = await db.assessmentResult.findUnique({
        where: { shareHash: params.hash },
        include: { assessment: true, user: { select: { name: true } } }
    })

    if (!result) return { title: "Result Not Found | MindPolis" }

    const archetype = result.archetype || "Explorer"
    const name = result.user.name || "A user"

    return {
        title: `${archetype} | Verified Cognitive Profile`,
        description: `${name}'s political cognition maps as '${archetype}'. Explore the dimensions of fairness, loyalty, and liberty that drive this worldview.`,
        openGraph: {
            title: `${archetype} | Verified Cognitive Profile`,
            description: `Mapped by MindPolis. Dominant philosophical resonance identified.`,
            url: `https://mindpolis.com/r/${result.shareHash}`,
            siteName: "MindPolis",
            type: "article",
            images: [{ url: `/api/og?hash=${result.shareHash}` }]
        },
        twitter: {
            card: "summary_large_image",
            site: "@MindPolis",
            title: `${archetype} | Verified Cognitive Profile`,
            description: `Mapped by MindPolis. Discover where your moral topography aligns.`,
            images: [`/api/og?hash=${result.shareHash}`]
        }
    }
}

export default async function SharedResultPage({ params }: { params: { hash: string } }) {
    const result = await db.assessmentResult.findUnique({
        where: { shareHash: params.hash },
        include: { assessment: true, user: { select: { name: true } } }
    })

    if (!result) notFound()

    // Safely parse top dimensions
    let topDims: { key: string, value: number }[] = []
    try {
        if (result.topDimensions) {
            topDims = result.topDimensions as { key: string, value: number }[]
        }
    } catch (e) { }

    return (
        <div className="min-h-screen bg-[#FDFCF8] text-[#111111] selection:bg-[#E8E6E0]">
            {/* Top Nav (Minimal) */}
            <header className="py-6 px-4 md:px-8 border-b border-[#E8E6E0] flex justify-between items-center">
                <h1 className="font-serif font-black tracking-tighter text-2xl uppercase">MindPolis</h1>
                <a href="/" className="px-4 py-2 border border-[#111111] text-xs font-bold uppercase tracking-widest hover:bg-[#111111] hover:text-[#FDFCF8] transition-colors rounded-sm">
                    Map Your Cognition
                </a>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center">

                {/* The Certificate / Identity Card */}
                <div className="w-full max-w-2xl bg-white border border-[#E8E6E0] p-8 md:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col items-center text-center relative overflow-hidden">

                    {/* Subtle grid background to look academic */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#E8E6E0_1px,transparent_1px),linear-gradient(to_bottom,#E8E6E0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

                    <p className="relative z-10 text-xs font-mono text-[#666666] tracking-widest uppercase mb-4">
                        Verified Cognitive Profile • {new Date(result.computedAt).toLocaleDateString()}
                    </p>

                    {/* Generative Shape Placeholder */}
                    <div className="relative z-10 w-48 h-48 my-10 border border-[#E8E6E0] rounded-full flex items-center justify-center bg-[#FAFAFA]">
                        {/* Real implementation would draw a radar/polygon here. We'll simulate a chic geometry shape. */}
                        <div className="w-32 h-32 border border-[#111111] rotate-45 transform transition-transform hover:rotate-90 duration-1000" />
                        <div className="w-32 h-32 border border-[#111111] absolute -rotate-12 opacity-50" />
                    </div>

                    <p className="relative z-10 text-sm tracking-widest uppercase font-bold text-gray-500 mb-2">
                        Archetype Designation
                    </p>
                    <h2 className="relative z-10 text-5xl md:text-6xl font-serif font-black tracking-tight leading-none mb-4">
                        {result.archetype || "Unknown"}
                    </h2>

                    <p className="relative z-10 text-gray-600 max-w-md mx-auto mb-10 text-base md:text-lg">
                        This individual demonstrates significant systemic mapping aligned with {result.archetype}. Their cognitive prioritization emphasizes empirical logic and philosophical structuralism.
                    </p>

                    {/* Data Grid */}
                    <div className="relative z-10 w-full border-t border-[#E8E6E0] pt-8 grid grid-cols-3 gap-4">
                        {topDims.map((dim, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <span className="text-3xl font-light font-mono text-[#111111]">{Math.round(dim.value)}%</span>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mt-1">{dim.key}</span>
                            </div>
                        ))}
                    </div>

                    {/* Cryptographic Footer */}
                    <div className="relative z-10 w-full border-t border-[#E8E6E0] mt-10 pt-4 flex justify-between items-center text-[10px] font-mono text-gray-400">
                        <span>HASH: {result.shareHash.split("-")[0].toUpperCase()}...</span>
                        <span>CIT: MFT-WVS-36</span>
                    </div>

                </div>

                {/* Viral Loop / Compare Call to Action */}
                <div className="mt-16 text-center max-w-lg">
                    <h3 className="font-serif font-bold text-2xl mb-4">Compare Philosophical Topography</h3>
                    <p className="text-gray-600 mb-8">
                        How does your moral architecture align with {result.user.name || 'this profile'}?
                        Take the {result.assessment.title} to overlay your cognitive matrix and discover friction points.
                    </p>
                    <a href={`/assessment/${result.assessment.slug}`} className="inline-block px-8 py-4 bg-[#111111] text-[#FDFCF8] font-bold uppercase tracking-widest text-sm hover:scale-[1.02] transition-transform">
                        Map Your Cognition
                    </a>
                </div>
            </main>

            {/* Extreme Disclaimer Footer */}
            <footer className="py-10 text-center text-xs text-gray-400 font-mono max-w-2xl mx-auto border-t border-[#E8E6E0]">
                MindPolis captures a snapshot of political and moral cognition based on self-reported data using established psychological frameworks. It is an exploratory tool, not a clinical or definitive psychological diagnosis.
            </footer>
        </div>
    )
}
