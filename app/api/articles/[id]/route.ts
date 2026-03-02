import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Support both id and slug lookup
  const article = await prisma.article.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { author: { select: { name: true } } },
  })

  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(article)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "CUSTOMER_SERVICE"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json()
  const article = await prisma.article.update({ where: { id }, data: body })
  return NextResponse.json(article)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  await prisma.article.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
