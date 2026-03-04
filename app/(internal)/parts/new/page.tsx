"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sparePartSchema, type SparePartInput } from "@/lib/validations"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Package, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

const CATEGORIES = [
  "Filters", "Batteries", "Alternator Parts", "Engine Parts",
  "Electrical", "Cooling System", "Fuel System", "Control Panels",
  "Exhaust", "Belts & Hoses", "Lubricants", "Tools", "Other",
]

export default function NewPartPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<SparePartInput>({ resolver: zodResolver(sparePartSchema) as any,
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      stockQuantity: 1,
      reorderLevel: 5,
      sku: "",
      compatibility: "",
      description: "",
    },
  })

  async function onSubmit(data: SparePartInput) {
    setLoading(true)
    try {
      const res = await fetch("/api/parts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to add part")
      }
      toast.success(`${data.name} added to inventory`)
      router.push("/parts")
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
          <Link href="/parts"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Add Spare Part</h1>
          <p className="text-[13px] text-gray-500">Add a new item to the parts inventory</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Part Identity */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3 border-b border-gray-100 bg-gray-50">
              <Package className="h-4 w-4 text-[#0f2440]" />
              <h2 className="text-[13px] font-semibold text-gray-800">Part Information</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-[13px]">Part Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Oil Filter — Caterpillar C9" className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-[13px]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">SKU / Part Number (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CAT-1R0762" className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">Unit Price (₦)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 15000"
                        className="h-9 text-[13px]"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">Opening Stock Qty</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 10"
                        className="h-9 text-[13px]"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reorderLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">Reorder Level</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 5"
                        className="h-9 text-[13px]"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compatibility"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-[13px]">Compatible With (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Caterpillar C9, C13 / Perkins 1006" className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-[13px]">Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional details about the part..."
                        rows={3}
                        className="text-[13px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              className="bg-[#0f2440] hover:bg-[#0f2440]/90 h-9 text-[13px] px-6"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Part
            </Button>
            <Button asChild variant="outline" className="h-9 text-[13px]" disabled={loading}>
              <Link href="/parts">Cancel</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
