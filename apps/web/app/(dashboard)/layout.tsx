// ============================================================================
// MindPolis: app/(dashboard)/layout.tsx
// Version: 5.0.0 — 2026-03-07
// Why: Editorial dark layout. Clean sidebar, amber accent, no gradients.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user    = session?.user ?? null

  return (
    <div className="min-h-screen flex" style={{ background: "#111111" }}>

      {/* ── Sidebar ── */}
      <aside className="w-52 shrink-0 hidden md:flex flex-col" style={{ borderRight: "1px solid #1e1e1e" }}>

        {/* Logo */}
        <div className="px-5 pt-7 pb-5" style={{ borderBottom: "1px solid #1e1e1e" }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-black font-black text-[11px]"
              style={{ background: "#f59e0b" }}>
              MP
            </div>
            <span className="font-semibold text-sm text-white/80 tracking-tight">MindPolis</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-px">
          <p className="label px-2 pb-2 pt-1">Explore</p>
          <SideLink href="/assessment">Assessments</SideLink>
          {user && (
            <>
              <p className="label px-2 pb-2 pt-4">Account</p>
              <SideLink href="/dashboard">Dashboard</SideLink>
              <SideLink href="/results">My Results</SideLink>
            </>
          )}
        </nav>

        {/* User / sign-in */}
        <div className="p-3" style={{ borderTop: "1px solid #1e1e1e" }}>
          {user ? (
            <div className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black shrink-0"
                style={{ background: "#f59e0b" }}>
                {(user.name ?? user.email ?? "U")[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/60 truncate">{user.name ?? user.email}</p>
              </div>
            </div>
          ) : (
            <Link href="/login"
              className="flex items-center gap-2 px-2 py-2 rounded text-xs text-white/35 hover:text-white/70 hover:bg-white/[0.04] transition-colors">
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
        {/* Mobile bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid #1e1e1e" }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-black font-black text-[9px]"
              style={{ background: "#f59e0b" }}>MP</div>
            <span className="font-semibold text-sm text-white/80">MindPolis</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/assessment" className="text-xs text-white/40 hover:text-white/70">Assessments</Link>
            {user
              ? <Link href="/dashboard" className="text-xs text-white/40 hover:text-white/70">Dashboard</Link>
              : <Link href="/login" className="text-xs font-medium" style={{ color: "#f59e0b" }}>Sign in</Link>}
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
      className="flex items-center gap-2 px-2 py-2 rounded text-sm text-white/40 hover:text-white/85 hover:bg-white/[0.04] transition-colors duration-100">
      {children}
    </a>
  )
}
