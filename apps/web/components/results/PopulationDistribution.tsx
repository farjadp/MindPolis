"use client"

import { useMemo } from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
} from "recharts"

interface PopulationDistributionProps {
    userScore: number // Expected between -1.0 and 1.0
    mu?: number       // Mean of the population
    sigma?: number    // Standard deviation of the population
}

export function PopulationDistribution({
    userScore,
    mu = 0,
    sigma = 0.33,
}: PopulationDistributionProps) {

    // Generate bell curve data points
    const data = useMemo(() => {
        const points = []
        const steps = 60
        for (let i = 0; i <= steps; i++) {
            const x = -1 + (2 * i) / steps
            // Standard normal distribution formula
            const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2))
            const y = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent)
            points.push({ x, y })
        }
        return points
    }, [mu, sigma])

    return (
        <div className="w-full h-32 mt-4 relative">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                    <defs>
                        <linearGradient id="colorCurve" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="x" type="number" domain={[-1, 1]} hide />
                    <YAxis hide />
                    <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px", color: "#f9fafb", fontSize: "12px", fontWeight: "bold" }}
                        formatter={(value: number, name: string, props: any) => {
                            if (name === "y") return [] // hide Y from tooltip
                            return [props.payload.x.toFixed(2), "Score"]
                        }}
                        labelFormatter={() => ""}
                    />
                    <Area
                        type="monotone"
                        dataKey="y"
                        stroke="#9ca3af"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCurve)"
                        isAnimationActive={false}
                    />
                    <ReferenceLine
                        x={userScore}
                        stroke="#2563eb"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        label={{
                            position: "top",
                            value: "You",
                            fill: "#2563eb",
                            fontSize: 10,
                            fontWeight: 700,
                            style: { textTransform: "uppercase", letterSpacing: "0.05em" }
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
