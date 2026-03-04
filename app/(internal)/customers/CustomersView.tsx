"use client"

import { useState } from "react"
import { ViewToggle } from "@/components/shared/ViewToggle"
import { formatDate, getInitials, cn } from "@/lib/utils"
import { Users, Phone, Mail } from "lucide-react"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  createdAt: Date
  isActive: boolean
  _count: { rentalRequests: number; repairRequests: number; orders: number }
}

export function CustomersView({ customers }: { customers: Customer[] }) {
  const [view, setView] = useState<"grid" | "list">("grid")

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-gray-500">
          <span className="font-semibold text-gray-900">{customers.length}</span> registered
        </p>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {customers.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-[15px] font-semibold text-gray-500">No customers yet</p>
        </div>
      )}

      {/* Grid view */}
      {view === "grid" && customers.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {customers.map((c) => (
            <Link key={c.id} href={`/customers/${c.id}`}>
              <div className={cn(
                "bg-white rounded-lg border border-l-[3px] hover:shadow-sm transition-all cursor-pointer",
                c.isActive ? "border-gray-200 border-l-emerald-400" : "border-gray-200 border-l-gray-300"
              )}>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-[#0f2440] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[12px] font-bold text-white">{getInitials(c.name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-bold text-gray-900 truncate">{c.name}</p>
                        {!c.isActive && (
                          <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-gray-400 truncate">{c.email}</p>
                    </div>
                  </div>
                  {c.phone && (
                    <p className="text-[12px] text-gray-400 flex items-center gap-1.5 mb-3">
                      <Phone className="h-3 w-3" /> {c.phone}
                    </p>
                  )}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                    <div>
                      <p className="text-[15px] font-bold text-[#0f2440]">{c._count.rentalRequests}</p>
                      <p className="text-[10px] text-gray-400">Rentals</p>
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#0f2440]">{c._count.repairRequests}</p>
                      <p className="text-[10px] text-gray-400">Repairs</p>
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#0f2440]">{c._count.orders}</p>
                      <p className="text-[10px] text-gray-400">Orders</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* List view */}
      {view === "list" && customers.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Rentals</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Repairs</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Orders</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Since</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/customers/${c.id}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[#0f2440] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-white">{getInitials(c.name)}</span>
                        </div>
                        <span className="font-semibold text-gray-900 hover:text-[#0f2440]">{c.name}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-600 flex items-center gap-1">
                      <Mail className="h-3 w-3 text-gray-400" /> {c.email}
                    </p>
                    {c.phone && (
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-[#0f2440]">{c._count.rentalRequests}</td>
                  <td className="px-4 py-3 text-center font-semibold text-[#0f2440]">{c._count.repairRequests}</td>
                  <td className="px-4 py-3 text-center font-semibold text-[#0f2440]">{c._count.orders}</td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(c.createdAt)}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                      c.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                    )}>
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
