import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format Nigerian Naira
export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

// Format date in WAT (Africa/Lagos)
export function formatDate(date: Date | string, fmt = "dd MMM yyyy"): string {
  return format(new Date(date), fmt)
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy, h:mm a")
}

export function timeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

// Format Nigerian phone number
export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, "")
  if (clean.length === 11) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`
  }
  return phone
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Truncate text
export function truncate(text: string, length = 100): string {
  if (text.length <= length) return text
  return `${text.slice(0, length)}...`
}

// Generate a simple slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// Calculate rental cost
export function calculateRentalCost(
  kva: number,
  days: number,
  lga: string
): number {
  const KVA_PRICING: Record<number, number> = {
    7: 12000, 10: 12000, 20: 15000, 30: 28000, 40: 28000,
    60: 35000, 100: 65000, 150: 90000, 200: 120000,
    250: 150000, 350: 200000, 500: 280000, 650: 350000,
  }
  const DELIVERY: Record<string, number> = {
    "Victoria Island": 15000, "Lekki Phase 1": 15000, "Ikoyi": 15000,
    "Lekki Phase 2": 18000, "Ajah": 22000, "Ikeja": 20000,
    "Surulere": 20000, "Yaba": 20000, "Gbagada": 22000,
    "Maryland": 22000, "Apapa": 25000, "Magodo": 25000,
    "Festac": 28000, "Other": 35000,
  }

  // Find closest KVA tier
  const tiers = Object.keys(KVA_PRICING).map(Number).sort((a, b) => a - b)
  const tier = tiers.find((t) => t >= kva) || tiers[tiers.length - 1]
  const dailyRate = KVA_PRICING[tier] || 35000

  // Weekly/monthly discounts
  let multiplier = 1.0
  if (days >= 30) multiplier = 0.75
  else if (days >= 7) multiplier = 0.85

  const rentalCost = dailyRate * days * multiplier
  const deliveryCost = DELIVERY[lga] || 35000

  return Math.round(rentalCost + deliveryCost)
}

// Parse JSON safely
export function safeParseJSON<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback
  try {
    return JSON.parse(str) as T
  } catch {
    return fallback
  }
}
