import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatNaira } from "@/lib/utils"
import { Zap, MapPin, Calendar, Hash, Wrench } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GeneratorStatusUpdate } from "./GeneratorStatusUpdate"

export default async function GeneratorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const generator = await prisma.generator.findUnique({
    where: { id },
    include: {
      rentalRequests: {
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      maintenanceVisits: {
        include: { engineer: { select: { name: true } } },
        orderBy: { scheduledDate: "desc" },
        take: 10,
      },
    },
  })

  if (!generator) notFound()

  const totalRentals = generator.rentalRequests.length
  const lastMaintenance = generator.maintenanceVisits.find((v) => v.completedDate)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${generator.brand} ${generator.model}`}
        description={`${generator.kvaCapacity}KVA · ${generator.fuelType} · ${generator.serialNumber}`}
        action={
          session?.user?.role === "ADMIN" ? (
            <GeneratorStatusUpdate generatorId={generator.id} currentStatus={generator.status} />
          ) : undefined
        }
      />

      <div className="grid md:grid-cols-3 gap-4">
        {/* Details Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-[#1B3A5C] text-sm">Generator Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={generator.status} type="generator" />
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>{generator.kvaCapacity} KVA Capacity</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span>{generator.serialNumber}</span>
              </div>
              {generator.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{generator.location}</span>
                </div>
              )}
              {generator.acquisitionDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Since {formatDate(generator.acquisitionDate)}</span>
                </div>
              )}
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[#1B3A5C]/5 rounded-lg p-2">
                <p className="text-lg font-bold text-[#1B3A5C]">{totalRentals}</p>
                <p className="text-xs text-muted-foreground">Total Rentals</p>
              </div>
              <div className="bg-[#D4A843]/10 rounded-lg p-2">
                <p className="text-lg font-bold text-[#D4A843]">{generator.maintenanceVisits.length}</p>
                <p className="text-xs text-muted-foreground">Services</p>
              </div>
            </div>
            {generator.notes && (
              <div className="bg-gray-50 rounded p-2">
                <p className="text-xs text-muted-foreground">{generator.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rental History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#1B3A5C] text-sm">Recent Rental History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {generator.rentalRequests.map((r) => (
                <Link key={r.id} href={`/rentals/${r.id}`} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{r.customer?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.totalCost && <span className="text-xs font-medium">{formatNaira(r.totalCost)}</span>}
                    <StatusBadge status={r.status} type="rental" />
                  </div>
                </Link>
              ))}
              {generator.rentalRequests.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No rental history</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#1B3A5C] text-sm flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {generator.maintenanceVisits.map((visit) => (
              <div key={visit.id} className="flex items-center justify-between p-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">Service by {visit.engineer?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Scheduled: {formatDate(visit.scheduledDate)}
                    {visit.completedDate && ` · Completed: ${formatDate(visit.completedDate)}`}
                  </p>
                  {visit.notes && <p className="text-xs text-gray-500 mt-0.5">{visit.notes}</p>}
                </div>
                <Badge variant={visit.completedDate ? "default" : "outline"}>
                  {visit.completedDate ? "Completed" : "Scheduled"}
                </Badge>
              </div>
            ))}
            {generator.maintenanceVisits.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No maintenance history</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
