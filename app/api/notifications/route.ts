import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json(notifications)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await req.json()

  if (id === "all") {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, readAt: null },
      data: { readAt: new Date() },
    })
  } else {
    await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    })
  }

  return NextResponse.json({ success: true })
}
