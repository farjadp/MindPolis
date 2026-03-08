// ============================================================================
// MindPolis: scripts/qa-question-bank.ts
// Version: 1.0.0 — 2026-03-07
// Why: Three-layer QA for the question bank JSON.
//      Layer 1 — Structural:  field completeness, type checks, score ranges
//      Layer 2 — Content:     tone balance, option count, text length
//      Layer 3 — Psychometric: axis coverage, cross-axis conventions, bias flags
// Env / Identity: Node.js CLI (tsx)
// Run: pnpm exec tsx scripts/qa-question-bank.ts
// ============================================================================

import { readFileSync } from "fs"
import { join } from "path"

// ── Types ────────────────────────────────────────────────────────────────────

interface Option {
  id: string
  text: string
  scores: Record<string, number>
}

interface Question {
  id: string
  axis_id: string
  subtype: string
  complexity: string
  academic_basis: string[]
  constructs_measured: string[]
  scenario_text: string
  options: Option[]
  bias_check: boolean
  reverse_coded: boolean
  notes_for_researchers?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const VALID_AXES = new Set([
  "economic_organization",
  "authority_liberty",
  "tradition_change",
  "nationalism_globalism",
  "justice_model",
  "ecology_growth",
  "institutional_trust",
  "diversity_cohesion",
])

const VALID_SUBTYPES  = new Set(["scenario_dilemma", "policy_tradeoff", "consistency_probe"])
const VALID_COMPLEXITIES = new Set(["basic", "intermediate", "advanced"])
const PRIMARY_SCORE_VALUES  = new Set([-2, -1, 1, 2])
const SECONDARY_SCORE_VALUES = new Set([-1, 1])
const REQUIRED_OPTION_COUNT = 4
const MIN_QUESTION_TEXT_LEN = 40
const MAX_QUESTION_TEXT_LEN = 400
const MIN_OPTION_TEXT_LEN   = 20
const MAX_OPTION_TEXT_LEN   = 250

// ── Helpers ───────────────────────────────────────────────────────────────────

let totalErrors   = 0
let totalWarnings = 0

function error(qid: string, msg: string) {
  console.error(`  ✗ [${qid}] ERROR: ${msg}`)
  totalErrors++
}

function warn(qid: string, msg: string) {
  console.warn(`  ⚠ [${qid}] WARN:  ${msg}`)
  totalWarnings++
}

function pass(msg: string) {
  console.log(`  ✓ ${msg}`)
}

function section(title: string) {
  console.log(`\n${"─".repeat(70)}`)
  console.log(`  ${title.toUpperCase()}`)
  console.log("─".repeat(70))
}

// ── Layer 1: Structural ───────────────────────────────────────────────────────

function runStructuralQA(questions: Question[]) {
  section("Layer 1 — Structural QA")
  let issues = 0

  for (const q of questions) {
    // Required top-level fields
    for (const field of ["id", "axis_id", "subtype", "complexity", "scenario_text", "options"] as const) {
      if (!q[field]) { error(q.id ?? "UNKNOWN", `Missing required field: ${field}`); issues++ }
    }

    if (!Array.isArray(q.academic_basis) || q.academic_basis.length === 0)
      { error(q.id, "academic_basis must be a non-empty array"); issues++ }

    if (!Array.isArray(q.constructs_measured) || q.constructs_measured.length === 0)
      { error(q.id, "constructs_measured must be a non-empty array"); issues++ }

    if (typeof q.bias_check !== "boolean")
      { error(q.id, "bias_check must be a boolean"); issues++ }

    if (typeof q.reverse_coded !== "boolean")
      { error(q.id, "reverse_coded must be a boolean"); issues++ }

    // Axis validity
    if (!VALID_AXES.has(q.axis_id))
      { error(q.id, `Unknown axis_id: "${q.axis_id}"`); issues++ }

    // Subtype + complexity
    if (!VALID_SUBTYPES.has(q.subtype))
      { error(q.id, `Unknown subtype: "${q.subtype}"`); issues++ }

    if (!VALID_COMPLEXITIES.has(q.complexity))
      { error(q.id, `Unknown complexity: "${q.complexity}"`); issues++ }

    // Option count
    if (!Array.isArray(q.options) || q.options.length !== REQUIRED_OPTION_COUNT)
      { error(q.id, `Expected ${REQUIRED_OPTION_COUNT} options, found ${q.options?.length ?? 0}`); issues++ }

    // Option structure
    if (Array.isArray(q.options)) {
      for (const opt of q.options) {
        if (!opt.id || !opt.text)
          { error(q.id, `Option missing id or text: ${JSON.stringify(opt)}`); issues++ }

        if (!opt.scores || Object.keys(opt.scores).length === 0)
          { error(q.id, `Option "${opt.id}" has no scores`); issues++ }
      }
    }
  }

  if (issues === 0) pass(`All ${questions.length} questions pass structural checks`)
  else console.log(`  → ${issues} structural issues found`)
}

// ── Layer 2: Content QA ───────────────────────────────────────────────────────

function runContentQA(questions: Question[]) {
  section("Layer 2 — Content QA")
  let issues = 0

  for (const q of questions) {
    // Question text length
    if (q.scenario_text.length < MIN_QUESTION_TEXT_LEN)
      { warn(q.id, `Scenario text too short (${q.scenario_text.length} chars)`); issues++ }
    if (q.scenario_text.length > MAX_QUESTION_TEXT_LEN)
      { warn(q.id, `Scenario text very long (${q.scenario_text.length} chars) — consider trimming`); issues++ }

    if (!Array.isArray(q.options)) continue

    // Option text lengths
    for (const opt of q.options) {
      if (opt.text.length < MIN_OPTION_TEXT_LEN)
        { warn(q.id, `Option "${opt.id}" text too short (${opt.text.length} chars)`); issues++ }
      if (opt.text.length > MAX_OPTION_TEXT_LEN)
        { warn(q.id, `Option "${opt.id}" text very long (${opt.text.length} chars)`); issues++ }
    }

    // Option count balance: should have 2 pole-A leaning + 2 pole-B leaning
    const primaryScores = q.options.map(o => o.scores[q.axis_id] ?? 0)
    const negCount = primaryScores.filter(s => s < 0).length
    const posCount = primaryScores.filter(s => s > 0).length

    if (negCount !== 2 || posCount !== 2) {
      // Consistency probes may intentionally differ — only warn for dilemmas/tradeoffs
      if (q.subtype !== "consistency_probe") {
        warn(q.id, `Expected 2 negative + 2 positive primary scores, got ${negCount}neg/${posCount}pos`)
        issues++
      }
    }

    // Detect loaded language patterns
    const loadedTerms = [
      { pattern: /\bextrem[ei]/i, label: "extremist" },
      { pattern: /\bfanat[ici]/i, label: "fanatic" },
      { pattern: /\bnaive\b/i, label: "naive" },
      { pattern: /\bblind(ly)?\b/i, label: "blindly" },
      { pattern: /\bsimply\b/i, label: "simply (implies trivialization)" },
      { pattern: /\bobviously\b/i, label: "obviously (implies self-evidence)" },
    ]

    const allTexts = [q.scenario_text, ...q.options.map(o => o.text)].join(" ")
    for (const { pattern, label } of loadedTerms) {
      if (pattern.test(allTexts)) {
        warn(q.id, `Possible loaded language detected: "${label}"`)
        issues++
      }
    }
  }

  if (issues === 0) pass("All questions pass content checks")
  else console.log(`  → ${issues} content issues found`)
}

// ── Layer 3: Psychometric QA ──────────────────────────────────────────────────

function runPsychometricQA(questions: Question[]) {
  section("Layer 3 — Psychometric QA")
  let issues = 0

  // 3a — Axis coverage: expect exactly 6 questions per axis
  const byAxis = new Map<string, Question[]>()
  for (const q of questions) {
    if (!byAxis.has(q.axis_id)) byAxis.set(q.axis_id, [])
    byAxis.get(q.axis_id)!.push(q)
  }

  for (const axis of VALID_AXES) {
    const count = byAxis.get(axis)?.length ?? 0
    if (count !== 6) {
      error(axis, `Expected 6 questions, found ${count}`)
      issues++
    }
  }

  // 3b — Subtype distribution per axis: expect 3 scenario_dilemma, 2 policy_tradeoff, 1 consistency_probe
  for (const [axis, qs] of byAxis) {
    const subtypeCounts: Record<string, number> = {}
    for (const q of qs) subtypeCounts[q.subtype] = (subtypeCounts[q.subtype] ?? 0) + 1
    if (subtypeCounts["scenario_dilemma"] !== 3)
      { warn(axis, `Expected 3 scenario_dilemma, found ${subtypeCounts["scenario_dilemma"] ?? 0}`); issues++ }
    if (subtypeCounts["policy_tradeoff"] !== 2)
      { warn(axis, `Expected 2 policy_tradeoff, found ${subtypeCounts["policy_tradeoff"] ?? 0}`); issues++ }
    if (subtypeCounts["consistency_probe"] !== 1)
      { warn(axis, `Expected 1 consistency_probe, found ${subtypeCounts["consistency_probe"] ?? 0}`); issues++ }
  }

  // 3c — Complexity distribution: expect ~18 basic, 20 intermediate, 10 advanced
  const complexityCount: Record<string, number> = {}
  for (const q of questions) complexityCount[q.complexity] = (complexityCount[q.complexity] ?? 0) + 1
  console.log(`\n  Complexity distribution:`)
  for (const [k, v] of Object.entries(complexityCount))
    console.log(`    ${k.padEnd(14)} ${v} questions`)

  // 3d — Score range validation
  for (const q of questions) {
    if (!Array.isArray(q.options)) continue
    for (const opt of q.options) {
      for (const [scoreAxis, scoreValue] of Object.entries(opt.scores)) {
        if (!VALID_AXES.has(scoreAxis)) {
          error(q.id, `Option "${opt.id}" scores unknown axis: "${scoreAxis}"`)
          issues++
          continue
        }
        const isPrimary   = scoreAxis === q.axis_id
        const validValues = isPrimary ? PRIMARY_SCORE_VALUES : SECONDARY_SCORE_VALUES
        if (!validValues.has(scoreValue as number)) {
          error(q.id, `Option "${opt.id}" has invalid ${isPrimary ? "primary" : "secondary"} score ${scoreValue} on "${scoreAxis}" (valid: ${[...validValues].join(", ")})`)
          issues++
        }
      }
    }
  }

  // 3e — Cross-axis balance: no single secondary axis should dominate
  const secondaryAxisLoads = new Map<string, number>()
  for (const q of questions) {
    if (!Array.isArray(q.options)) continue
    for (const opt of q.options) {
      for (const scoreAxis of Object.keys(opt.scores)) {
        if (scoreAxis !== q.axis_id) {
          secondaryAxisLoads.set(scoreAxis, (secondaryAxisLoads.get(scoreAxis) ?? 0) + 1)
        }
      }
    }
  }

  console.log(`\n  Secondary axis loading (cross-axis option appearances):`)
  for (const [axis, count] of [...secondaryAxisLoads.entries()].sort((a, b) => b[1] - a[1]))
    console.log(`    ${axis.padEnd(28)} ${count}`)

  // 3f — Bias-flagged questions
  const biasQuestions = questions.filter(q => q.bias_check === true)
  console.log(`\n  bias_check=true questions (${biasQuestions.length}):`)
  for (const q of biasQuestions)
    console.log(`    ${q.id}  [${q.axis_id}]  ${q.subtype}`)

  // 3g — Reverse-coded questions
  const reverseCoded = questions.filter(q => q.reverse_coded === true)
  console.log(`\n  reverse_coded=true questions (${reverseCoded.length}):`)
  for (const q of reverseCoded)
    console.log(`    ${q.id}  [${q.axis_id}]  ${q.subtype}`)

  if (issues === 0) pass("All psychometric checks pass")
  else console.log(`  → ${issues} psychometric issues found`)
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log("MindPolis Question Bank QA")
  console.log("=".repeat(70))

  const bankPath = join(__dirname, "question-bank.json")
  let questions: Question[]

  try {
    const raw = readFileSync(bankPath, "utf-8")
    questions = JSON.parse(raw)
  } catch (e: any) {
    console.error(`Failed to read question-bank.json: ${e.message}`)
    process.exit(1)
  }

  console.log(`\n  Loaded ${questions.length} questions from question-bank.json`)

  runStructuralQA(questions)
  runContentQA(questions)
  runPsychometricQA(questions)

  // ── Summary ─────────────────────────────────────────────────────────────────
  section("Summary")
  console.log(`  Total questions : ${questions.length}`)
  console.log(`  Errors          : ${totalErrors}`)
  console.log(`  Warnings        : ${totalWarnings}`)

  if (totalErrors > 0) {
    console.log("\n  QA FAILED — fix errors before seeding.\n")
    process.exit(1)
  } else if (totalWarnings > 0) {
    console.log("\n  QA PASSED WITH WARNINGS — review warnings before publishing.\n")
    process.exit(0)
  } else {
    console.log("\n  QA PASSED — question bank is clean.\n")
    process.exit(0)
  }
}

main()
