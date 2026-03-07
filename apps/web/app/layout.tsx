// ============================================================================
// MindPolis: app/layout.tsx
// Version: 1.0.0 — 2026-03-07
// Why: Root layout — wraps the entire application with global providers,
//      fonts, metadata, and the NextAuth session context.
//      Everything rendered in this app descends from this component.
// Env / Identity: React Server Component (RSC)
// ============================================================================

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import "./globals.css"

// Inter is used for all body text — clean, readable, research-friendly
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "MindPolis",
    template: "%s | MindPolis",
  },
  description:
    "MindPolis — Advanced political cognition assessment. Discover your ideological tendencies, moral values, and cognitive patterns.",
  keywords: ["political psychology", "ideology", "moral foundations", "cognition"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/*
          SessionProvider wraps the entire app so any client component
          can call useSession() without prop drilling.
        */}
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
