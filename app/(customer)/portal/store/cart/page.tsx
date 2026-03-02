"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/hooks/useCart"
import { formatNaira } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Package, Trash2, Plus, Minus, Loader2, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const DELIVERY_OPTIONS = [
  { value: "standard", label: "Standard (2-3 days)", fee: 2500 },
  { value: "express", label: "Express (next day)", fee: 5000 },
  { value: "same_day", label: "Same Day", fee: 8000 },
]

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore()
  const [deliveryOption, setDeliveryOption] = useState("standard")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [loading, setLoading] = useState(false)

  const selectedDelivery = DELIVERY_OPTIONS.find((d) => d.value === deliveryOption)!
  const subtotal = getTotal()
  const total = subtotal + selectedDelivery.fee

  async function checkout() {
    if (!deliveryAddress.trim()) {
      toast.error("Please enter a delivery address")
      return
    }
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ sparePartId: i.id, quantity: i.quantity })),
          deliveryOption,
          deliveryAddress,
        }),
      })
      if (!res.ok) throw new Error()
      clearCart()
      toast.success("Order placed successfully!")
      router.push("/portal/orders")
    } catch {
      toast.error("Order failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold text-[#1B3A5C]">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground mt-2">Browse our spare parts catalog to get started</p>
        <Button asChild className="mt-4 bg-[#1B3A5C]">
          <Link href="/portal/store">Browse Parts</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#1B3A5C]">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1B3A5C]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="h-6 w-6 text-[#1B3A5C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                  <p className="text-sm font-bold text-[#D4A843]">{formatNaira(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-2 p-1 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-[#1B3A5C]">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({items.length} items)</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery</span>
                <span>{formatNaira(selectedDelivery.fee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-[#1B3A5C]">
                <span>Total</span>
                <span>{formatNaira(total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div>
                <Label>Delivery Speed</Label>
                <Select value={deliveryOption} onValueChange={setDeliveryOption}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label} (+{formatNaira(opt.fee)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Delivery Address</Label>
                <Input
                  className="mt-1"
                  placeholder="Enter delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-[#1B3A5C] hover:bg-[#1B3A5C]/90 mt-2"
                onClick={checkout}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Place Order — {formatNaira(total)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
