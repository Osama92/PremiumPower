import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate, formatNaira } from "@/lib/utils"
import { Package } from "lucide-react"

export default async function CustomerOrdersPage() {
  const session = await auth()
  const orders = await prisma.order.findMany({
    where: { customerId: session?.user?.id! },
    include: {
      items: { include: { sparePart: { select: { name: true, category: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B3A5C]">My Orders</h1>

      {orders.length === 0 ? (
        <Card className="text-center p-12">
          <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="font-semibold text-[#1B3A5C]">No orders yet</p>
          <p className="text-sm text-muted-foreground">Browse our spare parts store</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#1B3A5C]">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)} · {order.deliveryOption.replace("_", " ")} delivery</p>
                    <p className="text-xs text-muted-foreground">{order.deliveryAddress}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={order.status} type="order" />
                    <span className="font-bold text-[#D4A843]">{formatNaira(order.totalAmount)}</span>
                  </div>
                </div>
                <div className="border-t pt-3 space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.sparePart?.name}</span>
                      <span className="text-muted-foreground">×{item.quantity} · {formatNaira(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
