"use client"

import { useState } from "react"
import { ViewToggle } from "@/components/shared/ViewToggle"
import { formatNaira, cn } from "@/lib/utils"
import { Package, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Part {
  id: string
  name: string
  category: string
  price: number
  stockQuantity: number
  reorderLevel: number
  sku: string | null
  compatibility: string | null
}

export function PartsView({ parts, isAdmin }: { parts: Part[]; isAdmin: boolean }) {
  const [view, setView] = useState<"grid" | "list">("grid")

  const lowStock = parts.filter((p) => p.stockQuantity <= p.reorderLevel)

  const byCategory = parts.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {} as Record<string, Part[]>)

  return (
    <div className="space-y-5">
      {lowStock.length > 0 && (
        <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <p className="text-[13px] text-amber-800 font-medium">
            {lowStock.length} item{lowStock.length !== 1 ? "s" : ""} at or below reorder level:{" "}
            <span className="font-normal">{lowStock.map((p) => p.name).join(", ")}</span>
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-[13px] text-gray-500">
          <span className="font-semibold text-gray-900">{parts.length}</span> products
          {lowStock.length > 0 && (
            <span className="ml-2 text-amber-600 font-semibold">· {lowStock.length} low stock</span>
          )}
        </p>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {parts.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-[15px] font-semibold text-gray-500">No parts in inventory</p>
          <p className="text-[13px] text-gray-400 mt-1">Add your first spare part to get started</p>
          {isAdmin && (
            <Link
              href="/parts/new"
              className="inline-block mt-4 bg-[#0f2440] hover:bg-[#0f2440]/90 text-white text-[13px] px-4 py-2 rounded-md font-semibold"
            >
              Add First Part
            </Link>
          )}
        </div>
      )}

      {/* Grid view — grouped by category */}
      {view === "grid" && parts.length > 0 && (
        <div className="space-y-6">
          {Object.entries(byCategory).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-3 px-0.5">{category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((part) => {
                  const isLow = part.stockQuantity <= part.reorderLevel
                  return (
                    <div
                      key={part.id}
                      className={cn(
                        "bg-white rounded-lg border border-l-[3px] hover:shadow-sm transition-all duration-150",
                        isLow ? "border-amber-200 border-l-amber-400" : "border-gray-200 border-l-emerald-400"
                      )}
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-4 w-4 text-[#0f2440]" />
                          </div>
                          <span className={cn(
                            "text-[12px] font-bold px-2 py-0.5 rounded-full",
                            isLow ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-700"
                          )}>
                            {part.stockQuantity} in stock
                          </span>
                        </div>
                        <h4 className="text-[14px] font-bold text-gray-900 leading-tight">{part.name}</h4>
                        {part.compatibility && (
                          <p className="text-[12px] text-gray-500 mt-0.5">Fits: {part.compatibility}</p>
                        )}
                        <p className="text-[18px] font-bold text-[#D4A843] mt-2 leading-none">{formatNaira(part.price)}</p>
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                          {part.sku ? <p className="text-[11px] text-gray-400">SKU: {part.sku}</p> : <span />}
                          <p className="text-[11px] text-gray-400">Reorder at {part.reorderLevel}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && parts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Part</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Compatibility</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Reorder At</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Unit Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {parts.map((part) => {
                const isLow = part.stockQuantity <= part.reorderLevel
                return (
                  <tr key={part.id} className={cn("hover:bg-gray-50/50 transition-colors", isLow && "bg-amber-50/30")}>
                    <td className="px-5 py-3 font-semibold text-gray-900">{part.name}</td>
                    <td className="px-4 py-3 text-gray-500">{part.category}</td>
                    <td className="px-4 py-3 text-gray-400">{part.sku || "—"}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{part.compatibility || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn(
                        "text-[12px] font-bold px-2 py-0.5 rounded-full",
                        isLow ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-700"
                      )}>
                        {part.stockQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">{part.reorderLevel}</td>
                    <td className="px-5 py-3 text-right font-bold text-[#D4A843]">{formatNaira(part.price)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
