"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ViewToggle } from "@/components/shared/ViewToggle"
import { formatDate, getInitials, cn } from "@/lib/utils"
import { ROLE_LABELS } from "@/lib/constants"
import { Users, Plus, X, Loader2, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import type { Role } from "@/types"

interface StaffMember {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  isActive: boolean
  createdAt: Date
  _count: { assignedRentals: number; assignedRepairs: number }
}

const ROLE_STYLE: Record<string, { badge: string; bar: string }> = {
  ADMIN:            { badge: "bg-[#0f2440] text-white",          bar: "bg-[#0f2440]"    },
  CUSTOMER_SERVICE: { badge: "bg-indigo-100 text-indigo-800",     bar: "bg-indigo-500"   },
  ENGINEER:         { badge: "bg-orange-100 text-orange-800",     bar: "bg-orange-400"   },
}

function AddStaffModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "ENGINEER", phone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim() || form.name.length < 2) e.name = "Name must be at least 2 characters"
    if (!form.email.includes("@")) e.email = "Valid email required"
    if (form.password.length < 6) e.password = "Password must be at least 6 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: form.phone || undefined }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(Array.isArray(err.error) ? err.error[0]?.message : err.error || "Failed to add staff")
      }
      toast.success(`${form.name} added to team`)
      router.refresh()
      onClose()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Add Staff Member</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">Create a new team account</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Emeka Nwosu"
              className="w-full h-9 px-3 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2440]/20 focus:border-[#0f2440]"
            />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. emeka@pps.ng"
              className="w-full h-9 px-3 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2440]/20 focus:border-[#0f2440]"
            />
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Temporary Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters"
              className="w-full h-9 px-3 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2440]/20 focus:border-[#0f2440]"
            />
            {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full h-9 px-3 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2440]/20 focus:border-[#0f2440] bg-white"
            >
              <option value="ENGINEER">Engineer</option>
              <option value="CUSTOMER_SERVICE">Customer Service</option>
              <option value="ADMIN">Administrator</option>
            </select>
            <p className="text-[11px] text-gray-400 mt-1">
              {form.role === "ADMIN" && "Full access — can manage all settings, staff, and data."}
              {form.role === "CUSTOMER_SERVICE" && "Can manage rentals, repairs, orders, and communicate with customers."}
              {form.role === "ENGINEER" && "Can view and update assigned jobs, log field reports and maintenance visits."}
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[12px] font-semibold text-gray-700 mb-1.5">Phone (optional)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="e.g. 08012345678"
              className="w-full h-9 px-3 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2440]/20 focus:border-[#0f2440]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-[#0f2440] hover:bg-[#0f2440]/90 text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Add Staff Member
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[13px] text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function StaffView({ staff, isAdmin }: { staff: StaffMember[]; isAdmin: boolean }) {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [showAdd, setShowAdd] = useState(false)

  const byRole = staff.reduce((acc, s) => {
    if (!acc[s.role]) acc[s.role] = []
    acc[s.role].push(s)
    return acc
  }, {} as Record<string, StaffMember[]>)

  const roleOrder = ["ADMIN", "CUSTOMER_SERVICE", "ENGINEER"]

  return (
    <div className="space-y-5">
      {showAdd && <AddStaffModal onClose={() => setShowAdd(false)} />}

      <div className="flex items-center justify-between">
        <p className="text-[13px] text-gray-500">
          <span className="font-semibold text-gray-900">{staff.length}</span> team member{staff.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 bg-[#0f2440] hover:bg-[#0f2440]/90 text-white text-[13px] font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Staff
            </button>
          )}
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {staff.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-[15px] font-semibold text-gray-500">No staff yet</p>
        </div>
      )}

      {/* Grid view — grouped by role */}
      {view === "grid" && staff.length > 0 && (
        <div className="space-y-6">
          {roleOrder.filter((r) => byRole[r]?.length).map((role) => {
            const style = ROLE_STYLE[role] || { badge: "bg-gray-100 text-gray-700", bar: "bg-gray-400" }
            return (
              <div key={role}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn("h-2.5 w-2.5 rounded-full", style.bar)} />
                  <h3 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                    {ROLE_LABELS[role as Role]} <span className="text-gray-400 font-normal">({byRole[role].length})</span>
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {byRole[role].map((member) => (
                    <div
                      key={member.id}
                      className="bg-white rounded-lg border border-l-[3px] border-gray-200 border-l-[#0f2440] hover:shadow-sm transition-all"
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-9 h-9 bg-[#0f2440] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[12px] font-bold text-white">{getInitials(member.name)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-bold text-gray-900 truncate">{member.name}</p>
                              {!member.isActive && (
                                <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-gray-400 truncate">{member.email}</p>
                            {member.phone && (
                              <p className="text-[12px] text-gray-400">{member.phone}</p>
                            )}
                          </div>
                        </div>
                        {(member.role === "ENGINEER" || member.role === "CUSTOMER_SERVICE") && (
                          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-center">
                            <div>
                              <p className="text-[15px] font-bold text-[#0f2440]">{member._count.assignedRentals}</p>
                              <p className="text-[10px] text-gray-400">Rentals</p>
                            </div>
                            <div>
                              <p className="text-[15px] font-bold text-[#0f2440]">{member._count.assignedRepairs}</p>
                              <p className="text-[10px] text-gray-400">Repairs</p>
                            </div>
                          </div>
                        )}
                        <p className="text-[11px] text-gray-400 mt-2.5">Joined {formatDate(member.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List view */}
      {view === "list" && staff.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Rentals</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Repairs</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {staff.map((member) => {
                const style = ROLE_STYLE[member.role] || { badge: "bg-gray-100 text-gray-700", bar: "" }
                return (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[#0f2440] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-white">{getInitials(member.name)}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", style.badge)}>
                        {ROLE_LABELS[member.role as Role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3 text-gray-400" /> {member.email}
                      </p>
                      {member.phone && (
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" /> {member.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-[#0f2440]">{member._count.assignedRentals}</td>
                    <td className="px-4 py-3 text-center font-semibold text-[#0f2440]">{member._count.assignedRepairs}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(member.createdAt)}</td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                        member.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                      )}>
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
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
