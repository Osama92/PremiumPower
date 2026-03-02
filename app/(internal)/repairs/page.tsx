import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Wrench } from "lucide-react"

export default async function RepairsPage() {
  const session = await auth()
  const where: Record<string, unknown> = {}
  if (session?.user?.role === "ENGINEER") where.engineerId = session.user.id

  const repairs = await prisma.repairRequest.findMany({
    where,
    include: {
      customer: { select: { name: true, phone: true } },
      engineer: { select: { name: true } },
    },
    orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
  })

  const active = repairs.filter((r) => !["COMPLETED", "INVOICED", "PAID", "CANCELLED"].includes(r.status))
  const completed = repairs.filter((r) => ["COMPLETED", "INVOICED", "PAID"].includes(r.status))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Repair Requests"
        description={`${repairs.length} total · ${active.length} active`}
      />

      {/* Emergency flag */}
      {repairs.filter((r) => r.urgency === "EMERGENCY" && !["COMPLETED", "PAID"].includes(r.status)).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 font-medium">
          🚨 {repairs.filter((r) => r.urgency === "EMERGENCY" && !["COMPLETED", "PAID"].includes(r.status)).length} emergency job(s) require immediate attention
        </div>
      )}

      <div className="space-y-3">
        {repairs.map((repair) => (
          <Link key={repair.id} href={`/repairs/${repair.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#1B3A5C]/10 flex items-center justify-center flex-shrink-0">
                      <Wrench className="h-4 w-4 text-[#1B3A5C]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1B3A5C]">{repair.customer?.name}</p>
                      <p className="text-sm text-muted-foreground">{repair.generatorBrand} {repair.generatorModel && `(${repair.generatorModel})`}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{repair.problemDescription}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <UrgencyBadge urgency={repair.urgency} />
                    <StatusBadge status={repair.status} type="repair" />
                    <p className="text-xs text-muted-foreground">{formatDate(repair.createdAt)}</p>
                  </div>
                </div>
                {repair.engineer && (
                  <p className="text-xs text-muted-foreground mt-2 pl-12">Assigned to: {repair.engineer.name}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
        {repairs.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No repair requests found</p>
        )}
      </div>
    </div>
  )
}
