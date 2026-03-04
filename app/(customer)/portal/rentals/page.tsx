import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { StatusTimeline } from "@/components/shared/StatusTimeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate, formatNaira } from "@/lib/utils"
import Link from "next/link"
import { Plus, Gauge } from "lucide-react"

export default async function CustomerRentalsPage() {
  const session = await auth()
  const rentals = await prisma.rentalRequest.findMany({
    where: { customerId: session?.user?.id! },
    include: { generator: { select: { brand: true, model: true, kvaCapacity: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B3A5C]">My Rentals</h1>
          <p className="text-sm text-muted-foreground">{rentals.length} rental request{rentals.length !== 1 ? "s" : ""}</p>
        </div>
        <Button asChild className="bg-[#1B3A5C]">
          <Link href="/portal/rentals/new">
            <Plus className="mr-2 h-4 w-4" />
            New Rental
          </Link>
        </Button>
      </div>

      {rentals.length === 0 ? (
        <Card className="text-center p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-[#1B3A5C]/10 rounded-full flex items-center justify-center">
              <Gauge className="h-8 w-8 text-[#1B3A5C]" />
            </div>
            <h3 className="font-semibold text-[#1B3A5C]">No rentals yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">Book a generator for your next event, office, or construction project</p>
            <Button asChild className="bg-[#1B3A5C]">
              <Link href="/portal/rentals/new">Book a Generator</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <Card key={rental.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base text-[#1B3A5C]">
                      {rental.kvaNeeded}KVA Rental
                      {rental.generator && ` — ${rental.generator.brand} ${rental.generator.kvaCapacity}KVA`}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(rental.startDate)} → {formatDate(rental.endDate)} · {rental.deliveryLGA}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={rental.status} type="rental" />
                    {rental.totalCost && <span className="text-sm font-semibold text-[#D4A843]">{formatNaira(rental.totalCost)}</span>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StatusTimeline currentStatus={rental.status} type="rental" cancelled={rental.status === "CANCELLED"} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
