import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const generator = await prisma.generator.findUnique({
    where: { id },
    include: {
      rentalRequests: {
        include: { customer: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      maintenanceVisits: {
        include: { engineer: { select: { name: true } } },
        orderBy: { scheduledDate: "desc" },
        take: 10,
      },
    },
  })

  if (!generator) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(generator)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "CUSTOMER_SERVICE"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json()

  const generator = await prisma.generator.update({
    where: { id },
    data: body,
  })
  return NextResponse.json(generator)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params

  await prisma.generator.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
