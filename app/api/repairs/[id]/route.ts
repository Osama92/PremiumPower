import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const repair = await prisma.repairRequest.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      engineer: { select: { id: true, name: true, phone: true } },
      invoices: true,
      messages: {
        include: { sender: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
      fieldReports: {
        include: { engineer: { select: { name: true } } },
      },
    },
  })

  if (!repair) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (session.user.role === "CUSTOMER" && repair.customerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(repair)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  if (session.user.role === "CUSTOMER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const updated = await prisma.repairRequest.update({
    where: { id },
    data: body,
    include: {
      customer: { select: { name: true, email: true } },
      engineer: { select: { name: true } },
    },
  })

  return NextResponse.json(updated)
}
