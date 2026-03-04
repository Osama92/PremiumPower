"use client"

import dynamic from "next/dynamic"
import { KPICard } from "@/components/dashboard/KPICard"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatNaira, formatDate } from "@/lib/utils"
import { Gauge, Users, Wrench, CalendarDays, TrendingUp, CheckCircle } from "lucide-react"
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
    <div className="space-y-7">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Operations Overview</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Premium Power Solutions — Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="h-8 text-[13px] border-gray-300">
            <Link href="/analytics">Analytics</Link>
          </Button>
          <Button asChild size="sm" className="h-8 text-[13px] bg-[#0f2440] hover:bg-[#0f2440]/90">
            <Link href="/fleet">Manage Fleet</Link>
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <KPICard
          title="Total Revenue"
          value={formatNaira(kpis.totalRevenue)}
          change="+12% this month"
          changeType="positive"
          icon={<TrendingUp className="h-[18px] w-[18px]" />}
          color="blue"
        />
        <KPICard
          title="Active Rentals"
          value={kpis.activeRentals}
          subtitle={`${kpis.totalRentals} total jobs`}
          icon={<CalendarDays className="h-[18px] w-[18px]" />}
          color="gold"
        />
        <KPICard
          title="Fleet Available"
          value={`${kpis.availableGenerators}/${kpis.totalGenerators}`}
          change={`${Math.round((kpis.availableGenerators / kpis.totalGenerators) * 100)}% ready`}
          changeType="neutral"
          icon={<Gauge className="h-[18px] w-[18px]" />}
          color="green"
        />
        <KPICard
          title="Customers"
          value={kpis.totalCustomers}
          change="+3 this week"
          changeType="positive"
          icon={<Users className="h-[18px] w-[18px]" />}
          color="purple"
        />
        <KPICard
          title="Pending Repairs"
          value={kpis.pendingRepairs}
          change={kpis.pendingRepairs > 5 ? "Needs attention" : "On track"}
          changeType={kpis.pendingRepairs > 5 ? "negative" : "positive"}
          icon={<Wrench className="h-[18px] w-[18px]" />}
          color={kpis.pendingRepairs > 5 ? "red" : "green"}
        />
        <KPICard
          title="Utilization"
          value={`${Math.round(((kpis.totalGenerators - kpis.availableGenerators) / kpis.totalGenerators) * 100)}%`}
          subtitle="Fleet deployed"
          icon={<CheckCircle className="h-[18px] w-[18px]" />}
          color="blue"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <RevenueChart />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <FleetStatusChart data={fleetStatus.map(f => ({
            name: f.name.charAt(0).toUpperCase() + f.name.slice(1).replace(/_/g, " "),
            value: f.value,
          }))} />
        </div>
      </div>

      {/* Activity + Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Rentals */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-[13px] font-semibold text-gray-900 uppercase tracking-wide">Recent Rentals</h2>
            <Link href="/rentals" className="text-xs text-[#D4A843] font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentRentals.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No rentals yet</p>
            )}
            {recentRentals.map((rental) => (
              <Link
                key={rental.id}
                href={`/rentals/${rental.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/80 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900 truncate">{rental.customer?.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {rental.kvaNeeded} KVA · {formatDate(rental.startDate)}
                  </p>
                </div>
                <StatusBadge status={rental.status} type="rental" />
              </Link>
            ))}
          </div>
        </div>

        {/* Requests Chart */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <RequestsChart />
        </div>
      </div>

      {/* Recent Repairs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-[13px] font-semibold text-gray-900 uppercase tracking-wide">Recent Repair Requests</h2>
          <div className="flex items-center gap-3">
            <Link href="/repairs" className="text-xs text-[#D4A843] font-semibold hover:underline">View all</Link>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-gray-100">
          {recentRepairs.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8 col-span-2 bg-white">No repairs yet</p>
          )}
          {recentRepairs.map((repair) => (
            <Link
              key={repair.id}
              href={`/repairs/${repair.id}`}
              className="flex items-center justify-between px-5 py-3.5 bg-white hover:bg-gray-50/80 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 truncate">{repair.customer?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{repair.generatorBrand}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <StatusBadge status={repair.status} type="repair" />
                <StatusBadge status={repair.urgency} type="repair" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button asChild size="sm" variant="outline" className="h-7 text-xs border-gray-300 text-gray-600">
          <Link href="/rentals">All Rentals</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="h-7 text-xs border-gray-300 text-gray-600">
          <Link href="/customers">Customers</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="h-7 text-xs border-gray-300 text-gray-600">
          <Link href="/staff">Staff</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="h-7 text-xs border-[#D4A843]/50 text-[#b88a25]">
          <Link href="/parts">Parts Inventory</Link>
        </Button>
      </div>
    </div>
  )
}
