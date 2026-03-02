"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { repairRequestSchema, type RepairRequestInput } from "@/lib/validations"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { GENERATOR_BRANDS } from "@/lib/constants"
import { Wrench, Loader2, AlertTriangle } from "lucide-react"

export default function NewRepairPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<RepairRequestInput>({
    resolver: zodResolver(repairRequestSchema),
    defaultValues: {
      generatorBrand: "",
      generatorModel: "",
      problemDescription: "",
      urgency: "STANDARD",
      location: "",
      notes: "",
    },
  })

  async function onSubmit(data: RepairRequestInput) {
    setLoading(true)
    try {
      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success("Repair request submitted! Our team will contact you shortly.")
      router.push("/portal/repairs")
    } catch {
      toast.error("Submission failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A5C]">Request Generator Repair</h1>
        <p className="text-sm text-muted-foreground mt-1">Describe your problem and our engineers will handle it</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1B3A5C] text-base flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Generator Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="generatorBrand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Generator Brand *</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GENERATOR_BRANDS.map((b) => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generatorModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. CAT C9, P110, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="problemDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problem Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the issue in detail — when it started, what symptoms you observe, any error codes..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency Level</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STANDARD">Standard — Within 24-48 hours</SelectItem>
                        <SelectItem value="URGENT">Urgent — Same day</SelectItem>
                        <SelectItem value="EMERGENCY">🚨 Emergency — Immediate response</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("urgency") === "EMERGENCY" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">Emergency requests are treated immediately. Additional charges may apply. You can also call us directly: <strong>07038581722</strong></p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#1B3A5C] text-base">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generator Location *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Full address where the generator is located..." rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-[#1B3A5C] h-12 text-base" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Repair Request
          </Button>
        </form>
      </Form>
    </div>
  )
}
