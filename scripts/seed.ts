// ============================================================================
// MindPolis: scripts/seed.ts
// Version: 1.0.0 — 2026-03-07
// Why: Database seed script — populates the Political Compass and Moral
//      Foundations assessments with their full question sets and scoring
//      dimensions. Run once after initial DB migration:
//        npx tsx scripts/seed.ts
// Env / Identity: Node.js script — runs against DATABASE_URL
// ============================================================================

import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

async function main() {
  console.log("Seeding MindPolis database...")

  // ── Political Compass Assessment ─────────────────────────────────────────
  const politicalCompass = await db.assessment.upsert({
    where:  { slug: "political-compass" },
    update: {},
    create: {
      slug:             "political-compass",
      title:            "Political Compass",
      description:      "Map your position on the classic two-axis political compass — Economic Left/Right and Social Libertarian/Authoritarian.",
      estimatedMinutes: 12,
      version:          "1.0",
      isResearch:       true,

      // ── Scoring dimensions ────────────────────────────────────────────
      dimensions: {
        create: [
          {
            key:        "economic_axis",
            label:      "Economic Axis",
            description: "Measures your stance on economic organization: collective/state control vs free market individualism.",
            minLabel:   "Far-Left",
            maxLabel:   "Far-Right",
            weight:     1.0,
          },
          {
            key:        "social_axis",
            label:      "Social Axis",
            description: "Measures your stance on personal freedom vs authority: libertarian vs authoritarian.",
            minLabel:   "Libertarian",
            maxLabel:   "Authoritarian",
            weight:     1.0,
          },
        ],
      },

      // ── Sample questions (abbreviated — full 62-item set in production) ──
      questions: {
        create: [
          {
            order:         1,
            text:          "If economic globalisation is inevitable, it should primarily serve humanity rather than the interests of trans-national corporations.",
            type:          "LIKERT_5",
            category:      "economic",
            dimensionKeys: ["economic_axis"],
            isReversed:    false,
          },
          {
            order:         2,
            text:          "I'd always support my country, whether it was right or wrong.",
            type:          "LIKERT_5",
            category:      "social",
            dimensionKeys: ["social_axis"],
            isReversed:    false,
          },
          {
            order:         3,
            text:          "No one chooses their country of birth, so it's foolish to be proud of it.",
            type:          "LIKERT_5",
            category:      "social",
            dimensionKeys: ["social_axis"],
            isReversed:    true,
          },
          {
            order:         4,
            text:          "Our civil liberties are being excessively curbed in the name of counter-terrorism.",
            type:          "LIKERT_5",
            category:      "social",
            dimensionKeys: ["social_axis"],
            isReversed:    true,
          },
          {
            order:         5,
            text:          "A significant advantage of a one-party state is that it avoids all the arguments that delay progress.",
            type:          "LIKERT_5",
            category:      "social",
            dimensionKeys: ["social_axis"],
            isReversed:    false,
          },
        ],
      },
    },
  })

  // ── Moral Foundations Assessment ─────────────────────────────────────────
  const mft = await db.assessment.upsert({
    where:  { slug: "moral-foundations" },
    update: {},
    create: {
      slug:             "moral-foundations",
      title:            "Moral Foundations",
      description:      "Based on Jonathan Haidt's Moral Foundations Theory — discover which moral values drive your political intuitions.",
      estimatedMinutes: 15,
      version:          "1.0",
      isResearch:       true,

      dimensions: {
        create: [
          { key: "mft_care",      label: "Care / Harm",           weight: 1.0 },
          { key: "mft_fairness",  label: "Fairness / Reciprocity", weight: 1.0 },
          { key: "mft_loyalty",   label: "Loyalty / Betrayal",     weight: 1.0 },
          { key: "mft_authority", label: "Authority / Subversion", weight: 1.0 },
          { key: "mft_sanctity",  label: "Sanctity / Degradation", weight: 1.0 },
          { key: "mft_liberty",   label: "Liberty / Oppression",   weight: 1.0 },
        ],
      },

      questions: {
        create: [
          {
            order:         1,
            text:          "Compassion for those who are suffering is the most crucial virtue.",
            type:          "LIKERT_5",
            category:      "care",
            dimensionKeys: ["mft_care"],
            isReversed:    false,
          },
          {
            order:         2,
            text:          "Justice is the most important requirement for a society.",
            type:          "LIKERT_5",
            category:      "fairness",
            dimensionKeys: ["mft_fairness"],
            isReversed:    false,
          },
          {
            order:         3,
            text:          "I am proud of my country's history.",
            type:          "LIKERT_5",
            category:      "loyalty",
            dimensionKeys: ["mft_loyalty"],
            isReversed:    false,
          },
          {
            order:         4,
            text:          "Respect for authority is something all children need to learn.",
            type:          "LIKERT_5",
            category:      "authority",
            dimensionKeys: ["mft_authority"],
            isReversed:    false,
          },
          {
            order:         5,
            text:          "People should not do things that are disgusting, even if no one is harmed.",
            type:          "LIKERT_5",
            category:      "sanctity",
            dimensionKeys: ["mft_sanctity"],
            isReversed:    false,
          },
        ],
      },
    },
  })

  console.log(`Seeded: ${politicalCompass.slug} (id: ${politicalCompass.id})`)
  console.log(`Seeded: ${mft.slug} (id: ${mft.id})`)
  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
