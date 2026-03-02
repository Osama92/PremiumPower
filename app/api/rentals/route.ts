import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { calculateRentalCost } from "@/lib/utils"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const customerId = searchParams.get("customerId")

  const where: Record<string, unknown> = {}

  if (session.user.role === "CUSTOMER") {
    where.customerId = session.user.id
  } else if (session.user.role === "ENGINEER") {
    where.engineerId = session.user.id
  }

  if (status) where.status = status
  if (customerId && session.user.role !== "CUSTOMER") where.customerId = customerId

  const rentals = await prisma.rentalRequest.findMany({
    where,
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      generator: { select: { id: true, brand: true, model: true, kvaCapacity: true } },
      engineer: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(rentals)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const customerId = session.user.role === "CUSTOMER" ? session.user.id : body.customerId

  const startDate = new Date(body.startDate)
  const endDate = new Date(body.endDate)
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  const totalCost = calculateRentalCost(body.kvaNeeded, days, body.deliveryLGA || "Other")

  const rental = await prisma.rentalRequest.create({
    data: {
      customerId,
      kvaNeeded: body.kvaNeeded,
      startDate,
      endDate,
      deliveryAddress: body.deliveryAddress,
      deliveryLGA: body.deliveryLGA,
      eventType: body.eventType,
      itemsToPower: body.itemsToPower,
      notes: body.notes,
      totalCost,
      status: "BOOKED",
    },
  })

  // Create notification for admin/CS
  await prisma.notification.create({
    data: {
      userId: customerId,
      title: "Rental Request Submitted",
      message: `Your ${body.kvaNeeded}KVA rental request has been submitted. We'll confirm shortly.`,
      type: "success",
    },
  })

  return NextResponse.json(rental, { status: 201 })
}
