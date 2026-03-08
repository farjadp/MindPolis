// ============================================================================
// MindPolis: app/(dashboard)/layout.tsx
// Version: 6.0.0 — 2026-03-07
// Why: Analytical intelligence layout. Navy base, blue accent, structured grid.
//      Think Linear / Stripe — calm, credible, professional.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user    = session?.user ?? null

  return (
    <div className="min-h-screen flex" style={{ background: "#0F172A" }}>

      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 hidden md:flex flex-col"
        style={{ background: "#0B1120", borderRight: "1px solid #1E293B" }}>

        {/* Logo */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid #1E293B" }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded flex items-center justify-center font-black text-[11px] text-white"
              style={{ background: "#3B82F6" }}>
              MP
            </div>
            <span className="font-semibold text-sm tracking-tight" style={{ color: "#E5E7EB" }}>MindPolis</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          <p className="label px-3 pb-2 pt-3">Explore</p>
          <SideLink href="/assessment">Assessments</SideLink>
          {user && (
            <>
              <p className="label px-3 pb-2 pt-4">Account</p>
              <SideLink href="/dashboard">Dashboard</SideLink>
              <SideLink href="/results">My Results</SideLink>
            </>
          )}
        </nav>

        {/* User / sign-in */}
        <div className="p-3" style={{ borderTop: "1px solid #1E293B" }}>
          {user ? (
            <div className="flex items-center gap-2.5 px-3 py-2 rounded"
              style={{ background: "#111827" }}>
              <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ background: "#3B82F6" }}>
                {(user.name ?? user.email ?? "U")[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs truncate" style={{ color: "#9CA3AF" }}>{user.name ?? user.email}</p>
              </div>
            </div>
          ) : (
            <Link href="/login"
              className="flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors hover:bg-white/[0.04]"
              style={{ color: "#6B7280" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign in to save results
            </Link>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3"
          style={{ background: "#0B1120", borderBottom: "1px solid #1E293B" }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center font-black text-[9px] text-white"
              style={{ background: "#3B82F6" }}>MP</div>
            <span className="font-semibold text-sm" style={{ color: "#E5E7EB" }}>MindPolis</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/assessment" className="text-xs transition-colors hover:text-white/70" style={{ color: "#6B7280" }}>
              Assessments
            </Link>
            {user
              ? <Link href="/dashboard" className="text-xs transition-colors hover:text-white/70" style={{ color: "#6B7280" }}>Dashboard</Link>
              : <Link href="/login" className="text-xs font-semibold" style={{ color: "#3B82F6" }}>Sign in</Link>}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}

function SideLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href}
      className="flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors duration-100 hover:bg-white/[0.05]"
      style={{ color: "#9CA3AF" }}>
      {children}
    </a>
  )
}
