import { cn } from "@/lib/utils"
import {
  RENTAL_STATUS_COLORS,
  REPAIR_STATUS_COLORS,
  ORDER_STATUS_COLORS,
  GENERATOR_STATUS_COLORS,
} from "@/lib/constants"
import type { RentalStatus, RepairStatus, OrderStatus, GeneratorStatus } from "@/types"

type StatusType = "rental" | "repair" | "order" | "generator"

interface StatusBadgeProps {
  status: string
  type: StatusType
  className?: string
}

const STATUS_LABELS: Record<string, string> = {
  BOOKED: "Booked",
  CONFIRMED: "Confirmed",
  DISPATCHED: "Dispatched",
  DELIVERED: "Delivered",
  INSTALLED: "Installed",
  ACTIVE: "Active",
  PICKUP_SCHEDULED: "Pickup Scheduled",
  RETURNED: "Returned",
  INSPECTED: "Inspected",
  CANCELLED: "Cancelled",
  SUBMITTED: "Submitted",
  ASSESSED: "Assessed",
  QUOTE_SENT: "Quote Sent",
  APPROVED: "Approved",
  IN_PROGRESS: "In Progress",
  PARTS_ORDERED: "Parts Ordered",
  COMPLETED: "Completed",
  INVOICED: "Invoiced",
  PAID: "Paid",
  PENDING: "Pending",
  PROCESSING: "Processing",
  AVAILABLE: "Available",
  RENTED: "Rented",
  MAINTENANCE: "Maintenance",
  OUT_OF_SERVICE: "Out of Service",
  STANDARD: "Standard",
  URGENT: "Urgent",
  EMERGENCY: "Emergency",
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  let colorClass = "bg-gray-100 text-gray-800"

  if (type === "rental") colorClass = RENTAL_STATUS_COLORS[status as RentalStatus] || colorClass
  else if (type === "repair") colorClass = REPAIR_STATUS_COLORS[status as RepairStatus] || colorClass
  else if (type === "order") colorClass = ORDER_STATUS_COLORS[status as OrderStatus] || colorClass
  else if (type === "generator") colorClass = GENERATOR_STATUS_COLORS[status as GeneratorStatus] || colorClass

  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", colorClass, className)}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export function UrgencyBadge({ urgency }: { urgency: string }) {
  const colors: Record<string, string> = {
    STANDARD: "bg-gray-100 text-gray-700",
    URGENT: "bg-orange-100 text-orange-700",
    EMERGENCY: "bg-red-100 text-red-700",
  }
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", colors[urgency] || colors.STANDARD)}>
      {urgency === "EMERGENCY" ? "🚨 " : urgency === "URGENT" ? "⚡ " : ""}
      {STATUS_LABELS[urgency] || urgency}
    </span>
  )
}
