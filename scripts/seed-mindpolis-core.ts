// ============================================================================
// MindPolis: scripts/seed-mindpolis-core.ts
// Version: 1.0.0 — 2026-03-07
// Why: Seeds the MindPolis Core Assessment — the 48-question research-grade
//      bank spanning 8 political cognition axes. Reads from question-bank.json
//      and maps each question to the Prisma schema using the metadata field
//      to store option-based scoring data (schema-compatible, no migration
//      required). Run with:
//        DATABASE_URL="..." pnpm exec tsx scripts/seed-mindpolis-core.ts
// Env / Identity: Node.js script — Prisma Client — runs against DATABASE_URL
// ============================================================================

import { PrismaClient } from "@prisma/client"
import { readFileSync } from "fs"
import { join } from "path"

const db = new PrismaClient()

// ─────────────────────────────────────────────
// Load the question bank JSON from disk
// ─────────────────────────────────────────────
interface QuestionOption {
  id: string
  text: string
  scores: Record<string, number>
}

interface QuestionBankItem {
  id: string
  axis_id: string
  subtype: string
  complexity: string
  academic_basis: string[]
  constructs_measured: string[]
  scenario_text: string
  options: QuestionOption[]
  bias_check: boolean
  reverse_coded: boolean
  notes_for_researchers: string
}

// ─────────────────────────────────────────────
// 8 scoring dimensions for the MindPolis Core assessment
// ─────────────────────────────────────────────
const DIMENSIONS = [
  {
    key:        "economic_organization",
    label:      "Economic Organization",
    description: "Measures preference for market-coordinated vs state-coordinated economic systems.",
    minLabel:   "Market Coordination",
    maxLabel:   "State / Planned Coordination",
    weight:     1.0,
  },
  {
    key:        "authority_liberty",
    label:      "Authority vs Liberty",
    description: "Measures orientation toward civil liberties and individual freedom vs social order and state authority.",
    minLabel:   "Civil Liberty",
    maxLabel:   "Social Order / Authority",
    weight:     1.0,
  },
  {
    key:        "tradition_change",
    label:      "Tradition vs Change",
    description: "Measures attachment to cultural continuity and established institutions vs openness to social reform.",
    minLabel:   "Tradition / Continuity",
    maxLabel:   "Social Change / Reform",
    weight:     1.0,
  },
  {
    key:        "nationalism_globalism",
    label:      "Nationalism vs Globalism",
    description: "Measures preference for national sovereignty and cohesion vs global cooperation and openness.",
    minLabel:   "National Sovereignty / Cohesion",
    maxLabel:   "Global Cooperation / Openness",
    weight:     1.0,
  },
  {
    key:        "justice_model",
    label:      "Justice Model",
    description: "Measures orientation toward rehabilitation and reintegration vs punishment and deterrence.",
    minLabel:   "Rehabilitation / Reintegration",
    maxLabel:   "Punishment / Deterrence",
    weight:     1.0,
  },
  {
    key:        "ecology_growth",
    label:      "Ecology vs Growth",
    description: "Measures priority given to economic growth and development vs ecological sustainability.",
    minLabel:   "Economic Growth Priority",
    maxLabel:   "Sustainability / Ecological Protection",
    weight:     1.0,
  },
  {
    key:        "institutional_trust",
    label:      "Institutional Trust",
    description: "Measures skepticism toward institutions and expert authority vs trust in institutional expertise.",
    minLabel:   "Institutional Skepticism",
    maxLabel:   "Institutional Trust / Technocratic Confidence",
    weight:     1.0,
  },
  {
    key:        "diversity_cohesion",
    label:      "Diversity vs Cohesion",
    description: "Measures preference for common cultural cohesion vs pluralism, inclusion, and diversity.",
    minLabel:   "Common Culture / Cohesion",
    maxLabel:   "Diversity / Inclusion / Pluralism",
    weight:     1.0,
  },
]

