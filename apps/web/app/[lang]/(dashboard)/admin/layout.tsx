import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    // Protect all /admin routes
    if (!session?.user || (session.user as any).role !== "ADMIN") {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen bg-gray-50/30">
            {/* Admin Subnav */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-900 border-r border-gray-200 pr-6">Admin Console</span>
                        <nav className="flex items-center gap-4">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">Logs</span>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="py-12 md:py-16">
                {children}
            </div>
        </div>
    )
}
