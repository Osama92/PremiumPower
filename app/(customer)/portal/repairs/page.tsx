import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge"
import { StatusTimeline } from "@/components/shared/StatusTimeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Plus, Wrench } from "lucide-react"

export default async function CustomerRepairsPage() {
  const session = await auth()
  const repairs = await prisma.repairRequest.findMany({
    where: { customerId: session?.user?.id! },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B3A5C]">My Repair Requests</h1>
          <p className="text-sm text-muted-foreground">{repairs.length} request{repairs.length !== 1 ? "s" : ""}</p>
        </div>
        <Button asChild className="bg-[#1B3A5C]">
          <Link href="/portal/repairs/new">
            <Plus className="mr-2 h-4 w-4" />
            Request Repair
          </Link>
        </Button>
      </div>

      {repairs.length === 0 ? (
        <Card className="text-center p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Wrench className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-[#1B3A5C]">No repair requests</h3>
            <p className="text-sm text-muted-foreground">Generator issues? Our engineers are ready to help</p>
            <Button asChild className="bg-[#1B3A5C]">
              <Link href="/portal/repairs/new">Request Repair</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {repairs.map((repair) => (
            <Card key={repair.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base text-[#1B3A5C]">
                      {repair.generatorBrand} Repair
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {repair.problemDescription}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(repair.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <UrgencyBadge urgency={repair.urgency} />
                    <StatusBadge status={repair.status} type="repair" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <StatusTimeline currentStatus={repair.status} type="repair" cancelled={repair.status === "CANCELLED"} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
