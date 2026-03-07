// ============================================================================
// MindPolis: apps/web/lib/auth.ts
// Version: 1.1.0 — 2026-03-07
// Why: NextAuth configuration. Credentials provider now works for local dev:
//      any email + any password auto-creates or finds the user (no bcrypt).
//      OAuth providers (GitHub/Google) remain for production.
// Env / Identity: Node.js server-side only — NextAuth v5 (Auth.js)
// ============================================================================

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },

  providers: [
    // ── Social OAuth (production) ────────────────────────────────────────
    ...(process.env.GITHUB_CLIENT_ID ? [GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    })] : []),
    ...(process.env.GOOGLE_CLIENT_ID ? [Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })] : []),

    // ── Credentials — local dev auto-register ────────────────────────────
    // Any email + any password works. Auto-creates account on first use.
    // Replace with bcrypt check before production deployment.
    Credentials({
      name: "Email",
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
        name:     { label: "Name",     type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        if (!email) return null

        // Find or create user by email
        let user = await db.user.findUnique({ where: { email } })

        if (!user) {
          user = await db.user.create({
            data: {
              email,
              name: (credentials?.name as string | null) ?? email.split("@")[0],
              role: "PARTICIPANT",
            },
          })
        }

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "PARTICIPANT"
        token.id   = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role
        ;(session.user as any).id  = token.id
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },
})
