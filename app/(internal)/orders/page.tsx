import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/PageHeader"
import { OrdersView } from "./OrdersView"

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      customer: { select: { name: true, email: true } },
      items: { include: { sparePart: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description={`${orders.length} total order${orders.length !== 1 ? "s" : ""}`} />
      <OrdersView orders={orders} />
    </div>
  )
}
