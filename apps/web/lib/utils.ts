// ============================================================================
// MindPolis: apps/web/lib/utils.ts
// Version: 1.0.0 — 2026-03-07
// Why: Shared utility — cn() merges Tailwind classes safely using
//      clsx + tailwind-merge. Used by every ShadCN UI component.
// ============================================================================

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
