import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true, address: true } },
      generator: true,
      engineer: { select: { id: true, name: true, phone: true } },
      invoices: true,
      messages: {
        include: {
          sender: { select: { id: true, name: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      fieldReports: {
        include: { engineer: { select: { name: true } } },
      },
    },
  })

  if (!rental) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Customers can only see their own
  if (session.user.role === "CUSTOMER" && rental.customerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(rental)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const body = await req.json()

  // Customers can only cancel their own
  if (session.user.role === "CUSTOMER") {
    const rental = await prisma.rentalRequest.findUnique({ where: { id } })
    if (!rental || rental.customerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    const updated = await prisma.rentalRequest.update({
      where: { id },
      data: { status: "CANCELLED" },
    })
    return NextResponse.json(updated)
  }

  const updated = await prisma.rentalRequest.update({
    where: { id },
    data: body,
    include: {
      customer: { select: { id: true, name: true, email: true } },
      generator: true,
      engineer: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json(updated)
}
