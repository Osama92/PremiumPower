import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

export default async function FleetPage() {
  const session = await auth()
  const generators = await prisma.generator.findMany({
    orderBy: [{ status: "asc" }, { kvaCapacity: "asc" }],
    include: {
      _count: { select: { rentalRequests: true } },
    },
  })

  const stats = {
    available: generators.filter((g) => g.status === "AVAILABLE").length,
    rented: generators.filter((g) => g.status === "RENTED").length,
    maintenance: generators.filter((g) => g.status === "MAINTENANCE").length,
    outOfService: generators.filter((g) => g.status === "OUT_OF_SERVICE").length,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generator Fleet"
        description={`${generators.length} units total · ${stats.available} available`}
        action={
          session?.user?.role === "ADMIN" ? (
            <Button asChild className="bg-[#1B3A5C] hover:bg-[#1B3A5C]/90">
              <Link href="/fleet/new">
                <Zap className="mr-2 h-4 w-4" />
                Add Generator
              </Link>
            </Button>
          ) : undefined
        }
      />

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Available", count: stats.available, color: "bg-green-50 border-green-200 text-green-700" },
          { label: "Rented", count: stats.rented, color: "bg-blue-50 border-blue-200 text-blue-700" },
          { label: "Maintenance", count: stats.maintenance, color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
          { label: "Out of Service", count: stats.outOfService, color: "bg-red-50 border-red-200 text-red-700" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-lg border p-3 text-center ${stat.color}`}>
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-xs font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Generator Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generators.map((gen) => (
          <Link key={gen.id} href={`/fleet/${gen.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1B3A5C]/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-[#1B3A5C]" />
                  </div>
                  <StatusBadge status={gen.status} type="generator" />
                </div>
                <h3 className="font-semibold text-[#1B3A5C] group-hover:text-[#D4A843] transition-colors">
                  {gen.brand} {gen.model}
                </h3>
                <p className="text-2xl font-bold text-[#1B3A5C] my-1">{gen.kvaCapacity} <span className="text-sm font-normal text-muted-foreground">KVA</span></p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>SN: {gen.serialNumber}</p>
                  <p>{gen.fuelType} · {gen.location || "Lagos"}</p>
                  {gen.acquisitionDate && <p>Since {formatDate(gen.acquisitionDate, "MMM yyyy")}</p>}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">{gen._count.rentalRequests} rentals</span>
                  <Settings className="h-3 w-3 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
