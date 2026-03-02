"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { formatNaira } from "@/lib/utils"

const MOCK_DATA = [
  { month: "Sep", rental: 2800000, repair: 650000, parts: 320000 },
  { month: "Oct", rental: 3200000, repair: 780000, parts: 410000 },
  { month: "Nov", rental: 4100000, repair: 920000, parts: 580000 },
  { month: "Dec", rental: 5600000, repair: 1100000, parts: 720000 },
  { month: "Jan", rental: 3800000, repair: 840000, parts: 490000 },
  { month: "Feb", rental: 4500000, repair: 980000, parts: 610000 },
  { month: "Mar", rental: 5200000, repair: 1050000, parts: 680000 },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-gray-600 capitalize">{p.name}:</span>
            <span className="font-semibold">{formatNaira(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function RevenueChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-[#1B3A5C] text-base">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={MOCK_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="rentalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B3A5C" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1B3A5C" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="repairGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A843" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#D4A843" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="partsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="rental" stroke="#1B3A5C" fill="url(#rentalGradient)" strokeWidth={2} name="Rental" />
            <Area type="monotone" dataKey="repair" stroke="#D4A843" fill="url(#repairGradient)" strokeWidth={2} name="Repair" />
            <Area type="monotone" dataKey="parts" stroke="#10b981" fill="url(#partsGradient)" strokeWidth={2} name="Parts" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