async function main() {
  console.log("Seeding MindPolis Core Assessment...")

  // ── Load question bank from JSON ──────────────────────────────────────────
  const bankPath = join(__dirname, "question-bank.json")
  const bank: QuestionBankItem[] = JSON.parse(readFileSync(bankPath, "utf-8"))
  console.log(`Loaded ${bank.length} questions from question-bank.json`)

  // ── Upsert the assessment ─────────────────────────────────────────────────
  const assessment = await db.assessment.upsert({
    where:  { slug: "mindpolis-core" },
    update: {
      title:            "MindPolis Core Assessment",
      description:      "A research-grade 48-question assessment measuring your political cognition across 8 dimensions: economic preferences, authority, tradition, nationalism, justice, ecology, institutional trust, and cultural diversity.",
      estimatedMinutes: 25,
      version:          "1.0",
      isResearch:       true,
      isActive:         true,
    },
    create: {
      slug:             "mindpolis-core",
      title:            "MindPolis Core Assessment",
      description:      "A research-grade 48-question assessment measuring your political cognition across 8 dimensions: economic preferences, authority, tradition, nationalism, justice, ecology, institutional trust, and cultural diversity.",
      estimatedMinutes: 25,
      version:          "1.0",
      isResearch:       true,
      isActive:         true,
    },
  })

  console.log(`Assessment: ${assessment.slug} (id: ${assessment.id})`)

  // ── Upsert all 8 scoring dimensions ──────────────────────────────────────
  for (const dim of DIMENSIONS) {
    await db.scoringDimension.upsert({
      where:  { assessmentId_key: { assessmentId: assessment.id, key: dim.key } },
      update: { label: dim.label, description: dim.description, minLabel: dim.minLabel, maxLabel: dim.maxLabel, weight: dim.weight },
      create: { assessmentId: assessment.id, ...dim },
    })
  }

  console.log(`Seeded ${DIMENSIONS.length} scoring dimensions`)

  // ── Delete existing questions for this assessment (clean re-seed) ─────────
  // This allows re-running the script safely without duplicate questions
  await db.question.deleteMany({ where: { assessmentId: assessment.id } })

  // ── Insert all 48 questions ────────────────────────────────────────────────
  let questionCount = 0

  for (let i = 0; i < bank.length; i++) {
    const q = bank[i]

    // Collect all axis keys this question touches (primary + secondary from options)
    const allAxisKeys = new Set<string>([q.axis_id])
    for (const opt of q.options) {
      for (const key of Object.keys(opt.scores)) {
        allAxisKeys.add(key)
      }
    }

    await db.question.create({
      data: {
        assessmentId:  assessment.id,
        order:         i + 1,
        text:          q.scenario_text,
        // Use FORCED_CHOICE as the closest existing type — actual options stored in metadata
        type:          "FORCED_CHOICE",
        category:      q.axis_id,
        dimensionKeys: Array.from(allAxisKeys),
        isReversed:    q.reverse_coded,
        isActive:      true,
        metadata: {
          // ── Full question bank data stored in metadata ──────────────────
          question_id:             q.id,
          axis_id:                 q.axis_id,
          subtype:                 q.subtype,
          complexity:              q.complexity,
          academic_basis:          q.academic_basis,
          constructs_measured:     q.constructs_measured,
          bias_check:              q.bias_check,
          reverse_coded:           q.reverse_coded,
          notes_for_researchers:   q.notes_for_researchers,
          // ── Answer options with their per-axis scores ──────────────────
          options:                 q.options,
        },
      },
    })

    questionCount++

    if (questionCount % 10 === 0) {
      console.log(`  Inserted ${questionCount}/${bank.length} questions...`)
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\nMindPolis Core Assessment seeded successfully.`)
  console.log(`  Assessment ID:  ${assessment.id}`)
  console.log(`  Assessment slug: ${assessment.slug}`)
  console.log(`  Dimensions:     ${DIMENSIONS.length}`)
  console.log(`  Questions:      ${questionCount}`)

  // ── Validation report ─────────────────────────────────────────────────────
  const axisDistribution: Record<string, number> = {}
  const complexityDistribution: Record<string, number> = {}
  let crossAxisCount = 0

  for (const q of bank) {
    axisDistribution[q.axis_id] = (axisDistribution[q.axis_id] ?? 0) + 1
    complexityDistribution[q.complexity] = (complexityDistribution[q.complexity] ?? 0) + 1

    // Count unique axis keys across all options
    const uniqueAxes = new Set<string>()
    for (const opt of q.options) {
      for (const key of Object.keys(opt.scores)) {
        uniqueAxes.add(key)
      }
    }
    if (uniqueAxes.size > 1) crossAxisCount++
  }

  console.log("\n  Axis distribution:")
  for (const [axis, count] of Object.entries(axisDistribution)) {
    console.log(`    ${axis}: ${count}`)
  }

  console.log("\n  Complexity distribution:")
  for (const [level, count] of Object.entries(complexityDistribution)) {
    console.log(`    ${level}: ${count}`)
  }

  console.log(`\n  Cross-axis items: ${crossAxisCount} / ${bank.length}`)
  console.log("\nDone.")
}

main()
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
