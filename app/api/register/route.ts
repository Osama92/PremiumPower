import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { registerSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 })

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 })

  const hashed = await bcrypt.hash(parsed.data.password, 10)
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
      phone: parsed.data.phone,
      address: parsed.data.address,
      role: "CUSTOMER",
    },
  })

  return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
}
