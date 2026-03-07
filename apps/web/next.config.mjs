// ============================================================================
// MindPolis: apps/web/next.config.mjs
// Version: 1.0.0 — 2026-03-07
// Why: Next.js 14 config — uses .mjs format (Next.js 14 does not support .ts).
//      Enables strict mode and OAuth image domain allowlist.
// Env / Identity: Next.js build config
// ============================================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
}

export default nextConfig
