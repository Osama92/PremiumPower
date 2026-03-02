import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AdminDashboard } from "./AdminDashboard"
import { CSDashboard } from "./CSDashboard"
import { EngineerDashboard } from "./EngineerDashboard"

export default async function DashboardPage() {
  const session = await auth()
  const role = session?.user?.role

  if (role === "ADMIN") {
    const [
      totalRentals, activeRentals, pendingRepairs, totalCustomers,
      availableGenerators, totalGenerators, recentRentals, recentRepairs,
    ] = await Promise.all([
      prisma.rentalRequest.count(),
      prisma.rentalRequest.count({ where: { status: "ACTIVE" } }),
      prisma.repairRequest.count({ where: { status: { in: ["SUBMITTED", "ASSESSED"] } } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.generator.count({ where: { status: "AVAILABLE" } }),
      prisma.generator.count(),
      prisma.rentalRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { name: true } },
          generator: { select: { brand: true, kvaCapacity: true } },
        },
      }),
      prisma.repairRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { customer: { select: { name: true } } },
      }),
    ])

    const rentalRevenue = await prisma.rentalRequest.aggregate({
      _sum: { totalCost: true },
    })

    const fleetStatus = await prisma.generator.groupBy({
      by: ["status"],
      _count: { id: true },
    })

    return (
      <AdminDashboard
        kpis={{
          totalRentals,
          activeRentals,
          pendingRepairs,
          totalCustomers,
          availableGenerators,
          totalGenerators,
          totalRevenue: rentalRevenue._sum.totalCost || 0,
        }}
        recentRentals={recentRentals}
        recentRepairs={recentRepairs}
        fleetStatus={fleetStatus.map((f) => ({
          name: f.status.charAt(0) + f.status.slice(1).toLowerCase().replace("_", " "),
          value: f._count.id,
        }))}
      />
    )
  }

  if (role === "CUSTOMER_SERVICE") {
    const [todayRentals, pendingQuotes, recentInteractions] = await Promise.all([
      prisma.rentalRequest.count({
        where: {
          status: { in: ["BOOKED", "CONFIRMED"] },
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.rentalRequest.count({ where: { status: "BOOKED" } }),
      prisma.repairRequest.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { customer: { select: { name: true } } },
      }),
    ])
    return <CSDashboard todayRentals={todayRentals} pendingQuotes={pendingQuotes} recentInteractions={recentInteractions} />
  }

  if (role === "ENGINEER") {
    const engineerId = session?.user?.id!
    const [myJobs, completedToday, pendingVisits] = await Promise.all([
      prisma.repairRequest.findMany({
        where: { engineerId, status: { in: ["IN_PROGRESS", "APPROVED", "PARTS_ORDERED"] } },
        include: { customer: { select: { name: true } } },
        orderBy: { urgency: "desc" },
        take: 10,
      }),
      prisma.repairRequest.count({
        where: {
          engineerId,
          status: "COMPLETED",
          updatedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.maintenanceVisit.count({
        where: {
          engineerId,
          completedDate: null,
          scheduledDate: { lte: new Date(new Date().setDate(new Date().getDate() + 7)) },
        },
      }),
    ])
    return <EngineerDashboard myJobs={myJobs} completedToday={completedToday} pendingVisits={pendingVisits} />
  }

  return null
}
