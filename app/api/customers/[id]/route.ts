import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "CUSTOMER_SERVICE"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params

  const customer = await prisma.user.findUnique({
    where: { id, role: "CUSTOMER" },
    select: {
      id: true, name: true, email: true, phone: true, address: true, createdAt: true, isActive: true,
      rentalRequests: {
        orderBy: { createdAt: "desc" },
        include: { generator: { select: { brand: true, kvaCapacity: true } } },
        take: 10,
      },
      repairRequests: { orderBy: { createdAt: "desc" }, take: 10 },
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: { include: { sparePart: { select: { name: true } } } } },
        take: 10,
      },
      maintenancePlans: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(customer)
}
