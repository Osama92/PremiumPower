import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { StatusTimeline } from "@/components/shared/StatusTimeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatNaira, formatPhone } from "@/lib/utils"
import { MapPin, Phone, Calendar, Zap, User } from "lucide-react"
import { RentalStatusUpdate } from "./RentalStatusUpdate"

export default async function RentalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      generator: true,
      engineer: { select: { id: true, name: true, phone: true } },
      invoices: true,
      fieldReports: { include: { engineer: { select: { name: true } } } },
    },
  })

  if (!rental) notFound()

  const engineers = await prisma.user.findMany({
    where: { role: "ENGINEER", isActive: true },
    select: { id: true, name: true },
  })

  const availableGenerators = await prisma.generator.findMany({
    where: { status: "AVAILABLE", kvaCapacity: { gte: rental.kvaNeeded } },
    select: { id: true, brand: true, model: true, kvaCapacity: true },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Rental #${rental.id.slice(-6).toUpperCase()}`}
        description={`${rental.kvaNeeded}KVA rental for ${rental.customer?.name}`}
        action={
          ["ADMIN", "CUSTOMER_SERVICE"].includes(session?.user?.role || "") ? (
            <RentalStatusUpdate
              rentalId={rental.id}
              currentStatus={rental.status}
              engineers={engineers}
              currentEngineerId={rental.engineerId || undefined}
              availableGenerators={availableGenerators}
              currentGeneratorId={rental.generatorId || undefined}
            />
          ) : undefined
        }
      />

      <div className="grid md:grid-cols-3 gap-4">
        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1B3A5C] text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusTimeline currentStatus={rental.status} type="rental" cancelled={rental.status === "CANCELLED"} />
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#1B3A5C] text-sm">Rental Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Customer */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Customer</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{rental.customer?.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">{rental.customer?.email}</p>
                  {rental.customer?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatPhone(rental.customer.phone)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Generator */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Generator</p>
                {rental.generator ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{rental.generator.brand} {rental.generator.model}</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">{rental.generator.kvaCapacity}KVA · {rental.generator.serialNumber}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Not yet assigned</p>
                )}
              </div>

              {/* Dates */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Period</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(rental.startDate)} → {formatDate(rental.endDate)}</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Delivery Location</p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm">{rental.deliveryAddress}</p>
                    {rental.deliveryLGA && <p className="text-xs text-muted-foreground">{rental.deliveryLGA}</p>}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center bg-[#1B3A5C]/5 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">KVA Required</p>
                <p className="text-xl font-bold text-[#1B3A5C]">{rental.kvaNeeded}</p>
              </div>
              <div className="text-center bg-[#D4A843]/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total Cost</p>
                <p className="text-lg font-bold text-[#D4A843]">{rental.totalCost ? formatNaira(rental.totalCost) : "TBD"}</p>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <StatusBadge status={rental.status} type="rental" className="mt-1" />
              </div>
            </div>

            {rental.eventType && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Event Type</p>
                <p className="text-sm">{rental.eventType}</p>
              </div>
            )}
            {rental.itemsToPower && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Items to Power</p>
                <p className="text-sm">{rental.itemsToPower}</p>
              </div>
            )}
            {rental.notes && (
              <div className="bg-amber-50 rounded p-2">
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="text-sm">{rental.notes}</p>
              </div>
            )}

            {/* Engineer */}
            {rental.engineer && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-700">Assigned Engineer</p>
                  <p className="text-sm font-semibold">{rental.engineer.name}</p>
                  {rental.engineer.phone && <p className="text-xs text-blue-600">{formatPhone(rental.engineer.phone)}</p>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
