"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Settings } from "lucide-react"

const STATUS_OPTIONS = [
  "BOOKED", "CONFIRMED", "DISPATCHED", "DELIVERED",
  "INSTALLED", "ACTIVE", "PICKUP_SCHEDULED", "RETURNED", "INSPECTED", "CANCELLED"
]

const STATUS_LABELS: Record<string, string> = {
  BOOKED: "Booked", CONFIRMED: "Confirmed", DISPATCHED: "Dispatched",
  DELIVERED: "Delivered", INSTALLED: "Installed", ACTIVE: "Active",
  PICKUP_SCHEDULED: "Pickup Scheduled", RETURNED: "Returned",
  INSPECTED: "Inspected", CANCELLED: "Cancelled",
}

interface Props {
  rentalId: string
  currentStatus: string
  engineers: { id: string; name: string }[]
  currentEngineerId?: string
  availableGenerators: { id: string; brand: string; model: string; kvaCapacity: number }[]
  currentGeneratorId?: string
}

export function RentalStatusUpdate({ rentalId, currentStatus, engineers, currentEngineerId, availableGenerators, currentGeneratorId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [engineerId, setEngineerId] = useState(currentEngineerId || "")
  const [generatorId, setGeneratorId] = useState(currentGeneratorId || "")
  const [loading, setLoading] = useState(false)

  async function save() {
    setLoading(true)
    try {
      const body: Record<string, unknown> = { status }
      if (engineerId) body.engineerId = engineerId
      if (generatorId) body.generatorId = generatorId

      const res = await fetch(`/api/rentals/${rentalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      toast.success("Rental updated")
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#1B3A5C]">
          <Settings className="mr-2 h-4 w-4" />
          Update Rental
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Rental</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Assign Engineer</Label>
            <Select value={engineerId} onValueChange={setEngineerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select engineer" />
              </SelectTrigger>
              <SelectContent>
                {engineers.map((eng) => (
                  <SelectItem key={eng.id} value={eng.id}>{eng.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {availableGenerators.length > 0 && (
            <div>
              <Label>Assign Generator</Label>
              <Select value={generatorId} onValueChange={setGeneratorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select generator" />
                </SelectTrigger>
                <SelectContent>
                  {availableGenerators.map((gen) => (
                    <SelectItem key={gen.id} value={gen.id}>
                      {gen.brand} {gen.model} — {gen.kvaCapacity}KVA
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={save} disabled={loading} className="w-full bg-[#1B3A5C]">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
