"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = {
  Available: "#10b981",
  Rented: "#1B3A5C",
  Maintenance: "#D4A843",
  "Out of Service": "#ef4444",
}

interface FleetStatusChartProps {
  data?: { name: string; value: number }[]
}

const DEFAULT_DATA = [
  { name: "Available", value: 6 },
  { name: "Rented", value: 7 },
  { name: "Maintenance", value: 1 },
  { name: "Out of Service", value: 1 },
]

export function FleetStatusChart({ data = DEFAULT_DATA }: FleetStatusChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#1B3A5C] text-base">Fleet Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS] || "#6b7280"} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} units`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span className="text-2xl font-bold text-[#1B3A5C]">{total}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] || "#6b7280" }}
              />
              <span className="text-gray-600">{entry.name}</span>
              <span className="font-semibold ml-auto">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
