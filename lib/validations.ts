import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const rentalRequestSchema = z.object({
  kvaNeeded: z.number().min(7).max(1500),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  deliveryAddress: z.string().min(5, "Please enter a full delivery address"),
  deliveryLGA: z.string().min(1, "Please select your area"),
  eventType: z.string().optional(),
  itemsToPower: z.string().optional(),
  notes: z.string().optional(),
})

export const repairRequestSchema = z.object({
  generatorBrand: z.string().min(1, "Generator brand is required"),
  generatorModel: z.string().optional(),
  problemDescription: z.string().min(10, "Please describe the problem in detail"),
  urgency: z.enum(["STANDARD", "URGENT", "EMERGENCY"]),
  location: z.string().min(5, "Please enter the generator location"),
  notes: z.string().optional(),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(11, "Please enter a valid Nigerian phone number").optional(),
  address: z.string().optional(),
})

export const createStaffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "CUSTOMER_SERVICE", "ENGINEER"]),
  phone: z.string().optional(),
})

export const generatorSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  kvaCapacity: z.number().min(1),
  serialNumber: z.string().min(1, "Serial number is required"),
  status: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE", "OUT_OF_SERVICE"]),
  fuelType: z.string().default("Diesel"),
  location: z.string().optional(),
  notes: z.string().optional(),
})

export const sparePartSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().min(0),
  stockQuantity: z.number().min(0),
  compatibility: z.string().optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
  reorderLevel: z.number().min(0).default(5),
})

export const articleSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(50),
  excerpt: z.string().optional(),
  category: z.string().min(1),
  published: z.boolean().default(false),
})

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(5),
  deliveryOption: z.enum(["standard", "express", "same_day"]),
  notes: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RentalRequestInput = z.infer<typeof rentalRequestSchema>
export type RepairRequestInput = z.infer<typeof repairRequestSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type GeneratorInput = z.infer<typeof generatorSchema>
export type SparePartInput = z.infer<typeof sparePartSchema>
export type ArticleInput = z.infer<typeof articleSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
