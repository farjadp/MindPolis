// ============================================================================
// MindPolis: components/results/ResultsChart.tsx
// Version: 1.0.0 — 2026-03-07
// Why: Recharts radar chart for displaying multi-dimensional assessment
//      results. Must be a client component because Recharts uses browser APIs.
//      Receives pre-fetched, serialized data from the parent RSC — no
//      client-side data fetching happens here.
// Env / Identity: React Client Component — browser only
// ============================================================================

"use client"

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface ChartDataPoint {
  dimension: string
  value: number    // [-1.0, 1.0] for political axes, [0.0, 1.0] for MFT
  fullMark: number
}

interface ResultsChartProps {
  data: ChartDataPoint[]
}

export function ResultsChart({ data }: ResultsChartProps) {
  // ── Normalize data for radar display ─────────────────────────────────────
  // Recharts RadarChart requires non-negative values.
  // We shift [-1, 1] → [0, 1] for display while preserving relative shape.
  const normalizedData = data.map((d) => ({
    ...d,
    displayValue: (d.value + 1) / 2,  // Shift to [0, 1]
  }))

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="font-semibold text-lg mb-4">Score Profile</h2>

      {/* Radar chart — responsive container fills parent width */}
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={normalizedData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid className="stroke-border" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          {/* Hide radius axis labels — raw values are shown in the breakdown section */}
          <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="displayValue"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value: number, _name: string, props: any) => {
              // Show the original signed value in the tooltip, not the display-normalized one
              const original = props.payload?.value
              return [
                typeof original === "number" ? original.toFixed(3) : value,
                "Score",
              ]
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
