"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { rentalRequestSchema, type RentalRequestInput } from "@/lib/validations"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { KVA_OPTIONS, LAGOS_LGAS, EVENT_TYPES } from "@/lib/constants"
import { calculateRentalCost, formatNaira } from "@/lib/utils"
import { Zap, Calculator, Loader2 } from "lucide-react"

export default function NewRentalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [estimate, setEstimate] = useState<number | null>(null)

  const form = useForm<RentalRequestInput>({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: {
      kvaNeeded: 60,
      startDate: "",
      endDate: "",
      deliveryAddress: "",
      deliveryLGA: "",
      eventType: "",
      itemsToPower: "",
      notes: "",
    },
  })

  const kva = form.watch("kvaNeeded")
  const startDate = form.watch("startDate")
  const endDate = form.watch("endDate")
  const lga = form.watch("deliveryLGA")

  function recalculate() {
    if (kva && startDate && endDate && lga) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (end > start) {
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        setEstimate(calculateRentalCost(kva, days, lga))
      }
    }
  }

  async function onSubmit(data: RentalRequestInput) {
    setLoading(true)
    try {
      const res = await fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success("Rental request submitted! We'll confirm shortly.")
      router.push("/portal/rentals")
    } catch {
      toast.error("Submission failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A5C]">Book a Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details and we'll get back to you with confirmation</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1B3A5C] text-base flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Power Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="kvaNeeded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KVA Capacity Needed</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => { field.onChange(Number(v)); recalculate() }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select KVA" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {KVA_OPTIONS.map((kva) => (
                          <SelectItem key={kva} value={String(kva)}>{kva} KVA</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">Not sure? Call us: 07038581722</p>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} onChange={(e) => { field.onChange(e); recalculate() }} min={new Date().toISOString().split("T")[0]} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} onChange={(e) => { field.onChange(e); recalculate() }} min={startDate || new Date().toISOString().split("T")[0]} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event / Use Type</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EVENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="itemsToPower"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Items to Power (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g. AC units, lighting, sound system, fridges..." rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#1B3A5C] text-base">Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="deliveryLGA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (LGA)</FormLabel>
                    <Select value={field.value} onValueChange={(v) => { field.onChange(v); recalculate() }}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LAGOS_LGAS.map((lga) => (
                          <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Delivery Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter full address including street, landmark..." rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any special requirements or access instructions..." rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Cost estimate */}
          {estimate !== null && (
            <Card className="bg-[#1B3A5C]/5 border-[#1B3A5C]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4 text-[#1B3A5C]" />
                  <p className="text-sm font-semibold text-[#1B3A5C]">Estimated Cost</p>
                </div>
                <p className="text-2xl font-bold text-[#D4A843]">{formatNaira(estimate)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Includes rental fee + delivery charge. Final price confirmed after booking review.
                </p>
              </CardContent>
            </Card>
          )}

          <Button type="submit" className="w-full bg-[#1B3A5C] hover:bg-[#1B3A5C]/90 h-12 text-base" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Rental Request
          </Button>
        </form>
      </Form>
    </div>
  )
}
