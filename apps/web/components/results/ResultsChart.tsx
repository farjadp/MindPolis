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
  // Pass labels for 2D compass mapping if available
  // e.g. [{ minLabel: "Left", maxLabel: "Right" }, { minLabel: "Lib", maxLabel: "Auth" }]
  axisLabels?: { xMin: string, xMax: string, yMin: string, yMax: string }
}

export function ResultsChart({ data, axisLabels }: ResultsChartProps) {
  // If exactly 2 dimensions, render a 2D Compass instead of a Radar (which would just be a line)
  if (data.length === 2) {
    return <Compass2D data={data} labels={axisLabels} />
  }

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

function Compass2D({ data, labels }: { data: ChartDataPoint[], labels?: { xMin: string, xMax: string, yMin: string, yMax: string } }) {
  // Assume data[0] is X-axis (Economic), data[1] is Y-axis (Authority)
  const xScore = data[0].value;
  const yScore = data[1].value;

  // Calculate percentage for placement (Range [-1, 1] maps to [0%, 100%])
  // Reverse Y axis so +1 (Authoritarian) is TOP (0%), -1 (Libertarian) is BOTTOM (100%)
  const xPercent = ((xScore + 1) / 2) * 100;
  const yPercent = ((1 - yScore) / 2) * 100;

  // Fallback Labels if not provided by parent
  const xMin = labels?.xMin || "-1"
  const xMax = labels?.xMax || "+1"
  const yMin = labels?.yMin || "-1"
  const yMax = labels?.yMax || "+1"

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto p-4 md:p-8">
      {/* Label container to give some outer padding */}
      <div className="absolute inset-0 flex flex-col justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 py-2">
        <span>{yMax}</span>
        <span>{yMin}</span>
      </div>
      <div className="absolute inset-0 flex flex-row justify-between items-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 px-2 pointer-events-none">
        <span>{xMin}</span>
        <span>{xMax}</span>
      </div>

      {/* Grid container */}
      <div className="relative w-full h-full rounded-[12px] bg-gray-50 border border-gray-200 shadow-inner overflow-hidden my-4" style={{ paddingBottom: "100%", height: 0 }}>
        <div className="absolute inset-0">
          {/* Quadrants background (optional subtle styling) */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-red-500/5 transition-colors"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-green-500/5 transition-colors"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500/5 transition-colors"></div>

          {/* Axes lines */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-300 transform -translate-x-1/2"></div>
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300 transform -translate-y-1/2"></div>

          {/* Faint grid lines for texture */}
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-200/50"></div>
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-200/50"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-200/50"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gray-200/50"></div>

          {/* Data point */}
          <div
            className="absolute z-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-600 border-4 border-white shadow-lg shadow-blue-600/30 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out"
            style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
          >
            {/* Value tooltip on hover */}
            <div className="opacity-0 hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-[6px] shadow-xl whitespace-nowrap transition-opacity pointer-events-none">
              <span className="opacity-75">{data[0].dimension}:</span> {(xScore > 0 ? "+" : "") + xScore.toFixed(2)}<br />
              <span className="opacity-75">{data[1].dimension}:</span> {(yScore > 0 ? "+" : "") + yScore.toFixed(2)}
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-600 animate-ping opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
