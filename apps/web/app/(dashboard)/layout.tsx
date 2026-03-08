// ============================================================================
// MindPolis: app/(dashboard)/layout.tsx
// Version: 6.0.0 — 2026-03-07
// Why: Analytical intelligence layout. Pure white base, structured grid.
//      Think Linear / Stripe — calm, credible, professional.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = session?.user ?? null

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col bg-white border-r border-gray-200">

        {/* Logo */}
        <div className="px-6 pt-8 pb-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] flex items-center justify-center font-black text-[12px] text-white bg-blue-600 shadow-sm">
              MP
            </div>
            <span className="font-bold text-base tracking-tight text-gray-900">MindPolis</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Explore</p>
          <SideLink href="/assessment">Assessments</SideLink>
          {user && (
            <>
              <p className="px-3 pb-2 pt-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Account</p>
              <SideLink href="/dashboard">Dashboard</SideLink>
              <SideLink href="/results">Historical Data</SideLink>
              <SideLink href="/settings">Settings & Privacy</SideLink>
            </>
          )}
        </nav>

        {/* User / sign-in */}
        <div className="p-4 border-t border-gray-100">
          {user ? (
            <div className="flex items-center gap-3 px-3 py-3 rounded-[12px] bg-gray-50/50 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[12px] font-bold text-blue-700 bg-blue-100 shrink-0">
                {(user.name ?? user.email ?? "U")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-gray-900 truncate">{user.name ?? "Anonymous User"}</p>
                <p className="text-[11px] font-medium text-gray-500 truncate">{user.email ?? "Not logged in"}</p>
              </div>
            </div>
          ) : (
            <Link href="/login"
              className="flex items-center gap-2 px-4 py-3 rounded-[12px] text-[13px] font-bold transition-colors bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 shadow-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign in to save results
            </Link>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[6px] flex items-center justify-center font-black text-[10px] text-white bg-blue-600 shadow-sm">MP</div>
            <span className="font-bold text-sm tracking-tight text-gray-900">MindPolis</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/assessment" className="text-[12px] font-bold text-gray-500 transition-colors hover:text-gray-900 uppercase tracking-widest">
              Assessments
            </Link>
            {user
              ? <Link href="/dashboard" className="text-[12px] font-bold text-gray-500 transition-colors hover:text-gray-900 uppercase tracking-widest">Dashboard</Link>
              : <Link href="/login" className="text-[12px] font-bold text-blue-600 uppercase tracking-widest">Sign in</Link>}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

function SideLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="flex items-center gap-3 px-4 py-2.5 rounded-[8px] text-[13px] font-bold transition-all duration-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50">
      {children}
    </Link>
  )
}
