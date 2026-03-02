import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { sparePartSchema } from "@/lib/validations"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const lowStock = searchParams.get("lowStock")

  const where: Record<string, unknown> = {}
  if (category) where.category = category
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { category: { contains: search } },
      { compatibility: { contains: search } },
    ]
  }
  if (lowStock === "true") {
    where.stockQuantity = { lte: prisma.sparePart.fields.reorderLevel }
  }

  const parts = await prisma.sparePart.findMany({
    where,
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })

  return NextResponse.json(parts)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "CUSTOMER_SERVICE"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = sparePartSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 })

  const part = await prisma.sparePart.create({ data: parsed.data })
  return NextResponse.json(part, { status: 201 })
}
