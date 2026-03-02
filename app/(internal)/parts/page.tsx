import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatNaira } from "@/lib/utils"
import { Package } from "lucide-react"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function PartsPage() {
  const session = await auth()
  const parts = await prisma.sparePart.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })

  const lowStock = parts.filter((p) => p.stockQuantity <= p.reorderLevel)

  // Group by category
  const byCategory = parts.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {} as Record<string, typeof parts>)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Spare Parts Inventory"
        description={`${parts.length} products · ${lowStock.length} low stock`}
        action={
          session?.user?.role === "ADMIN" ? (
            <Button asChild className="bg-[#1B3A5C]">
              <Link href="/parts/new">Add Part</Link>
            </Button>
          ) : undefined
        }
      />

      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          ⚠️ {lowStock.length} item(s) are at or below reorder level: {lowStock.map((p) => p.name).join(", ")}
        </div>
      )}

      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category}>
          <h3 className="font-semibold text-[#1B3A5C] mb-3">{category}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((part) => (
              <Card key={part.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 bg-[#1B3A5C]/10 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-[#1B3A5C]" />
                    </div>
                    <Badge variant={part.stockQuantity <= part.reorderLevel ? "destructive" : "default"}
                      className={part.stockQuantity <= part.reorderLevel ? "" : "bg-green-100 text-green-800 border-0"}>
                      {part.stockQuantity} in stock
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-[#1B3A5C]">{part.name}</h4>
                  {part.compatibility && <p className="text-xs text-muted-foreground">Fits: {part.compatibility}</p>}
                  <p className="text-lg font-bold text-[#D4A843] mt-1">{formatNaira(part.price)}</p>
                  {part.sku && <p className="text-xs text-muted-foreground">SKU: {part.sku}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
