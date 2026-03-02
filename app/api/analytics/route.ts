import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const [
    totalRentals,
    activeRentals,
    totalRepairs,
    pendingRepairs,
    totalOrders,
    totalCustomers,
    availableGenerators,
    totalGenerators,
    recentRentals,
    recentRepairs,
  ] = await Promise.all([
    prisma.rentalRequest.count(),
    prisma.rentalRequest.count({ where: { status: "ACTIVE" } }),
    prisma.repairRequest.count(),
    prisma.repairRequest.count({ where: { status: { in: ["SUBMITTED", "ASSESSED", "IN_PROGRESS"] } } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.generator.count({ where: { status: "AVAILABLE" } }),
    prisma.generator.count(),
    prisma.rentalRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true } }, generator: { select: { brand: true, kvaCapacity: true } } },
    }),
    prisma.repairRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: { select: { name: true } } },
    }),
  ])

  // Revenue approximation from rentals
  const rentalRevenue = await prisma.rentalRequest.aggregate({
    _sum: { totalCost: true },
    where: { status: { in: ["ACTIVE", "RETURNED", "INSPECTED"] } },
  })

  const repairRevenue = await prisma.repairRequest.aggregate({
    _sum: { finalCost: true },
    where: { status: { in: ["COMPLETED", "INVOICED", "PAID"] } },
  })

  const orderRevenue = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: { status: { in: ["DELIVERED", "CONFIRMED"] } },
  })

  return NextResponse.json({
    kpis: {
      totalRentals,
      activeRentals,
      totalRepairs,
      pendingRepairs,
      totalOrders,
      totalCustomers,
      availableGenerators,
      totalGenerators,
      rentalRevenue: rentalRevenue._sum.totalCost || 0,
      repairRevenue: repairRevenue._sum.finalCost || 0,
      orderRevenue: orderRevenue._sum.totalAmount || 0,
    },
    recentRentals,
    recentRepairs,
  })
}
