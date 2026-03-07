// ============================================================================
// MindPolis: app/api/auth/[...nextauth]/route.ts
// Version: 1.0.0 — 2026-03-07
// Why: NextAuth catch-all route handler. Exports GET and POST from the
//      centralized auth config in lib/auth.ts — this file intentionally
//      stays minimal. All auth logic lives in lib/auth.ts.
// Env / Identity: Next.js API Route  ·  Node.js runtime
// ============================================================================

import { handlers } from "@/lib/auth"
export const { GET, POST } = handlers
