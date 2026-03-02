import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Wrench, CalendarDays } from "lucide-react"

export default async function JobsPage() {
  const session = await auth()
  const engineerId = session?.user?.id!

  const [repairs, rentals, visits] = await Promise.all([
    prisma.repairRequest.findMany({
      where: { engineerId },
      include: { customer: { select: { name: true, phone: true } } },
      orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
    }),
    prisma.rentalRequest.findMany({
      where: { engineerId },
      include: {
        customer: { select: { name: true, phone: true } },
        generator: { select: { brand: true, kvaCapacity: true } },
      },
      orderBy: { startDate: "asc" },
    }),
    prisma.maintenanceVisit.findMany({
      where: { engineerId },
      include: {
        plan: { include: { customer: { select: { name: true } } } },
        generator: { select: { brand: true, kvaCapacity: true } },
      },
      orderBy: { scheduledDate: "asc" },
    }),
  ])

  const activeRepairs = repairs.filter((r) => !["COMPLETED", "PAID", "CANCELLED"].includes(r.status))

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Jobs"
        description={`${activeRepairs.length} active repair jobs · ${visits.filter((v) => !v.completedDate).length} scheduled visits`}
      />

      <Tabs defaultValue="repairs">
        <TabsList>
          <TabsTrigger value="repairs">Repairs ({repairs.length})</TabsTrigger>
          <TabsTrigger value="rentals">Rentals ({rentals.length})</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance ({visits.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="repairs" className="mt-4 space-y-3">
          {repairs.map((r) => (
            <Link key={r.id} href={`/repairs/${r.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-[#1B3A5C]/10 rounded-lg flex items-center justify-center">
                        <Wrench className="h-4 w-4 text-[#1B3A5C]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1B3A5C]">{r.customer?.name}</p>
                        <p className="text-sm">{r.generatorBrand} {r.generatorModel && `(${r.generatorModel})`}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{r.problemDescription}</p>
                        <p className="text-xs text-muted-foreground">{r.location || "Location TBD"}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <UrgencyBadge urgency={r.urgency} />
                      <StatusBadge status={r.status} type="repair" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {repairs.length === 0 && <p className="text-center text-muted-foreground py-12">No repair jobs assigned</p>}
        </TabsContent>

        <TabsContent value="rentals" className="mt-4 space-y-3">
          {rentals.map((r) => (
            <Link key={r.id} href={`/rentals/${r.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-[#D4A843]/10 rounded-lg flex items-center justify-center">
                        <CalendarDays className="h-4 w-4 text-[#D4A843]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#1B3A5C]">{r.customer?.name}</p>
                        <p className="text-sm">{r.kvaNeeded}KVA — {r.generator?.brand} {r.generator?.kvaCapacity}KVA</p>
                        <p className="text-xs text-muted-foreground">{formatDate(r.startDate)} → {formatDate(r.endDate)}</p>
                        <p className="text-xs text-muted-foreground">{r.deliveryLGA || r.deliveryAddress}</p>
                      </div>
                    </div>
                    <StatusBadge status={r.status} type="rental" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {rentals.length === 0 && <p className="text-center text-muted-foreground py-12">No rentals assigned</p>}
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4 space-y-3">
          {visits.map((v) => (
            <Card key={v.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-[#1B3A5C]">{v.plan.customer?.name}</p>
                    {v.generator && <p className="text-sm">{v.generator.brand} {v.generator.kvaCapacity}KVA</p>}
                    <p className="text-xs text-muted-foreground">Scheduled: {formatDate(v.scheduledDate)}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.completedDate ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {v.completedDate ? "Completed" : "Pending"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          {visits.length === 0 && <p className="text-center text-muted-foreground py-12">No maintenance visits</p>}
        </TabsContent>
      </Tabs>
    </div>
  )
}
