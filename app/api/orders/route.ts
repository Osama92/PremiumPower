import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const where: Record<string, unknown> = {}
  if (session.user.role === "CUSTOMER") {
    where.customerId = session.user.id
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      customer: { select: { id: true, name: true, email: true } },
      items: {
        include: { sparePart: { select: { name: true, imageUrl: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const customerId = session.user.role === "CUSTOMER" ? session.user.id : body.customerId

  // Delivery fee
  const deliveryFees: Record<string, number> = {
    standard: 2500,
    express: 5000,
    same_day: 8000,
  }
  const deliveryFee = deliveryFees[body.deliveryOption] || 2500

  // Calculate total from items
  let itemsTotal = 0
  const itemsWithPrices: { sparePartId: string; quantity: number; unitPrice: number }[] = []

  for (const item of body.items) {
    const part = await prisma.sparePart.findUnique({ where: { id: item.sparePartId } })
    if (!part) continue
    itemsTotal += part.price * item.quantity
    itemsWithPrices.push({ sparePartId: item.sparePartId, quantity: item.quantity, unitPrice: part.price })
  }

  const order = await prisma.order.create({
    data: {
      customerId,
      totalAmount: itemsTotal + deliveryFee,
      deliveryFee,
      deliveryOption: body.deliveryOption || "standard",
      deliveryAddress: body.deliveryAddress,
      notes: body.notes,
      status: "PENDING",
      items: { create: itemsWithPrices },
    },
    include: {
      items: { include: { sparePart: true } },
    },
  })

  // Update stock
  for (const item of itemsWithPrices) {
    await prisma.sparePart.update({
      where: { id: item.sparePartId },
      data: { stockQuantity: { decrement: item.quantity } },
    })
  }

  return NextResponse.json(order, { status: 201 })
}
