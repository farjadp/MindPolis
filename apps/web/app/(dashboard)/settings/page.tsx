import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export const metadata = { title: "Settings & Privacy · MindPolis" }

export default async function SettingsPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const userId = (session.user as any).id as string

    // We could fetch user details from DB here if needed
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true, createdAt: true }
    })

    return (
        <div className="max-w-[800px] mx-auto space-y-12 pb-24">
            <header className="space-y-2 border-b border-gray-200 pb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Account</p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Settings & Privacy</h1>
                <p className="text-sm font-medium text-gray-500 pt-2">
                    Manage your data, export your results, and control your anonymity.
                </p>
            </header>

            <div className="space-y-8">
                {/* Contact info - optional email concept */}
                <section className="p-8 bg-white border border-gray-200 rounded-[16px] shadow-sm space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Account Identity</h2>
                        <p className="text-sm text-gray-500 mt-1">MindPolis is designed to be fully functional even when anonymous.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Email Address</label>
                            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-[8px] bg-gray-50">
                                <span className="font-mono text-sm font-medium text-gray-900">{user?.email || "Anonymous User"}</span>
                                {user?.email && <span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-1 rounded-[4px]">Verified</span>}
                            </div>
                        </div>

                        <p className="text-xs text-gray-400">
                            Your email is only used for account recovery and important notifications. We do not sell or share this data.
                        </p>
                    </div>
                </section>

                {/* Export Data */}
                <section className="p-8 bg-white border border-gray-200 rounded-[16px] shadow-sm space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Data Portability</h2>
                        <p className="text-sm text-gray-500 mt-1">Export all your historical assessment data and results in JSON format.</p>
                    </div>

                    <div>
                        {/* Note: In a real implementation this would call an API route to generate the download */}
                        <button className="px-6 py-3 bg-gray-100 text-gray-900 font-bold uppercase tracking-widest text-[11px] rounded-[8px] hover:bg-gray-200 transition-colors">
                            Export My Data
                        </button>
                    </div>
                </section>

                {/* Delete Account */}
                <section className="p-8 bg-red-50 border border-red-100 rounded-[16px] space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
                        <p className="text-sm text-red-700/80 mt-1">Permanently delete your account and all associated assessment data.</p>
                    </div>

                    <div>
                        <button className="px-6 py-3 bg-red-600 text-white font-bold uppercase tracking-widest text-[11px] rounded-[8px] hover:bg-red-700 transition-colors shadow-sm">
                            Delete Account
                        </button>
                        <p className="text-xs text-red-600/60 mt-4">
                            This action cannot be undone. All data will be immediately and permanently erased from our servers in accordance with strict privacy standards.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}
