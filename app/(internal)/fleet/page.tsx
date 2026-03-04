import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Settings, Plus, Gauge } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDate, cn } from "@/lib/utils"

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
        description={`${generators.length} units · ${stats.available} available now`}
        action={
          session?.user?.role === "ADMIN" ? (
            <Button asChild size="sm" className="h-8 text-[13px] bg-[#0f2440] hover:bg-[#0f2440]/90">
              <Link href="/fleet/new">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Generator
              </Link>
            </Button>
          ) : undefined
        }
      />

      {/* Fleet Status Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Available", count: stats.available, bar: "bg-emerald-500", text: "text-emerald-700", sub: "text-emerald-500" },
          { label: "Rented", count: stats.rented, bar: "bg-[#1B3A5C]", text: "text-[#1B3A5C]", sub: "text-[#1B3A5C]/60" },
          { label: "Maintenance", count: stats.maintenance, bar: "bg-amber-400", text: "text-amber-700", sub: "text-amber-500" },
          { label: "Out of Service", count: stats.outOfService, bar: "bg-red-500", text: "text-red-700", sub: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className={cn("h-[3px]", stat.bar)} />
            <div className="px-4 py-3 text-center">
              <p className={cn("text-2xl font-bold", stat.text)}>{stat.count}</p>
              <p className={cn("text-[11px] font-medium mt-0.5", stat.sub)}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Generator Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generators.map((gen) => {
          const statusBorder: Record<string, string> = {
            AVAILABLE: "border-l-emerald-400",
            RENTED: "border-l-[#1B3A5C]",
            MAINTENANCE: "border-l-amber-400",
            OUT_OF_SERVICE: "border-l-red-400",
          }
          return (
            <Link key={gen.id} href={`/fleet/${gen.id}`}>
              <div className={cn(
                "bg-white rounded-lg border border-gray-200 border-l-[3px] hover:shadow-md hover:border-gray-300 transition-all duration-150 cursor-pointer group",
                statusBorder[gen.status] || "border-l-gray-300"
              )}>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Gauge className="h-5 w-5 text-[#0f2440]" />
                    </div>
                    <StatusBadge status={gen.status} type="generator" />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-[#0f2440] transition-colors leading-tight">
                    {gen.brand} {gen.model}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-1 mb-3">
                    <span className="text-[28px] font-bold text-[#0f2440] leading-none">{gen.kvaCapacity}</span>
                    <span className="text-sm text-gray-400 font-medium">KVA</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[12px] text-gray-500">SN: <span className="text-gray-700 font-medium">{gen.serialNumber}</span></p>
                    <p className="text-[12px] text-gray-500">{gen.fuelType} · {gen.location || "Lagos"}</p>
                    {gen.acquisitionDate && (
                      <p className="text-[12px] text-gray-500">In service since {formatDate(gen.acquisitionDate, "MMM yyyy")}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-[12px] text-gray-400 font-medium">{gen._count.rentalRequests} total rentals</span>
                    <Settings className="h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
