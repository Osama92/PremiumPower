"use client"

import { useState } from "react"
import { ViewToggle } from "@/components/shared/ViewToggle"
import { formatDate, cn } from "@/lib/utils"
import { MAINTENANCE_PACKAGES } from "@/lib/constants"
import { ClipboardCheck, User, Calendar, AlertTriangle, Wrench, CheckCircle2, Clock } from "lucide-react"

interface Visit {
  id: string
  scheduledDate: Date
  completedDate: Date | null
  engineer: { name: string } | null
}

interface Plan {
  id: string
  packageType: string
  status: string
  startDate: Date
  nextServiceDate: Date | null
  customer: { name: string; email: string; phone: string | null } | null
  visits: Visit[]
}

const PACKAGE_STYLE: Record<string, { badge: string; bar: string }> = {
  BASIC:    { badge: "bg-gray-100 text-gray-700",        bar: "bg-gray-400"     },
  STANDARD: { badge: "bg-blue-50 text-blue-700",          bar: "bg-blue-500"     },
  PREMIUM:  { badge: "bg-[#D4A843]/15 text-[#b88a25]",   bar: "bg-[#D4A843]"    },
}

export function MaintenanceView({ plans }: { plans: Plan[] }) {
  const [view, setView] = useState<"grid" | "list">("grid")

  const active  = plans.filter((p) => p.status === "ACTIVE")
  const overdue = plans.filter((p) => p.nextServiceDate && new Date(p.nextServiceDate) < new Date())

  return (
    <div className="space-y-5">
      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg px-5 py-4">
        <h3 className="text-[13px] font-semibold text-blue-900 mb-1">How Maintenance Plans Work</h3>
        <p className="text-[12px] text-blue-700 leading-relaxed">
          Customers subscribe to a plan (Basic · Standard · Premium). Engineers are automatically assigned for
          scheduled visits based on the plan frequency. Each visit is logged, and the system tracks the next
          service date. Overdue plans are flagged in red.
        </p>
        <div className="flex items-center gap-6 mt-3">
          {(["BASIC", "STANDARD", "PREMIUM"] as const).map((pkg) => {
            const info = MAINTENANCE_PACKAGES[pkg]
            const style = PACKAGE_STYLE[pkg]
            return (
              <div key={pkg} className="flex items-center gap-2">
                <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", style.badge)}>
                  {info.name}
                </span>
                <span className="text-[11px] text-blue-600">{info.frequency}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-gray-500">
            <span className="font-semibold text-gray-900">{active.length}</span> active
            {overdue.length > 0 && (
              <span className="ml-2 text-red-600 font-semibold flex-shrink-0">
                · <AlertTriangle className="inline h-3.5 w-3.5 mr-0.5" />{overdue.length} overdue
              </span>
            )}
          </span>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {plans.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Wrench className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-[15px] font-semibold text-gray-500">No maintenance plans yet</p>
        </div>
      )}

      {/* Grid view */}
      {view === "grid" && plans.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const pkg = MAINTENANCE_PACKAGES[plan.packageType as keyof typeof MAINTENANCE_PACKAGES]
            const style = PACKAGE_STYLE[plan.packageType] || { badge: "bg-gray-100 text-gray-700", bar: "bg-gray-400" }
            const isOverdue = plan.nextServiceDate && new Date(plan.nextServiceDate) < new Date()
            return (
              <div
                key={plan.id}
                className={cn(
                  "bg-white rounded-lg border border-l-[3px] overflow-hidden hover:shadow-sm transition-all",
                  isOverdue ? "border-red-200 border-l-red-400" : "border-gray-200 border-l-emerald-400"
                )}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <ClipboardCheck className="h-4 w-4 text-[#0f2440]" />
                        <p className="text-[14px] font-bold text-gray-900">{plan.customer?.name}</p>
                      </div>
                      <p className="text-[12px] text-gray-400 ml-6">{plan.customer?.email}</p>
                    </div>
                    <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", style.badge)}>
                      {pkg?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[12px] text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Started {formatDate(plan.startDate)}
                    </span>
                    {plan.nextServiceDate && (
                      <span className={cn("flex items-center gap-1", isOverdue && "text-red-600 font-semibold")}>
                        <Calendar className="h-3 w-3" />
                        Next: {formatDate(plan.nextServiceDate)}
                        {isOverdue && " ⚠"}
                      </span>
                    )}
                  </div>

                  {plan.visits.length > 0 && (
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Recent Visits</p>
                      {plan.visits.slice(0, 2).map((visit) => (
                        <div key={visit.id} className="flex items-center justify-between text-[12px] mb-1.5">
                          <span className="flex items-center gap-1.5 text-gray-600">
                            <User className="h-3 w-3" /> {visit.engineer?.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">{formatDate(visit.scheduledDate)}</span>
                            {visit.completedDate
                              ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              : <Clock className="h-3.5 w-3.5 text-amber-400" />
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List view */}
      {view === "list" && plans.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Plan</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Started</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Next Service</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Visits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {plans.map((plan) => {
                const pkg = MAINTENANCE_PACKAGES[plan.packageType as keyof typeof MAINTENANCE_PACKAGES]
                const style = PACKAGE_STYLE[plan.packageType] || { badge: "bg-gray-100 text-gray-700", bar: "" }
                const isOverdue = plan.nextServiceDate && new Date(plan.nextServiceDate) < new Date()
                return (
                  <tr key={plan.id} className={cn("hover:bg-gray-50/50 transition-colors", isOverdue && "bg-red-50/30")}>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900">{plan.customer?.name}</p>
                      <p className="text-[11px] text-gray-400">{plan.customer?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", style.badge)}>
                        {pkg?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                        plan.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                      )}>
                        {plan.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(plan.startDate)}</td>
                    <td className={cn("px-4 py-3", isOverdue ? "text-red-600 font-semibold" : "text-gray-500")}>
                      {plan.nextServiceDate ? formatDate(plan.nextServiceDate) : "—"}
                      {isOverdue && " ⚠"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{plan.visits.length}</td>
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
