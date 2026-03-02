import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { MAINTENANCE_PACKAGES } from "@/lib/constants"
import { ClipboardCheck, User, Calendar } from "lucide-react"

export default async function MaintenancePage() {
  const session = await auth()
  const where: Record<string, unknown> = {}
  if (session?.user?.role === "ENGINEER") where.visits = { some: { engineerId: session.user.id } }

  const plans = await prisma.maintenancePlan.findMany({
    where,
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      visits: {
        include: { engineer: { select: { name: true } } },
        orderBy: { scheduledDate: "desc" },
        take: 3,
      },
    },
    orderBy: { nextServiceDate: "asc" },
  })

  const packageColors: Record<string, string> = {
    BASIC: "bg-gray-100 text-gray-800",
    STANDARD: "bg-blue-100 text-blue-800",
    PREMIUM: "bg-[#D4A843]/20 text-[#D4A843]",
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance Plans" description={`${plans.length} active plans`} />

      <div className="grid md:grid-cols-2 gap-4">
        {plans.map((plan) => {
          const pkg = MAINTENANCE_PACKAGES[plan.packageType as keyof typeof MAINTENANCE_PACKAGES]
          const isOverdue = plan.nextServiceDate && new Date(plan.nextServiceDate) < new Date()

          return (
            <Card key={plan.id} className={isOverdue ? "border-red-200" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <ClipboardCheck className="h-4 w-4 text-[#1B3A5C]" />
                      <p className="font-semibold text-[#1B3A5C]">{plan.customer?.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{plan.customer?.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${packageColors[plan.packageType]}`}>
                      {pkg?.name}
                    </span>
                    <Badge variant={plan.status === "ACTIVE" ? "default" : "secondary"}
                      className={plan.status === "ACTIVE" ? "bg-green-100 text-green-800 border-0" : ""}>
                      {plan.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Started {formatDate(plan.startDate)}
                  </div>
                  {plan.nextServiceDate && (
                    <div className={`flex items-center gap-1 ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                      <Calendar className="h-3 w-3" />
                      Next: {formatDate(plan.nextServiceDate)} {isOverdue && "⚠️ OVERDUE"}
                    </div>
                  )}
                </div>

                {plan.visits.length > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Recent Visits</p>
                    {plan.visits.map((visit) => (
                      <div key={visit.id} className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {visit.engineer?.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{formatDate(visit.scheduledDate)}</span>
                          <Badge className={visit.completedDate ? "bg-green-100 text-green-800 border-0 text-xs" : "bg-yellow-100 text-yellow-800 border-0 text-xs"}>
                            {visit.completedDate ? "Done" : "Scheduled"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
        {plans.length === 0 && (
          <p className="text-muted-foreground col-span-2 text-center py-12">No maintenance plans yet</p>
        )}
      </div>
    </div>
  )
}
