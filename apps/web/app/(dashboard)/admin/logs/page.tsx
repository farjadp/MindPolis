import { db } from "@/lib/db"

export const metadata = { title: "Admin Logs · MindPolis" }

export default async function AdminLogsPage() {
    const logs = await db.assessmentSubmission.findMany({
        where: { status: "COMPLETED" },
        include: {
            user: { select: { email: true } },
            assessment: { select: { title: true } },
            result: { select: { summary: true, clusterLabel: true } },
        },
        orderBy: { completedAt: "desc" },
        take: 100, // Show last 100 for now
    })

    return (
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Assessment Logs</h1>
                <p className="text-sm text-gray-500 font-medium">Monitoring the latest 100 successful completions globally.</p>
            </div>

            <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                        <thead className="bg-gray-50/50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Timestamp</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">User</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Assessment</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">IP & Location</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-gray-400">Outcome</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                                        No completed assessments found yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => {
                                    const summaryStr = log.result?.summary ? (log.result.summary as any).label : "No result"
                                    const clusterBase = log.result?.clusterLabel

                                    return (
                                        <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-xs">
                                                    {log.completedAt?.toLocaleString() || "Unknown"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {log.user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                {log.assessment.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-mono text-xs text-blue-600">
                                                        {log.ipAddress || "Unknown IP"}
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                                                        {log.country || "Unknown"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-gray-900 truncate max-w-[200px]" title={summaryStr}>
                                                        {summaryStr}
                                                    </span>
                                                    {clusterBase && (
                                                        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500">
                                                            {clusterBase}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
