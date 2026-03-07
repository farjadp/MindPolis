// ============================================================================
// MindPolis: apps/web/lib/env.ts
// Version: 1.0.0 — 2026-03-07
// Why: Validates and exports all environment variables at startup.
//      Fails fast with a clear error if required vars are missing —
//      prevents cryptic runtime failures in production.
// Env / Identity: Node.js server-side only
// ============================================================================

// Minimal env validation without adding zod/t3-env as a hard dependency
function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Check .env.local and ensure all required variables are set.`
    )
  }
  return value
}

// ─────────────────────────────────────────────
// All environment variables used by the Next.js app
// ─────────────────────────────────────────────
export const env = {
  // Database
  DATABASE_URL: requireEnv("DATABASE_URL"),

  // NextAuth
  NEXTAUTH_SECRET: requireEnv("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: requireEnv("NEXTAUTH_URL"),

  // Python scoring microservice
  SCORING_SERVICE_URL: requireEnv("SCORING_SERVICE_URL"),
  SCORING_SERVICE_SECRET: requireEnv("SCORING_SERVICE_SECRET"),

  // App
  NODE_ENV: process.env.NODE_ENV ?? "development",
}
