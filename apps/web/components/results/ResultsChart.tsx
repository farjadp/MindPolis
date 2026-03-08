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
  // Recharts RadarChart requires non-negative values.
  // We shift [-1, 1] → [0, 1] for display while preserving relative shape.
  const normalizedData = data.map((d) => ({
    ...d,
    displayValue: (d.value + 1) / 2,  // Shift to [0, 1]
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={normalizedData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fontSize: 11, fontWeight: 700, fill: "#6b7280", style: { textTransform: "uppercase", letterSpacing: "0.05em" } }}
        />
        <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />
        <Radar
          name="Ideology Map"
          dataKey="displayValue"
          stroke="#2563eb"
          fill="#3b82f6"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px", color: "#f9fafb", fontSize: "12px", fontWeight: "bold" }}
          itemStyle={{ color: "#60a5fa" }}
          formatter={(value: number, _name: string, props: any) => {
            const original = props.payload?.value
            return [
              typeof original === "number" ? (original > 0 ? "+" : "") + original.toFixed(2) : value,
              "Score",
            ]
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
