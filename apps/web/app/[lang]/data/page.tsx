"use client"

import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DataExplorationPage() {
    // Mock data for visualizations
    const ageData = [
        { group: '18-24', count: 1240 },
        { group: '25-34', count: 3100 },
        { group: '35-44', count: 2800 },
        { group: '45-54', count: 1950 },
        { group: '55-64', count: 1100 },
        { group: '65+', count: 650 },
    ];

    const distributionData = [
        { cluster: 'Technocratic Liberal', percentage: 22 },
        { cluster: 'Civic Republican', percentage: 18 },
        { cluster: 'Social Democrat', percentage: 15 },
        { cluster: 'Classical Conservative', percentage: 14 },
        { cluster: 'Libertarian', percentage: 11 },
        { cluster: 'Progressive Populist', percentage: 10 },
        { cluster: 'Traditionalist', percentage: 6 },
        { cluster: 'Other', percentage: 4 },
    ];

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
            <main className="flex-1 w-full max-w-[1000px] mx-auto px-6 py-16 md:py-24 space-y-24">

                <header className="mb-16 space-y-6 text-center max-w-2xl mx-auto">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Global Data</p>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 leading-tight">
                        MindPolis Data Explorer
                    </h1>
                    <p className="text-lg leading-relaxed text-gray-600 font-medium">
                        Explore the anonymized, aggregated results of thousands of political cognition assessments. Discover trends across age groups and ideological clusters.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Distribution Section */}
                    <section className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-8 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">Ideological Distribution</h2>
                            <p className="text-sm font-medium text-gray-500">Breakdown of primary ideological clusters across the total user base.</p>
                        </div>

                        <div className="space-y-4">
                            {distributionData.map((item) => (
                                <div key={item.cluster} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold text-gray-700">
                                        <span>{item.cluster}</span>
                                        <span>{item.percentage}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full"
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Demographics Section */}
                    <section className="bg-white rounded-[16px] border border-gray-200 shadow-sm p-8 space-y-8 flex flex-col">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">Age Demographics</h2>
                            <p className="text-sm font-medium text-gray-500">Participation breakdown by age group.</p>
                        </div>

                        {/* We use Recharts for a clean embedded bar chart */}
                        <div className="flex-1 min-h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="group"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f9fafb' }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}
                                        itemStyle={{ color: '#2563eb', fontWeight: 600, fontSize: '14px' }}
                                    />
                                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* Insights Box */}
                    <section className="bg-blue-50/50 rounded-[16px] border border-blue-100 p-8 lg:col-span-2 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <h2 className="text-xl font-bold tracking-tight text-blue-900">Research Transparency</h2>
                            <p className="text-sm font-medium text-blue-800 leading-relaxed">
                                Our data is completely anonymized. We apply strict differential privacy techniques before aggregating any statistics. We believe in open science and will be releasing a public API for researchers by Q4.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <Link href="/science"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-[8px] font-bold uppercase tracking-widest text-[11px] bg-white text-blue-600 border border-blue-200 transition-colors hover:bg-blue-50 hover:border-blue-300">
                                View Methodology →
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer className="px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-auto border-t border-gray-200 bg-white">
                <div className="flex flex-wrap items-center gap-6">
                    <span>© {new Date().getFullYear()} MindPolis</span>
                    <Link href="/science" className="hover:text-gray-900 transition-colors">The Science</Link>
                    <span className="text-gray-900">Data Explorer</span>
                </div>
                <span>Research-grade political cognition assessment · v1.0</span>
            </footer>
        </div>
    )
}
