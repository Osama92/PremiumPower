import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MAINTENANCE_PACKAGES } from "@/lib/constants"
import { formatDate, formatNaira } from "@/lib/utils"
import { ClipboardCheck, Check } from "lucide-react"
import { MaintenanceSignup } from "./MaintenanceSignup"

export default async function CustomerMaintenancePage() {
  const session = await auth()
  const plans = await prisma.maintenancePlan.findMany({
    where: { customerId: session?.user?.id! },
    include: {
      visits: {
        orderBy: { scheduledDate: "desc" },
        take: 3,
      },
    },
  })

  const packageColors: Record<string, string> = {
    BASIC: "bg-gray-100 text-gray-800",
    STANDARD: "bg-blue-100 text-blue-800",
    PREMIUM: "bg-amber-100 text-amber-800",
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B3A5C]">Maintenance Plans</h1>

      {/* Active Plans */}
      {plans.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-[#1B3A5C]">My Plans</h2>
          {plans.map((plan) => {
            const pkg = MAINTENANCE_PACKAGES[plan.packageType as keyof typeof MAINTENANCE_PACKAGES]
            return (
              <Card key={plan.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${packageColors[plan.packageType]}`}>
                          {pkg?.name}
                        </span>
                        <Badge className={plan.status === "ACTIVE" ? "bg-green-100 text-green-800 border-0" : ""}>
                          {plan.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Started {formatDate(plan.startDate)}
                        {plan.nextServiceDate && ` · Next service: ${formatDate(plan.nextServiceDate)}`}
                      </p>
                    </div>
                    <p className="font-bold text-[#D4A843]">{formatNaira(pkg?.price || 0)}/service</p>
                  </div>
                  {plan.visits.length > 0 && (
                    <div className="border-t pt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Recent Visits</p>
                      {plan.visits.map((v) => (
                        <div key={v.id} className="flex justify-between text-xs py-0.5">
                          <span>{formatDate(v.scheduledDate)}</span>
                          <span className={v.completedDate ? "text-green-600" : "text-yellow-600"}>
                            {v.completedDate ? "Completed" : "Scheduled"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Package options */}
      <div>
        <h2 className="font-semibold text-[#1B3A5C] mb-4">Available Packages</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(MAINTENANCE_PACKAGES).map(([key, pkg]) => (
            <Card key={key} className={key === "PREMIUM" ? "border-[#D4A843] border-2 relative" : ""}>
              {key === "PREMIUM" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A843] text-[#1B3A5C] text-xs font-bold px-3 py-0.5 rounded-full">
                  Most Popular
                </div>
              )}
              <CardContent className="p-5">
                <div className="text-center mb-4">
                  <p className="font-bold text-[#1B3A5C] text-lg">{pkg.name}</p>
                  <p className="text-sm text-muted-foreground">{pkg.frequency}</p>
                  <p className="text-2xl font-bold text-[#D4A843] mt-2">{formatNaira(pkg.price)}</p>
                  <p className="text-xs text-muted-foreground">per service visit</p>
                </div>
                <ul className="space-y-2 mb-4">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <MaintenanceSignup packageType={key} packageName={pkg.name} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
