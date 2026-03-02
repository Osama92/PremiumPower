"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatNaira } from "@/lib/utils"
import { useCartStore } from "@/hooks/useCart"
import { ShoppingCart, Search, Package, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Part {
  id: string
  name: string
  category: string
  price: number
  stockQuantity: number
  compatibility?: string | null
  description?: string | null
  imageUrl?: string | null
}

export function StoreClient({ parts, categories }: { parts: Part[]; categories: string[] }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { addItem, items } = useCartStore()

  const filtered = parts.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const cartCount = items.reduce((s, i) => s + i.quantity, 0)

  function addToCart(part: Part) {
    addItem({ id: part.id, name: part.name, price: part.price, quantity: 1, category: part.category, imageUrl: part.imageUrl || undefined })
    toast.success(`${part.name} added to cart`)
  }

  const isInCart = (id: string) => items.some((i) => i.id === id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B3A5C]">Spare Parts Store</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} products available</p>
        </div>
        <Button asChild className="bg-[#1B3A5C] relative">
          <Link href="/portal/store/cart">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4A843] text-[#1B3A5C] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </Button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-[#1B3A5C] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((part) => (
          <Card key={part.id} className="hover:shadow-md transition-shadow group">
            <CardContent className="p-4">
              <div className="w-full h-32 bg-gradient-to-br from-[#1B3A5C]/5 to-[#1B3A5C]/10 rounded-lg flex items-center justify-center mb-3">
                <Package className="h-12 w-12 text-[#1B3A5C]/30" />
              </div>
              <Badge variant="outline" className="text-xs mb-2">{part.category}</Badge>
              <h3 className="font-semibold text-[#1B3A5C] text-sm">{part.name}</h3>
              {part.compatibility && (
                <p className="text-xs text-muted-foreground mt-0.5">Fits: {part.compatibility}</p>
              )}
              {part.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{part.description}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                <p className="text-lg font-bold text-[#D4A843]">{formatNaira(part.price)}</p>
                <span className="text-xs text-muted-foreground">{part.stockQuantity} left</span>
              </div>
              <Button
                className={`w-full mt-3 text-xs h-8 ${isInCart(part.id) ? "bg-green-600 hover:bg-green-700" : "bg-[#1B3A5C] hover:bg-[#1B3A5C]/90"}`}
                onClick={() => addToCart(part)}
                disabled={isInCart(part.id)}
              >
                {isInCart(part.id) ? (
                  <><CheckCircle className="mr-1.5 h-3 w-3" /> In Cart</>
                ) : (
                  <><ShoppingCart className="mr-1.5 h-3 w-3" /> Add to Cart</>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No parts found matching your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
