import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/shared/PageHeader"
import { KPICard } from "@/components/dashboard/KPICard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNaira, formatDate } from "@/lib/utils"
import { TrendingUp, Users, Zap, ShoppingCart, Wrench, CalendarDays } from "lucide-react"
import { AnalyticsCharts } from "./AnalyticsCharts"

export default async function AnalyticsPage() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/dashboard")

  const [
    totalRentals, activeRentals, totalRepairs, totalOrders,
    totalCustomers, totalGenerators, availableGenerators,
    topParts, recentInvoices,
  ] = await Promise.all([
    prisma.rentalRequest.count(),
    prisma.rentalRequest.count({ where: { status: "ACTIVE" } }),
    prisma.repairRequest.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.generator.count(),
    prisma.generator.count({ where: { status: "AVAILABLE" } }),
    prisma.sparePart.findMany({
      orderBy: { stockQuantity: "asc" },
      take: 5,
    }),
    prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true } } },
    }),
  ])

  const rentalRevenue = await prisma.rentalRequest.aggregate({ _sum: { totalCost: true } })
  const orderRevenue = await prisma.order.aggregate({ _sum: { totalAmount: true } })
  const totalRevenue = (rentalRevenue._sum.totalCost || 0) + (orderRevenue._sum.totalAmount || 0)

  const fleetStatus = await prisma.generator.groupBy({
    by: ["status"],
    _count: { id: true },
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics & Reports" description="Business performance overview" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard title="Total Revenue" value={formatNaira(totalRevenue)} icon={<TrendingUp className="h-4 w-4" />} color="blue" />
        <KPICard title="Rentals" value={totalRentals} subtitle={`${activeRentals} active`} icon={<CalendarDays className="h-4 w-4" />} color="gold" />
        <KPICard title="Repairs" value={totalRepairs} icon={<Wrench className="h-4 w-4" />} color="purple" />
        <KPICard title="Orders" value={totalOrders} icon={<ShoppingCart className="h-4 w-4" />} color="green" />
        <KPICard title="Customers" value={totalCustomers} icon={<Users className="h-4 w-4" />} color="blue" />
        <KPICard title="Fleet" value={`${availableGenerators}/${totalGenerators}`} subtitle="available" icon={<Zap className="h-4 w-4" />} color="gold" />
      </div>

      <AnalyticsCharts fleetStatus={fleetStatus.map((f) => ({
        name: f.status.replace("_", " "),
        value: f._count.id,
      }))} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top parts by low stock */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1B3A5C] text-sm">Spare Parts — Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            {topParts.map((part) => (
              <div key={part.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{part.name}</p>
                  <p className="text-xs text-muted-foreground">{part.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{part.stockQuantity} left</p>
                  <p className="text-xs text-muted-foreground">Reorder at {part.reorderLevel}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
