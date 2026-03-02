import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PageHeader } from "@/components/shared/PageHeader"
import { MessagesClient } from "./MessagesClient"

export default async function MessagesPage() {
  const session = await auth()
  const userId = session?.user?.id!

  const conversations = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: {
      sender: { select: { id: true, name: true, role: true } },
      receiver: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  // Get unique conversation partners
  const partnerIds = new Set<string>()
  conversations.forEach((msg) => {
    const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId
    partnerIds.add(otherId)
  })

  // If staff, get customers who have rentals/repairs; if customer, get support staff
  const contacts = await prisma.user.findMany({
    where: {
      id: { not: userId },
      role: session?.user?.role === "CUSTOMER" ? { in: ["ADMIN", "CUSTOMER_SERVICE"] } : { in: ["CUSTOMER", "ENGINEER"] },
    },
    select: { id: true, name: true, role: true, email: true },
    take: 20,
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" description="Internal communication" />
      <MessagesClient
        currentUserId={userId}
        contacts={contacts}
        initialMessages={conversations}
      />
    </div>
  )
}
