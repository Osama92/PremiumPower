"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { generatorSchema, type GeneratorInput } from "@/lib/validations"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Gauge, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

const BRANDS = ["Caterpillar", "Cummins", "Perkins", "FG Wilson", "Lister", "Mantrac", "Aggreko", "Kirloskar", "Other"]
const KVA_OPTIONS = [7, 10, 15, 20, 30, 40, 60, 100, 150, 200, 250, 300, 350, 400, 500, 750, 1000, 1500]
const FUEL_TYPES = ["Diesel", "Petrol", "Gas", "Dual Fuel"]
const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RENTED", label: "Rented" },
  { value: "MAINTENANCE", label: "Under Maintenance" },
  { value: "OUT_OF_SERVICE", label: "Out of Service" },
]

export default function NewGeneratorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<GeneratorInput>({ resolver: zodResolver(generatorSchema) as any,
    defaultValues: {
      brand: "",
      model: "",
      kvaCapacity: 60,
      serialNumber: "",
      status: "AVAILABLE",
      fuelType: "Diesel",
      location: "",
      notes: "",
    },
  })

  async function onSubmit(data: GeneratorInput) {
    setLoading(true)
    try {
      const res = await fetch("/api/generators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to create generator")
      }
      const gen = await res.json()
      toast.success(`${data.brand} ${data.model} added to fleet`)
      router.push(`/fleet/${gen.id}`)
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
          <Link href="/fleet"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Add Generator</h1>
          <p className="text-[13px] text-gray-500">Register a new unit to the fleet</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Unit Identity */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3 border-b border-gray-100 bg-gray-50">
              <Gauge className="h-4 w-4 text-[#0f2440]" />
              <h2 className="text-[13px] font-semibold text-gray-800">Unit Details</h2>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">Brand</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-[13px]">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BRANDS.map((b) => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. C60 D6, 6BTA5.9-G2" className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kvaCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">KVA Capacity</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 text-[13px]">
                          <SelectValue placeholder="Select KVA" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {KVA_OPTIONS.map((k) => (
                          <SelectItem key={k} value={String(k)}>{k} KVA</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CAT-2023-001" className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">Fuel Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-[13px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FUEL_TYPES.map((f) => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px]">Initial Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 text-[13px]">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-[13px]">Current Location (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Yard A, Lekki Workshop" className="h-9 text-[13px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="text-[13px]">Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any notes about condition, history, specs..."
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
              Add to Fleet
            </Button>
            <Button asChild variant="outline" className="h-9 text-[13px]" disabled={loading}>
              <Link href="/fleet">Cancel</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
