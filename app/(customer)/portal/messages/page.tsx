import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PageHeader } from "@/components/shared/PageHeader"
import { MessagesClient } from "@/app/(internal)/messages/MessagesClient"

export default async function CustomerMessagesPage() {
  const session = await auth()
  const userId = session?.user?.id!

  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    include: {
      sender: { select: { id: true, name: true, role: true } },
      receiver: { select: { id: true, name: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const contacts = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "CUSTOMER_SERVICE"] } },
    select: { id: true, name: true, role: true, email: true },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B3A5C]">Messages</h1>
      <MessagesClient currentUserId={userId} contacts={contacts} initialMessages={messages} />
    </div>
  )
}
