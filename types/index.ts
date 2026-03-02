export type Role = "ADMIN" | "CUSTOMER_SERVICE" | "ENGINEER" | "CUSTOMER";

export type GeneratorStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE" | "OUT_OF_SERVICE";

export type RentalStatus =
  | "BOOKED"
  | "CONFIRMED"
  | "DISPATCHED"
  | "DELIVERED"
  | "INSTALLED"
  | "ACTIVE"
  | "PICKUP_SCHEDULED"
  | "RETURNED"
  | "INSPECTED"
  | "CANCELLED";

export type RepairStatus =
  | "SUBMITTED"
  | "ASSESSED"
  | "QUOTE_SENT"
  | "APPROVED"
  | "IN_PROGRESS"
  | "PARTS_ORDERED"
  | "COMPLETED"
  | "INVOICED"
  | "PAID"
  | "CANCELLED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "DISPATCHED"
  | "DELIVERED"
  | "CANCELLED";

export type MaintenancePackage = "BASIC" | "STANDARD" | "PREMIUM";
export type UrgencyLevel = "STANDARD" | "URGENT" | "EMERGENCY";
export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category: string;
}

export interface KPIData {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
