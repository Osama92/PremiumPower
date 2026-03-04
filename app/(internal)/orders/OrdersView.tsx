"use client"

import { useState } from "react"
import { ViewToggle } from "@/components/shared/ViewToggle"
import { formatDate, formatNaira, cn } from "@/lib/utils"
import { ShoppingCart, Package } from "lucide-react"

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  sparePart: { name: string } | null
}

interface Order {
  id: string
  status: string
  totalAmount: number
  deliveryOption: string
  createdAt: Date
  customer: { name: string; email: string } | null
  items: OrderItem[]
}

const STATUS_STYLE: Record<string, string> = {
  PENDING:    "bg-amber-50 text-amber-700",
  CONFIRMED:  "bg-blue-50 text-blue-700",
  PROCESSING: "bg-indigo-50 text-indigo-700",
  SHIPPED:    "bg-purple-50 text-purple-700",
  DELIVERED:  "bg-emerald-50 text-emerald-700",
  CANCELLED:  "bg-gray-100 text-gray-500",
}

export function OrdersView({ orders }: { orders: Order[] }) {
  const [view, setView] = useState<"grid" | "list">("list")

  const pending   = orders.filter((o) => o.status === "PENDING").length
  const delivered = orders.filter((o) => o.status === "DELIVERED").length

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-5 py-3.5">
        <p className="text-[12px] text-blue-700 leading-relaxed">
          <span className="font-semibold">Orders</span> are created when customers purchase spare parts from the store.
          Track status from <span className="font-medium">Pending → Confirmed → Processing → Shipped → Delivered</span>.
          Update order status to keep customers informed.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[13px] text-gray-500">
          <span><span className="font-semibold text-gray-900">{orders.length}</span> total</span>
          {pending > 0 && <span className="text-amber-600 font-semibold">{pending} pending</span>}
          <span className="text-emerald-600">{delivered} delivered</span>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {orders.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <ShoppingCart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-[15px] font-semibold text-gray-500">No orders yet</p>
        </div>
      )}

      {/* List view */}
      {view === "list" && orders.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Delivery</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-900">{order.customer?.name}</p>
                    <p className="text-[11px] text-gray-400">{order.customer?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700 truncate max-w-[180px]">
                      {order.items.map((i) => i.sparePart?.name).join(", ")}
                    </p>
                    <p className="text-[11px] text-gray-400">{order.items.length} item(s)</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize">
                    {order.deliveryOption.replace(/_/g, " ").toLowerCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", STATUS_STYLE[order.status] || "bg-gray-100 text-gray-500")}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-[#D4A843]">
                    {formatNaira(order.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid view */}
      {view === "grid" && orders.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg border border-l-[3px] border-gray-200 border-l-[#0f2440] hover:shadow-sm transition-all"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-4 w-4 text-[#0f2440]" />
                  </div>
                  <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", STATUS_STYLE[order.status] || "bg-gray-100 text-gray-500")}>
                    {order.status}
                  </span>
                </div>
                <p className="text-[14px] font-bold text-gray-900 leading-tight">{order.customer?.name}</p>
                <p className="text-[12px] text-gray-400 mt-0.5 truncate">
                  {order.items.map((i) => i.sparePart?.name).join(", ")}
                </p>
                <p className="text-[18px] font-bold text-[#D4A843] mt-2 leading-none">{formatNaira(order.totalAmount)}</p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400">{formatDate(order.createdAt)}</p>
                  <p className="text-[11px] text-gray-400 capitalize">{order.deliveryOption.replace(/_/g, " ").toLowerCase()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
