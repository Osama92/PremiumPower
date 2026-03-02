import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const urgency = searchParams.get("urgency")

  const where: Record<string, unknown> = {}

  if (session.user.role === "CUSTOMER") {
    where.customerId = session.user.id
  } else if (session.user.role === "ENGINEER") {
    where.engineerId = session.user.id
  }

  if (status) where.status = status
  if (urgency) where.urgency = urgency

  const repairs = await prisma.repairRequest.findMany({
    where,
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      engineer: { select: { id: true, name: true } },
    },
    orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
  })

  return NextResponse.json(repairs)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const customerId = session.user.role === "CUSTOMER" ? session.user.id : body.customerId

  const repair = await prisma.repairRequest.create({
    data: {
      customerId,
      generatorBrand: body.generatorBrand,
      generatorModel: body.generatorModel,
      problemDescription: body.problemDescription,
      urgency: body.urgency || "STANDARD",
      location: body.location,
      photos: body.photos ? JSON.stringify(body.photos) : null,
      status: "SUBMITTED",
    },
  })

  await prisma.notification.create({
    data: {
      userId: customerId,
      title: "Repair Request Submitted",
      message: `Your repair request for ${body.generatorBrand} has been submitted. Our team will assess it shortly.`,
      type: "success",
    },
  })

  return NextResponse.json(repair, { status: 201 })
}
