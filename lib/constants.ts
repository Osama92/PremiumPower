import type { RentalStatus, RepairStatus, OrderStatus, GeneratorStatus, Role } from "@/types";

// KVA pricing tiers (₦ per day)
export const KVA_PRICING: Record<string, number> = {
  "7": 12000,
  "10": 12000,
  "20": 15000,
  "30": 28000,
  "40": 28000,
  "60": 35000,
  "100": 65000,
  "150": 90000,
  "200": 120000,
  "250": 150000,
  "350": 200000,
  "500": 280000,
  "650": 350000,
};

export const KVA_OPTIONS = [7, 10, 20, 30, 40, 60, 100, 150, 200, 250, 350, 500, 650];

// Duration multipliers
export const DURATION_MULTIPLIERS: Record<string, number> = {
  hourly: 0.1, // 10% of daily rate per hour
  daily: 1.0,
  weekly: 0.85, // 15% discount
  monthly: 0.75, // 25% discount
};

// Delivery charges by LGA (₦)
export const DELIVERY_CHARGES: Record<string, number> = {
  "Victoria Island": 15000,
  "Lekki Phase 1": 15000,
  "Lekki Phase 2": 18000,
  "Ikoyi": 15000,
  "Ajah": 22000,
  "Sangotedo": 25000,
  "Ikeja": 20000,
  "Surulere": 20000,
  "Yaba": 20000,
  "Apapa": 25000,
  "Lagos Island": 20000,
  "Festac": 28000,
  "Gbagada": 22000,
  "Magodo": 25000,
  "Maryland": 22000,
  "Other": 35000,
};

export const LAGOS_LGAS = Object.keys(DELIVERY_CHARGES);

