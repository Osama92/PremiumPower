import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PageHeader } from "@/components/shared/PageHeader"
import { MaintenanceView } from "./MaintenanceView"

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Plans"
        description={`${plans.length} plan${plans.length !== 1 ? "s" : ""}`}
      />
      <MaintenanceView plans={plans} />
    </div>
  )
}
