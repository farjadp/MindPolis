"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" /></div>}>
            <AdminLoginContent />
        </Suspense>
    )
}

function AdminLoginContent() {
    const router = useRouter()
    // Admin email is locked
    const email = "admin@mindpolis.com"
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!password) return
        setLoading(true); setError("")
        const result = await signIn("credentials", { email, password, redirect: false })
        setLoading(false)
        if (result?.error) setError("Authentication failed. Invalid master password.")
        else { router.push("/admin/logs"); router.refresh() }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6">
            <div className="w-full max-w-[360px] space-y-8">

                <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded flex items-center justify-center font-black text-sm bg-blue-600 outline outline-[4px] outline-blue-900/50 text-white shadow-xl shadow-blue-500/20">MP</div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">System Gateway</h1>
                    <p className="text-sm font-medium text-gray-400">Restricted Access // MindPolis Ops</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 p-6 rounded-[16px] shadow-2xl space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Master Password</label>
                            <input id="password" type="password" value={password} required autoFocus
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-[8px] border px-4 py-3 text-base outline-none transition-all placeholder:text-gray-600 bg-gray-900 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner"
                            />
                        </div>

                        {error && (
                            <div className="px-4 py-3 rounded-[8px] text-[13px] text-red-200 bg-red-900/30 border border-red-500/30 font-medium">
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full py-3 rounded-[8px] text-[13px] font-bold uppercase tracking-widest bg-blue-600 text-white transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-900">
                            {loading ? "Authenticating…" : "Unlock"}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-4">
                    <Link href="/" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                        ← Return to public site
                    </Link>
                </div>
            </div>
        </div>
    )
}