// Status colors
export const RENTAL_STATUS_COLORS: Record<RentalStatus, string> = {
  BOOKED: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-indigo-100 text-indigo-800",
  DISPATCHED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-cyan-100 text-cyan-800",
  INSTALLED: "bg-teal-100 text-teal-800",
  ACTIVE: "bg-green-100 text-green-800",
  PICKUP_SCHEDULED: "bg-orange-100 text-orange-800",
  RETURNED: "bg-yellow-100 text-yellow-800",
  INSPECTED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const REPAIR_STATUS_COLORS: Record<RepairStatus, string> = {
  SUBMITTED: "bg-blue-100 text-blue-800",
  ASSESSED: "bg-indigo-100 text-indigo-800",
  QUOTE_SENT: "bg-purple-100 text-purple-800",
  APPROVED: "bg-cyan-100 text-cyan-800",
  IN_PROGRESS: "bg-orange-100 text-orange-800",
  PARTS_ORDERED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  INVOICED: "bg-teal-100 text-teal-800",
  PAID: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-indigo-100 text-indigo-800",
  DISPATCHED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export const GENERATOR_STATUS_COLORS: Record<GeneratorStatus, string> = {
  AVAILABLE: "bg-green-100 text-green-800",
  RENTED: "bg-blue-100 text-blue-800",
  MAINTENANCE: "bg-yellow-100 text-yellow-800",
  OUT_OF_SERVICE: "bg-red-100 text-red-800",
};

// Rental status steps for timeline
export const RENTAL_STATUS_STEPS: { status: RentalStatus; label: string }[] = [
  { status: "BOOKED", label: "Booking Received" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "DISPATCHED", label: "Dispatched" },
  { status: "DELIVERED", label: "Delivered" },
  { status: "INSTALLED", label: "Installed" },
  { status: "ACTIVE", label: "Active" },
  { status: "PICKUP_SCHEDULED", label: "Pickup Scheduled" },
  { status: "RETURNED", label: "Returned" },
  { status: "INSPECTED", label: "Inspected" },
];

export const REPAIR_STATUS_STEPS: { status: RepairStatus; label: string }[] = [
  { status: "SUBMITTED", label: "Submitted" },
  { status: "ASSESSED", label: "Assessed" },
  { status: "QUOTE_SENT", label: "Quote Sent" },
  { status: "APPROVED", label: "Approved" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "PARTS_ORDERED", label: "Parts Ordered" },
  { status: "COMPLETED", label: "Completed" },
  { status: "INVOICED", label: "Invoiced" },
  { status: "PAID", label: "Paid" },
];

// Maintenance packages
export const MAINTENANCE_PACKAGES = {
  BASIC: {
    name: "Basic Plan",
    description: "Quarterly service",
    frequency: "Every 3 months",
    price: 45000,
    includes: [
      "Oil & filter change",
      "Air filter check",
      "Battery check",
      "Visual inspection",
      "Basic load test",
    ],
  },
  STANDARD: {
    name: "Standard Plan",
    description: "Bi-monthly service",
    frequency: "Every 2 months",
    price: 75000,
    includes: [
      "Everything in Basic",
      "Fuel filter replacement",
      "Coolant check",
      "Spark plug/injector check",
      "Full load test",
      "Report & recommendations",
    ],
  },
  PREMIUM: {
    name: "Premium Plan",
    description: "Monthly service",
    frequency: "Every month",
    price: 120000,
    includes: [
      "Everything in Standard",
      "Full diagnostic scan",
      "Radiator flush",
      "Belt & hose inspection",
      "AVR & control panel check",
      "24/7 emergency response",
      "Priority technician dispatch",
    ],
  },
};

// Navigation items per role
export const ADMIN_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Generator Fleet", href: "/fleet", icon: "Gauge" },
  { label: "Rentals", href: "/rentals", icon: "CalendarDays" },
  { label: "Repairs", href: "/repairs", icon: "Wrench" },
  { label: "Spare Parts", href: "/parts", icon: "Package" },
  { label: "Orders", href: "/orders", icon: "ShoppingCart" },
  { label: "Maintenance", href: "/maintenance", icon: "ClipboardCheck" },
  { label: "Customers", href: "/customers", icon: "Users" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Articles", href: "/articles", icon: "BookOpen" },
  { label: "Messages", href: "/messages", icon: "MessageSquare" },
  { label: "Staff", href: "/staff", icon: "UserCog" },
];

export const CS_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Rentals", href: "/rentals", icon: "CalendarDays" },
  { label: "Repairs", href: "/repairs", icon: "Wrench" },
  { label: "Spare Parts", href: "/parts", icon: "Package" },
  { label: "Orders", href: "/orders", icon: "ShoppingCart" },
  { label: "Customers", href: "/customers", icon: "Users" },
  { label: "Messages", href: "/messages", icon: "MessageSquare" },
];

export const ENGINEER_NAV = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "My Jobs", href: "/jobs", icon: "ClipboardList" },
  { label: "Rentals", href: "/rentals", icon: "CalendarDays" },
  { label: "Repairs", href: "/repairs", icon: "Wrench" },
  { label: "Maintenance", href: "/maintenance", icon: "ClipboardCheck" },
  { label: "Fleet", href: "/fleet", icon: "Gauge" },
  { label: "Messages", href: "/messages", icon: "MessageSquare" },
];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrator",
  CUSTOMER_SERVICE: "Customer Service",
  ENGINEER: "Engineer",
  CUSTOMER: "Customer",
};

export const GENERATOR_BRANDS = ["Caterpillar", "Cummins", "Perkins", "FG Wilson", "Lister", "Kohler", "Aggreko", "Honda", "Kipor"];

export const EVENT_TYPES = [
  "Wedding/Event",
  "Office/Commercial",
  "Construction Site",
  "Healthcare/Hospital",
  "Residential",
  "Telecommunications",
  "Manufacturing",
  "Data Center",
  "Other",
];

export const SPARE_PART_CATEGORIES = [
  "Filters",
  "Batteries",
  "Alternators",
  "Starters",
  "Belts & Hoses",
  "Control Panels",
  "AVR Modules",
  "Cooling System",
  "Fuel System",
  "Electrical",
  "Gaskets & Seals",
  "Other",
];
