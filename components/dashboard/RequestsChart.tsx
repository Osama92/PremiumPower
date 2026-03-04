"use client"

import { useState, useMemo } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"

type Range = "4w" | "8w" | "12w" | "6m"

const ALL_DATA = [
  { week: "Jan W1", rentals: 5,  repairs: 3,  orders: 8  },
  { week: "Jan W2", rentals: 8,  repairs: 4,  orders: 10 },
  { week: "Jan W3", rentals: 7,  repairs: 6,  orders: 12 },
  { week: "Jan W4", rentals: 11, repairs: 5,  orders: 9  },
  { week: "Feb W1", rentals: 9,  repairs: 4,  orders: 11 },
  { week: "Feb W2", rentals: 12, repairs: 6,  orders: 9  },
  { week: "Feb W3", rentals: 7,  repairs: 8,  orders: 15 },
  { week: "Feb W4", rentals: 15, repairs: 5,  orders: 11 },
  { week: "Mar W1", rentals: 10, repairs: 7,  orders: 13 },
  { week: "Mar W2", rentals: 13, repairs: 9,  orders: 8  },
  { week: "Mar W3", rentals: 11, repairs: 4,  orders: 14 },
  { week: "Mar W4", rentals: 16, repairs: 7,  orders: 10 },
  { week: "Apr W1", rentals: 8,  repairs: 5,  orders: 9  },
  { week: "Apr W2", rentals: 14, repairs: 8,  orders: 12 },
  { week: "Apr W3", rentals: 9,  repairs: 6,  orders: 11 },
  { week: "Apr W4", rentals: 18, repairs: 10, orders: 15 },
  { week: "May W1", rentals: 12, repairs: 4,  orders: 13 },
  { week: "May W2", rentals: 15, repairs: 7,  orders: 16 },
  { week: "May W3", rentals: 10, repairs: 9,  orders: 11 },
  { week: "May W4", rentals: 19, repairs: 6,  orders: 14 },
  { week: "Jun W1", rentals: 14, repairs: 5,  orders: 12 },
  { week: "Jun W2", rentals: 17, repairs: 8,  orders: 10 },
  { week: "Jun W3", rentals: 13, repairs: 7,  orders: 16 },
  { week: "Jun W4", rentals: 20, repairs: 9,  orders: 18 },
]

const RANGE_MAP: Record<Range, { label: string; weeks: number }> = {
  "4w":  { label: "4 Weeks",   weeks: 4  },
  "8w":  { label: "8 Weeks",   weeks: 8  },
  "12w": { label: "12 Weeks",  weeks: 12 },
  "6m":  { label: "6 Months",  weeks: 24 },
}

export function RequestsChart() {
  const [range, setRange] = useState<Range>("8w")
  const data = useMemo(() => ALL_DATA.slice(-RANGE_MAP[range].weeks), [range])

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div>
          <h2 className="text-[13px] font-semibold text-gray-800">Weekly Activity</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Rentals, repairs & orders over time</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(Object.keys(RANGE_MAP) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                range === r
                  ? "bg-white text-[#0f2440] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {RANGE_MAP[r].label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              interval={range === "6m" ? 3 : range === "12w" ? 1 : 0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
              cursor={{ fill: "#f9fafb" }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
            <Bar dataKey="rentals" fill="#0f2440" name="Rentals" radius={[3, 3, 0, 0]} maxBarSize={18} />
            <Bar dataKey="repairs" fill="#D4A843" name="Repairs" radius={[3, 3, 0, 0]} maxBarSize={18} />
            <Bar dataKey="orders"  fill="#10b981" name="Orders"  radius={[3, 3, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
