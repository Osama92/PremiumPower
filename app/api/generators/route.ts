import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { generatorSchema } from "@/lib/validations"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const search = searchParams.get("search")

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (search) {
    where.OR = [
      { brand: { contains: search } },
      { model: { contains: search } },
      { serialNumber: { contains: search } },
    ]
  }

  const generators = await prisma.generator.findMany({
    where,
    orderBy: { kvaCapacity: "asc" },
    include: {
      _count: { select: { rentalRequests: true } },
    },
  })

  return NextResponse.json(generators)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "CUSTOMER_SERVICE"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = generatorSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 })

  const generator = await prisma.generator.create({ data: parsed.data })
  return NextResponse.json(generator, { status: 201 })
}
