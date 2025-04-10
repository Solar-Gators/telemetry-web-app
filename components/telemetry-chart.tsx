"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TelemetryChartProps {
  data: any[]
  dataKey: string
  yAxisLabel?: string
  xAxisLabel?: string
  multiLine?: boolean
  nameKey?: string
}

export default function TelemetryChart({
  data,
  dataKey,
  yAxisLabel = "Value",
  xAxisLabel = "Time",
  multiLine = false,
  nameKey = "name",
}: TelemetryChartProps) {
  // Create a config object for ChartContainer
  const chartConfig: Record<string, { label: string; color: string }> = {}

  if (multiLine && data.length > 0) {
    // Get unique names for multiline chart
    const uniqueNames = Array.from(new Set(data.map((item) => item[nameKey])))

    // Create a config entry for each unique name
    uniqueNames.forEach((name, index) => {
      if (typeof name === "string") {
        chartConfig[name] = {
          label: name,
          color: `hsl(var(--chart-${index + 1}))`,
        }
      }
    })
  } else {
    // Single line chart
    chartConfig.value = {
      label: yAxisLabel,
      color: "hsl(var(--chart-1))",
    }
  }

  return (
    <ChartContainer config={chartConfig} className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="time"
            tickFormatter={(value) => {
              const date = new Date(value)
              return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
            }}
            label={{ value: xAxisLabel, position: "insideBottom", offset: -10 }}
          />
          <YAxis label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }} />
          <ChartTooltip content={<ChartTooltipContent />} />

          {multiLine ? (
            // Render multiple lines for multiline chart
            Object.keys(chartConfig).map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={dataKey}
                stroke={`var(--color-${key})`}
                name={key}
                connectNulls
                dot={false}
                activeDot={{ r: 4 }}
                strokeWidth={2}
              />
            ))
          ) : (
            // Render single line
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="var(--color-value)"
              connectNulls
              dot={false}
              activeDot={{ r: 4 }}
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

