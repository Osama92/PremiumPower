import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const where: Record<string, unknown> = {}
  if (session.user.role === "CUSTOMER") {
    where.customerId = session.user.id
  }

  const plans = await prisma.maintenancePlan.findMany({
    where,
    include: {
      customer: { select: { id: true, name: true, email: true } },
      visits: {
        include: { engineer: { select: { name: true } } },
        orderBy: { scheduledDate: "desc" },
        take: 5,
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(plans)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const customerId = session.user.role === "CUSTOMER" ? session.user.id : body.customerId

  // Calculate next service date based on package
  const startDate = new Date(body.startDate || new Date())
  const nextServiceDate = new Date(startDate)
  if (body.packageType === "PREMIUM") nextServiceDate.setMonth(nextServiceDate.getMonth() + 1)
  else if (body.packageType === "STANDARD") nextServiceDate.setMonth(nextServiceDate.getMonth() + 2)
  else nextServiceDate.setMonth(nextServiceDate.getMonth() + 3)

  const plan = await prisma.maintenancePlan.create({
    data: {
      customerId,
      packageType: body.packageType || "BASIC",
      startDate,
      nextServiceDate,
      status: "ACTIVE",
      notes: body.notes,
    },
  })

  return NextResponse.json(plan, { status: 201 })
}
