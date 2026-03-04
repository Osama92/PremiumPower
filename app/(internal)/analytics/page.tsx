import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { KPICard } from "@/components/dashboard/KPICard"
import { formatNaira, formatDate, cn } from "@/lib/utils"
import { TrendingUp, Users, Gauge, ShoppingCart, Wrench, CalendarDays, AlertTriangle, FileText } from "lucide-react"
import { AnalyticsCharts } from "./AnalyticsCharts"
import Link from "next/link"

export default async function AnalyticsPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/dashboard")

  const [
    totalRentals, activeRentals, completedRentals,
    totalRepairs, completedRepairs, pendingRepairs,
    totalOrders, totalCustomers, totalGenerators, availableGenerators,
    lowStockParts, recentInvoices, topCustomers,
  ] = await Promise.all([
    prisma.rentalRequest.count(),
    prisma.rentalRequest.count({ where: { status: "ACTIVE" } }),
    prisma.rentalRequest.count({ where: { status: { in: ["RETURNED", "INSPECTED"] } } }),
    prisma.repairRequest.count(),
    prisma.repairRequest.count({ where: { status: { in: ["COMPLETED", "INVOICED", "PAID"] } } }),
    prisma.repairRequest.count({ where: { status: { in: ["SUBMITTED", "ASSESSED"] } } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.generator.count(),
    prisma.generator.count({ where: { status: "AVAILABLE" } }),
    prisma.sparePart.findMany({
      where: { stockQuantity: { lte: 5 } },
      orderBy: { stockQuantity: "asc" },
      take: 8,
    }),
    prisma.invoice.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true } } },
    }),
    prisma.rentalRequest.groupBy({
      by: ["customerId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ])

  const rentalRevenue = await prisma.rentalRequest.aggregate({ _sum: { totalCost: true } })
  const orderRevenue = await prisma.order.aggregate({ _sum: { totalAmount: true } })
  const totalRevenue = (rentalRevenue._sum.totalCost || 0) + (orderRevenue._sum.totalAmount || 0)
  const rentalRev = rentalRevenue._sum.totalCost || 0
  const orderRev = orderRevenue._sum.totalAmount || 0

  const fleetStatus = await prisma.generator.groupBy({
    by: ["status"],
    _count: { id: true },
  })

  const utilizationPct = Math.round(((totalGenerators - availableGenerators) / (totalGenerators || 1)) * 100)
  const repairCompletionPct = totalRepairs > 0 ? Math.round((completedRepairs / totalRepairs) * 100) : 0

  // Get top customer names
  const topCustomerIds = topCustomers.map((c) => c.customerId)
  const topCustomerUsers = await prisma.user.findMany({
    where: { id: { in: topCustomerIds } },
    select: { id: true, name: true, email: true },
  })
  const topCustomerMap = new Map(topCustomerUsers.map((u) => [u.id, u]))

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Analytics & Reports</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Business performance overview — Premium Power Solutions</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          title="Total Revenue"
          value={formatNaira(totalRevenue)}
          subtitle={`Rentals + Orders`}
          icon={<TrendingUp className="h-[15px] w-[15px]" />}
          color="blue"
        />
        <KPICard
          title="Rentals"
          value={totalRentals}
          subtitle={`${activeRentals} active`}
          change={`${completedRentals} completed`}
          changeType="positive"
          icon={<CalendarDays className="h-[15px] w-[15px]" />}
          color="gold"
        />
        <KPICard
          title="Repairs"
          value={totalRepairs}
          subtitle={`${repairCompletionPct}% completed`}
          change={pendingRepairs > 0 ? `${pendingRepairs} pending review` : "All reviewed"}
          changeType={pendingRepairs > 3 ? "negative" : "positive"}
          icon={<Wrench className="h-[15px] w-[15px]" />}
          color="purple"
        />
        <KPICard
          title="Orders"
          value={totalOrders}
          subtitle={formatNaira(orderRev)}
          icon={<ShoppingCart className="h-[15px] w-[15px]" />}
          color="green"
        />
        <KPICard
          title="Customers"
          value={totalCustomers}
          icon={<Users className="h-[15px] w-[15px]" />}
          color="blue"
        />
        <KPICard
          title="Fleet"
          value={`${availableGenerators}/${totalGenerators}`}
          subtitle={`${utilizationPct}% deployed`}
          icon={<Gauge className="h-[15px] w-[15px]" />}
          color="gold"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Rental Revenue</p>
          <p className="text-[28px] font-bold text-[#0f2440] mt-1 leading-none">{formatNaira(rentalRev)}</p>
          <p className="text-[12px] text-gray-400 mt-1">
            {totalRevenue > 0 ? Math.round((rentalRev / totalRevenue) * 100) : 0}% of total revenue
          </p>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0f2440] rounded-full"
              style={{ width: `${totalRevenue > 0 ? (rentalRev / totalRevenue) * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Parts & Orders Revenue</p>
          <p className="text-[28px] font-bold text-[#D4A843] mt-1 leading-none">{formatNaira(orderRev)}</p>
          <p className="text-[12px] text-gray-400 mt-1">
            {totalRevenue > 0 ? Math.round((orderRev / totalRevenue) * 100) : 0}% of total revenue
          </p>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4A843] rounded-full"
              style={{ width: `${totalRevenue > 0 ? (orderRev / totalRevenue) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <AnalyticsCharts fleetStatus={fleetStatus.map((f) => ({
        name: f.status.replace(/_/g, " "),
        value: f._count.id,
      }))} />

      {/* Data Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <h2 className="text-[13px] font-semibold text-gray-900 uppercase tracking-wide">Low Stock Alert</h2>
            </div>
            <Link href="/parts" className="text-xs text-[#D4A843] font-semibold hover:underline">Manage</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStockParts.length === 0 && (
              <p className="text-[13px] text-gray-400 text-center py-8">All parts well-stocked</p>
            )}
            {lowStockParts.map((part) => {
              const pct = Math.min(100, (part.stockQuantity / (part.reorderLevel || 1)) * 100)
              return (
                <div key={part.id} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[13px] font-medium text-gray-900 truncate flex-1 mr-2">{part.name}</p>
                    <span className={`text-[12px] font-bold ${part.stockQuantity === 0 ? "text-red-600" : "text-amber-600"}`}>
                      {part.stockQuantity} left
                    </span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${part.stockQuantity === 0 ? "bg-red-500" : "bg-amber-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{part.category} · reorder at {part.reorderLevel}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Customers by Rentals */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-[13px] font-semibold text-gray-900 uppercase tracking-wide">Top Customers</h2>
            <Link href="/customers" className="text-xs text-[#D4A843] font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {topCustomers.length === 0 && (
              <p className="text-[13px] text-gray-400 text-center py-8">No data yet</p>
            )}
            {topCustomers.map((c, i) => {
              const user = topCustomerMap.get(c.customerId)
              return (
                <div key={c.customerId} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-[11px] font-bold text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900 truncate">{user?.name || "—"}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <span className="text-[12px] font-bold text-[#0f2440] flex-shrink-0">{c._count.id} rentals</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-gray-500" />
              <h2 className="text-[13px] font-semibold text-gray-900 uppercase tracking-wide">Recent Invoices</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {recentInvoices.length === 0 && (
              <p className="text-[13px] text-gray-400 text-center py-8">No invoices yet</p>
            )}
            {recentInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900 truncate">{inv.customer?.name}</p>
                  <p className="text-[11px] text-gray-400">{formatDate(inv.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[13px] font-bold text-[#0f2440]">{formatNaira(inv.amount)}</span>
                  <span className={cn(
                    "text-[11px] font-medium px-2 py-0.5 rounded-full",
                    inv.status === "PAID" ? "bg-emerald-50 text-emerald-700" :
                    inv.status === "OVERDUE" ? "bg-red-50 text-red-700" :
                    inv.status === "SENT" ? "bg-blue-50 text-blue-700" :
                    inv.status === "CANCELLED" ? "bg-gray-100 text-gray-500" :
                    "bg-gray-100 text-gray-600"
                  )}>{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
