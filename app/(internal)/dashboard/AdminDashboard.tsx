"use client"

import dynamic from "next/dynamic"
import { KPICard } from "@/components/dashboard/KPICard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatNaira, formatDate } from "@/lib/utils"
import { Zap, Users, Wrench, CalendarDays, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const RevenueChart = dynamic(() => import("@/components/dashboard/RevenueChart").then(m => ({ default: m.RevenueChart })), { ssr: false })
const FleetStatusChart = dynamic(() => import("@/components/dashboard/FleetStatusChart").then(m => ({ default: m.FleetStatusChart })), { ssr: false })
const RequestsChart = dynamic(() => import("@/components/dashboard/RequestsChart").then(m => ({ default: m.RequestsChart })), { ssr: false })

interface Props {
  kpis: {
    totalRentals: number
    activeRentals: number
    pendingRepairs: number
    totalCustomers: number
    availableGenerators: number
    totalGenerators: number
    totalRevenue: number
  }
  recentRentals: { id: string; status: string; kvaNeeded: number; startDate: Date; customer: { name: string } | null; generator: { brand: string; kvaCapacity: number } | null }[]
  recentRepairs: { id: string; status: string; urgency: string; generatorBrand: string; customer: { name: string } | null }[]
  fleetStatus: { name: string; value: number }[]
}

export function AdminDashboard({ kpis, recentRentals, recentRepairs, fleetStatus }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A5C]">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Premium Power Solutions — Operations Overview</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" className="bg-[#1B3A5C] hover:bg-[#1B3A5C]/90">
          <Link href="/fleet">Manage Fleet</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="border-[#D4A843] text-[#D4A843] hover:bg-[#D4A843]/10">
          <Link href="/rentals">View Rentals</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/analytics">Analytics</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/staff">Manage Staff</Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatNaira(kpis.totalRevenue)}
          change="+12% from last month"
          changeType="positive"
          icon={<TrendingUp className="h-5 w-5" />}
          color="blue"
        />
        <KPICard
          title="Active Rentals"
          value={kpis.activeRentals}
          subtitle={`${kpis.totalRentals} total`}
          icon={<CalendarDays className="h-5 w-5" />}
          color="gold"
        />
        <KPICard
          title="Available Units"
          value={`${kpis.availableGenerators}/${kpis.totalGenerators}`}
          change={`${Math.round((kpis.availableGenerators / kpis.totalGenerators) * 100)}% available`}
          changeType="neutral"
          icon={<Zap className="h-5 w-5" />}
          color="green"
        />
        <KPICard
          title="Total Customers"
          value={kpis.totalCustomers}
          change="+3 this week"
          changeType="positive"
          icon={<Users className="h-5 w-5" />}
          color="purple"
        />
        <KPICard
          title="Pending Repairs"
          value={kpis.pendingRepairs}
          change={kpis.pendingRepairs > 5 ? "Needs attention" : "Under control"}
          changeType={kpis.pendingRepairs > 5 ? "negative" : "positive"}
          icon={<Wrench className="h-5 w-5" />}
          color={kpis.pendingRepairs > 5 ? "red" : "green"}
        />
        <KPICard
          title="Fleet Utilization"
          value={`${Math.round(((kpis.totalGenerators - kpis.availableGenerators) / kpis.totalGenerators) * 100)}%`}
          subtitle="Units deployed"
          icon={<CheckCircle className="h-5 w-5" />}
          color="blue"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueChart />
        <FleetStatusChart data={fleetStatus.map(f => ({
          name: f.name.charAt(0).toUpperCase() + f.name.slice(1).replace(/_/g, " "),
          value: f.value,
        }))} />
      </div>

      {/* Second charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RequestsChart />

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1B3A5C] text-base flex items-center justify-between">
              Recent Rentals
              <Link href="/rentals" className="text-xs text-[#D4A843] font-normal hover:underline">View all</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRentals.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No rentals yet</p>
              )}
              {recentRentals.map((rental) => (
                <Link key={rental.id} href={`/rentals/${rental.id}`} className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#1B3A5C]">{rental.customer?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {rental.kvaNeeded}KVA · {formatDate(rental.startDate)}
                    </p>
                  </div>
                  <StatusBadge status={rental.status} type="rental" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Repairs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#1B3A5C] text-base flex items-center justify-between">
            Recent Repair Requests
            <Link href="/repairs" className="text-xs text-[#D4A843] font-normal hover:underline">View all</Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {recentRepairs.map((repair) => (
              <Link key={repair.id} href={`/repairs/${repair.id}`} className="flex items-center justify-between p-3 rounded-lg border hover:border-[#1B3A5C]/30 transition-colors">
                <div>
                  <p className="text-sm font-medium">{repair.customer?.name}</p>
                  <p className="text-xs text-muted-foreground">{repair.generatorBrand}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={repair.status} type="repair" />
                  <StatusBadge status={repair.urgency} type="repair" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
