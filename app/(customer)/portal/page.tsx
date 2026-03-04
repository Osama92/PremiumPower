import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { formatDate, formatNaira } from "@/lib/utils"
import { Gauge, Wrench, Package, ClipboardCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function CustomerPortalPage() {
  const session = await auth()
  const userId = session?.user?.id!

  const [activeRentals, pendingRepairs, recentOrders, notifications] = await Promise.all([
    prisma.rentalRequest.findMany({
      where: { customerId: userId, status: { in: ["BOOKED", "CONFIRMED", "DISPATCHED", "DELIVERED", "INSTALLED", "ACTIVE"] } },
      include: { generator: { select: { brand: true, kvaCapacity: true } } },
      orderBy: { startDate: "asc" },
      take: 3,
    }),
    prisma.repairRequest.findMany({
      where: { customerId: userId, status: { not: "PAID" } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.order.findMany({
      where: { customerId: userId },
      include: { items: { include: { sparePart: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.notification.findMany({
      where: { userId, readAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  const quickActions = [
    { label: "Rent a Generator", description: "Book generator for your event or business", href: "/portal/rentals/new", icon: Gauge, color: "bg-[#0f2440]" },
    { label: "Request Repair", description: "Get your generator diagnosed and fixed", href: "/portal/repairs/new", icon: Wrench, color: "bg-orange-600" },
    { label: "Buy Spare Parts", description: "Browse our full parts catalog", href: "/portal/store", icon: Package, color: "bg-emerald-600" },
    { label: "Maintenance Plan", description: "Subscribe to regular service visits", href: "/portal/maintenance", icon: ClipboardCheck, color: "bg-purple-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#1B3A5C] to-[#1B3A5C]/80 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {session?.user?.name?.split(" ")[0]}! 👋</h1>
        <p className="text-white/70 mt-1">How can Premium Power Solutions help you today?</p>
        {notifications.length > 0 && (
          <div className="mt-3 bg-white/10 rounded-lg p-3">
            <p className="text-sm font-medium text-[#D4A843]">{notifications.length} unread notification{notifications.length > 1 ? "s" : ""}</p>
            <p className="text-xs text-white/70">{notifications[0]?.message}</p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-start gap-3">
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#1B3A5C] text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Active rentals */}
      {activeRentals.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[#1B3A5C]">Active Rentals</h2>
            <Link href="/portal/rentals" className="text-xs text-[#D4A843] flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {activeRentals.map((rental) => (
              <Link key={rental.id} href={`/portal/rentals/${rental.id}`}>
                <Card className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1B3A5C]/10 rounded-lg flex items-center justify-center">
                        <Gauge className="h-4 w-4 text-[#0f2440]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{rental.kvaNeeded}KVA {rental.generator ? `— ${rental.generator.brand}` : ""}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(rental.startDate)} → {formatDate(rental.endDate)}</p>
                      </div>
                    </div>
                    <StatusBadge status={rental.status} type="rental" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pending Repairs */}
      {pendingRepairs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[#1B3A5C]">Repair Requests</h2>
            <Link href="/portal/repairs" className="text-xs text-[#D4A843] flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {pendingRepairs.map((repair) => (
              <Card key={repair.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{repair.generatorBrand}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{repair.problemDescription}</p>
                  </div>
                  <StatusBadge status={repair.status} type="repair" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[#1B3A5C]">Recent Orders</h2>
            <Link href="/portal/orders" className="text-xs text-[#D4A843] flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{order.items.map((i) => i.sparePart?.name).join(", ")}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#D4A843]">{formatNaira(order.totalAmount)}</span>
                    <StatusBadge status={order.status} type="order" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp CTA */}
      <Card className="bg-gradient-to-r from-green-600 to-green-700 border-0 text-white">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Need urgent help?</p>
            <p className="text-sm text-white/80">Chat with PPS Support on WhatsApp</p>
          </div>
          <Button asChild variant="secondary" className="bg-white text-green-700 hover:bg-white/90">
            <a href="https://wa.me/2347038581722" target="_blank" rel="noopener noreferrer">
              Chat Now
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
