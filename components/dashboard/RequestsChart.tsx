"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"

const MOCK_DATA = [
  { week: "W1", rentals: 8, repairs: 4, orders: 12 },
  { week: "W2", rentals: 12, repairs: 6, orders: 9 },
  { week: "W3", rentals: 7, repairs: 8, orders: 15 },
  { week: "W4", rentals: 15, repairs: 5, orders: 11 },
  { week: "W5", rentals: 10, repairs: 7, orders: 13 },
  { week: "W6", rentals: 13, repairs: 9, orders: 8 },
]

export function RequestsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#1B3A5C] text-base">Weekly Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MOCK_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="rentals" fill="#1B3A5C" name="Rentals" radius={[3, 3, 0, 0]} />
            <Bar dataKey="repairs" fill="#D4A843" name="Repairs" radius={[3, 3, 0, 0]} />
            <Bar dataKey="orders" fill="#10b981" name="Orders" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
