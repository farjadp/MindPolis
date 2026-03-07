// ============================================================================
// MindPolis: apps/web/lib/db.ts
// Version: 1.0.0 — 2026-03-07
// Why: Prisma client singleton — prevents connection pool exhaustion in
//      Next.js development (hot reload creates new instances without this).
//      Pattern recommended by Prisma for Next.js apps.
// Env / Identity: Node.js server-side only — never import on client components
// ============================================================================

import { PrismaClient } from "@prisma/client"

// Extend global to cache the instance across hot reloads in dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  })

// Cache on global in development to survive hot reloads
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db
}
