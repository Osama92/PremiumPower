import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      items: { include: { sparePart: true } },
      invoices: true,
    },
  })

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (session.user.role === "CUSTOMER" && order.customerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(order)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "CUSTOMER_SERVICE"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json()

  const order = await prisma.order.update({ where: { id }, data: body })
  return NextResponse.json(order)
}
