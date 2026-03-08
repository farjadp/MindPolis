// ============================================================================
// MindPolis: lib/archetypes.ts
// Version: 1.0.0
// Why: Deterministically assigns one of the 10 premium archetypes based on 
//      the user's top scoring dimensions. Extracts top dimensions for badges.
// ============================================================================

export const ARCHETYPES = [
    "The Civic Rationalist",
    "The Progressive Universalist",
    "The Institutional Guardian",
    "The Egalitarian Pragmatist",
    "The Sovereign Individualist",
    "The Traditional Communitarian",
    "The Systemic Reformer",
    "The Ethical Pluralist",
    "The Stability Anchor",
    "The Radical Empiricist"
];

/**
 * Given a flat map of scores (e.g. { 'care': 85, 'authority': 20 }), 
 * returns the Top 3 dimensions, their values, and assigns an Archetype.
 */
export function calculateResultIdentity(scores: Record<string, number>) {
    // 1. Sort dimensions by score (descending)
    const entries = Object.entries(scores)
        .filter(([key]) => key !== 'overall' && key !== 'total') // Exclude meta-keys if they exist
        .sort(([, a], [, b]) => (b as number) - (a as number));

    const top3 = entries.slice(0, 3).map(([key, value]) => ({ key, value }));
    const topKeys = top3.map(t => t.key.toLowerCase());

    // 2. Fallback heuristic archetype assignment 
    // (In a real ML system, this would use K-Means clustering of the 8D vector)
    let archetype = "The Ethical Pluralist"; // Default

    const has = (keyword: string) => topKeys.some(k => k.includes(keyword));

    if (has("fairness") && has("care")) {
        archetype = "The Progressive Universalist";
    } else if (has("fairness") && (has("proportionality") || has("liberty"))) {
        archetype = "The Civic Rationalist";
    } else if (has("authority") && has("loyalty")) {
        archetype = "The Institutional Guardian";
    } else if (has("liberty") && !has("authority")) {
        archetype = "The Sovereign Individualist";
    } else if (has("loyalty") && has("sanctity")) {
        archetype = "The Traditional Communitarian";
    } else if (has("fairness") && has("loyalty")) {
        archetype = "The Egalitarian Pragmatist";
    } else if (has("sanctity") && has("authority")) {
        archetype = "The Stability Anchor";
    } else if (has("care") && !has("authority")) {
        archetype = "The Systemic Reformer";
    } else if (has("liberty") && has("proportionality")) {
        archetype = "The Radical Empiricist";
    }

    return {
        archetype,
        topDimensions: top3
    };
}
