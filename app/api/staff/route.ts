import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { createStaffSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const staff = await prisma.user.findMany({
    where: { role: { not: "CUSTOMER" } },
    select: {
      id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true,
      _count: {
        select: {
          assignedRentals: true,
          assignedRepairs: true,
          maintenanceVisits: true,
        },
      },
    },
    orderBy: { role: "asc" },
  })

  return NextResponse.json(staff)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createStaffSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 })

  const hashed = await bcrypt.hash(parsed.data.password, 10)
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
      role: parsed.data.role,
      phone: parsed.data.phone,
    },
  })

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 })
}
