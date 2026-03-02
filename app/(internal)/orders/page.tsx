import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate, formatNaira } from "@/lib/utils"
import Link from "next/link"

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
      <PageHeader title="Orders" description={`${orders.length} total orders`} />

      <div className="space-y-3">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[#1B3A5C]">{order.customer?.name}</p>
                    <StatusBadge status={order.status} type="order" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {order.items.map((i) => i.sparePart?.name).join(", ")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(order.createdAt)} · {order.deliveryOption.replace("_", " ")} delivery
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#D4A843]">{formatNaira(order.totalAmount)}</p>
                  <p className="text-xs text-muted-foreground">{order.items.length} item(s)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && <p className="text-center text-muted-foreground py-12">No orders yet</p>}
      </div>
    </div>
  )
}
