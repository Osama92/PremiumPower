import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const withUserId = searchParams.get("withUserId")

  const where: Record<string, unknown> = {
    OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
  }

  if (withUserId) {
    where.OR = [
      { senderId: session.user.id, receiverId: withUserId },
      { senderId: withUserId, receiverId: session.user.id },
    ]
  }

  const messages = await prisma.message.findMany({
    where,
    include: {
      sender: { select: { id: true, name: true, role: true } },
      receiver: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  // Mark as read
  await prisma.message.updateMany({
    where: { receiverId: session.user.id, readAt: null },
    data: { readAt: new Date() },
  })

  return NextResponse.json(messages)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId: body.receiverId,
      content: body.content,
      rentalId: body.rentalId,
      repairId: body.repairId,
    },
    include: {
      sender: { select: { id: true, name: true, role: true } },
    },
  })

  return NextResponse.json(message, { status: 201 })
}
