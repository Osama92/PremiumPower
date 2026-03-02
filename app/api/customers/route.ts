import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "CUSTOMER_SERVICE"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search")

  const where: Record<string, unknown> = { role: "CUSTOMER" }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ]
  }

  const customers = await prisma.user.findMany({
    where,
    select: {
      id: true, name: true, email: true, phone: true, address: true, createdAt: true, isActive: true,
      _count: {
        select: {
          rentalRequests: true,
          repairRequests: true,
          orders: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(customers)
}
