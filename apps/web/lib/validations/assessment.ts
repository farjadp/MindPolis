// ============================================================================
// MindPolis: apps/web/lib/validations/assessment.ts
// Version: 1.0.0 — 2026-03-07
// Why: Zod schemas for all assessment-related API inputs.
//      These run server-side in API routes before any DB or scoring call.
//      They are the first line of defense against malformed data.
// Env / Identity: Zod  ·  Node.js server-side (API routes only)
// ============================================================================

import { z } from "zod"

// ─────────────────────────────────────────────
// A single question response as submitted by the frontend
// ─────────────────────────────────────────────
export const QuestionResponseSchema = z.object({
  questionId: z.string().cuid("Invalid question ID"),
  value:      z.number().min(1).max(7),  // Covers both Likert-5 and Likert-7
  answeredAt: z.string().datetime().optional(),
  latencyMs:  z.number().int().positive().optional(),  // Response time in ms
})

// ─────────────────────────────────────────────
// Full submission payload from the frontend
// ─────────────────────────────────────────────
export const SubmitAssessmentSchema = z.object({
  assessmentId: z.string().cuid("Invalid assessment ID"),
  submissionId: z.string().cuid("Invalid submission ID"),
  responses:    z.array(QuestionResponseSchema).min(1).max(500),
})

// ─────────────────────────────────────────────
// Query params for listing results
// ─────────────────────────────────────────────
export const ResultsQuerySchema = z.object({
  page:         z.coerce.number().int().positive().default(1),
  limit:        z.coerce.number().int().min(1).max(100).default(20),
  assessmentId: z.string().cuid().optional(),
})

export type SubmitAssessmentInput = z.infer<typeof SubmitAssessmentSchema>
export type ResultsQueryInput = z.infer<typeof ResultsQuerySchema>
