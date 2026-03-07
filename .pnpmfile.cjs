// ============================================================================
// MindPolis: .pnpmfile.cjs
// Version: 1.0.0 — 2026-03-07
// Why: Approves build scripts for Prisma and esbuild — required for
//      Prisma client generation and esbuild compilation in the monorepo.
// ============================================================================

function readPackage(pkg) {
  return pkg
}

module.exports = {
  hooks: { readPackage },
}
