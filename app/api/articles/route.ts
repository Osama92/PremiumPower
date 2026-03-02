import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { articleSchema } from "@/lib/validations"
import { slugify } from "@/lib/utils"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const publishedOnly = searchParams.get("published") !== "false"

  const where: Record<string, unknown> = {}
  if (publishedOnly) where.published = true
  if (category) where.category = category

  const articles = await prisma.article.findMany({
    where,
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(articles)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "CUSTOMER_SERVICE"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = articleSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 })

  const slug = slugify(parsed.data.title)
  const article = await prisma.article.create({
    data: {
      ...parsed.data,
      slug,
      authorId: session.user.id,
      publishedAt: parsed.data.published ? new Date() : null,
    },
  })

  return NextResponse.json(article, { status: 201 })
}
