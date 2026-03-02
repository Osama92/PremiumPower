import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate, formatNaira } from "@/lib/utils"
import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"

export default async function RentalsPage() {
  const session = await auth()
  const where: Record<string, unknown> = {}
  if (session?.user?.role === "ENGINEER") where.engineerId = session.user.id

  const rentals = await prisma.rentalRequest.findMany({
    where,
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      generator: { select: { brand: true, model: true, kvaCapacity: true } },
      engineer: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const statusGroups = {
    active: rentals.filter((r) => ["BOOKED", "CONFIRMED", "DISPATCHED", "DELIVERED", "INSTALLED", "ACTIVE"].includes(r.status)),
    pickup: rentals.filter((r) => ["PICKUP_SCHEDULED", "RETURNED"].includes(r.status)),
    completed: rentals.filter((r) => ["INSPECTED"].includes(r.status)),
    cancelled: rentals.filter((r) => r.status === "CANCELLED"),
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rental Requests"
        description={`${rentals.length} total · ${statusGroups.active.length} active`}
      />

      {/* Status tabs summary */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Active", count: statusGroups.active.length, color: "bg-green-50 text-green-700 border-green-200" },
          { label: "Pickup", count: statusGroups.pickup.length, color: "bg-orange-50 text-orange-700 border-orange-200" },
          { label: "Completed", count: statusGroups.completed.length, color: "bg-gray-50 text-gray-700 border-gray-200" },
          { label: "Cancelled", count: statusGroups.cancelled.length, color: "bg-red-50 text-red-700 border-red-200" },
        ].map((tab) => (
          <div key={tab.label} className={`rounded-lg border p-3 text-center ${tab.color}`}>
            <p className="text-xl font-bold">{tab.count}</p>
            <p className="text-xs">{tab.label}</p>
          </div>
        ))}
      </div>

      {/* All rentals list */}
      <div className="space-y-3">
        {rentals.map((rental) => (
          <Link key={rental.id} href={`/rentals/${rental.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-[#1B3A5C] truncate">{rental.customer?.name}</p>
                      <StatusBadge status={rental.status} type="rental" />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(rental.startDate)} → {formatDate(rental.endDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {rental.deliveryLGA || rental.deliveryAddress.split(",")[0]}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-[#1B3A5C]">{rental.kvaNeeded}KVA</p>
                    {rental.generator && (
                      <p className="text-xs text-muted-foreground">{rental.generator.brand}</p>
                    )}
                    {rental.totalCost && (
                      <p className="text-sm font-medium text-[#D4A843]">{formatNaira(rental.totalCost)}</p>
                    )}
                  </div>
                </div>
                {rental.engineer && (
                  <p className="text-xs text-muted-foreground mt-2">Engineer: {rental.engineer.name}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
        {rentals.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No rental requests found</p>
        )}
      </div>
    </div>
  )
}
