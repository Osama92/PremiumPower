"use client"

import dynamic from "next/dynamic"

const RevenueChart = dynamic(() => import("@/components/dashboard/RevenueChart").then(m => ({ default: m.RevenueChart })), { ssr: false })
const RequestsChart = dynamic(() => import("@/components/dashboard/RequestsChart").then(m => ({ default: m.RequestsChart })), { ssr: false })
const FleetStatusChart = dynamic(() => import("@/components/dashboard/FleetStatusChart").then(m => ({ default: m.FleetStatusChart })), { ssr: false })

interface Props {
  fleetStatus: { name: string; value: number }[]
}

export function AnalyticsCharts({ fleetStatus }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <FleetStatusChart data={fleetStatus} />
      </div>
      <RequestsChart />
    </div>
  )
}
