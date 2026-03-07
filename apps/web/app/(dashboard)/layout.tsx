// ============================================================================
// MindPolis: app/(dashboard)/layout.tsx
// Version: 4.0.0 — 2026-03-07
// Why: Dark sidebar layout. Auth optional — guests access assessments freely.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user    = session?.user ?? null

  return (
    <div className="min-h-screen flex" style={{ background: "#09090f" }}>

      {/* ── Sidebar ── */}
      <aside className="w-[220px] shrink-0 hidden md:flex flex-col border-r border-white/[0.06]">

        {/* Logo */}
        <div className="px-5 pt-7 pb-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600" />
              <span className="relative text-white text-[10px] font-black tracking-tight">MP</span>
            </div>
            <span className="text-white/90 font-semibold text-sm tracking-tight">MindPolis</span>
          </Link>
        </div>

        {/* Nav */}
        <div className="px-3 flex-1 space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20 px-2.5 pb-2">Explore</p>
          <NavItem href="/assessment" icon="grid">Assessments</NavItem>
          {user && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/20 px-2.5 pt-5 pb-2">Account</p>
              <NavItem href="/dashboard" icon="home">Dashboard</NavItem>
              <NavItem href="/results" icon="chart">My Results</NavItem>
            </>
          )}
        </div>

        {/* User / sign-in */}
        <div className="p-3 border-t border-white/[0.06]">
          {user ? (
            <div className="flex items-center gap-3 px-2.5 py-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shrink-0">
                <span className="text-white text-[11px] font-bold uppercase">
                  {(user.name ?? user.email ?? "U")[0]}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-white/70 text-xs font-medium truncate">{user.name}</p>
                <p className="text-white/30 text-[10px] truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all text-xs font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign in to save results
            </Link>
          )}
        </div>
      </aside>

      {/* ── Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-[9px] font-black">MP</span>
            </div>
            <span className="text-white/90 font-semibold text-sm">MindPolis</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/assessment" className="text-xs text-white/50 hover:text-white/80">Assessments</Link>
            {user
              ? <Link href="/dashboard" className="text-xs text-white/50 hover:text-white/80">Dashboard</Link>
              : <Link href="/login" className="text-xs font-medium text-violet-400">Sign in</Link>
            }
          </div>
        </header>
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}

const ICONS: Record<string, React.ReactNode> = {
  grid: <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  home: <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  chart: <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
}

function NavItem({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-white/40 hover:text-white/90 hover:bg-white/[0.06] transition-all duration-150 text-sm"
    >
      {ICONS[icon]}
      {children}
    </a>
  )
}
