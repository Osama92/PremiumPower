"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RENTED", label: "Rented" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OUT_OF_SERVICE", label: "Out of Service" },
]

export function GeneratorStatusUpdate({ generatorId, currentStatus }: { generatorId: string; currentStatus: string }) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function update() {
    if (status === currentStatus) return
    setLoading(true)
    try {
      const res = await fetch(`/api/generators/${generatorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      toast.success("Status updated")
      router.refresh()
    } catch {
      toast.error("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={update}
        disabled={loading || status === currentStatus}
        className="bg-[#1B3A5C]"
        size="sm"
      >
        Update
      </Button>
    </div>
  )
}
